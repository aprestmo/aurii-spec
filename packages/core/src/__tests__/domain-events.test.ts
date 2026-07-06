/**
 * Internal domain events tests.
 */

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { clearHandlers, emit, on, onAny } from "../events/emitter";
import type { DomainEvent, EntityCreatedEvent } from "../events/types";

beforeEach(() => {
	clearHandlers();
});

afterEach(() => {
	clearHandlers();
});

describe("emit + on", () => {
	test("dispatches events to matching handlers", () => {
		const received: DomainEvent[] = [];

		on("entity.created", (e) => received.push(e));

		emit({
			type: "entity.created",
			entityId: "ent-1",
			schemaId: "article",
			datasetId: "default",
		});

		expect(received).toHaveLength(1);
		const evt = received[0] as EntityCreatedEvent;
		expect(evt.entityId).toBe("ent-1");
		expect(evt.schemaId).toBe("article");
	});

	test("enriches event with id and timestamp", () => {
		let captured: DomainEvent | undefined;

		on("entity.created", (e) => {
			captured = e;
		});

		emit({
			type: "entity.created",
			entityId: "ent-2",
			schemaId: "product",
			datasetId: "default",
		});

		expect(captured).toBeDefined();
		expect(captured!.id).toBeDefined();
		expect(captured!.timestamp).toBeDefined();
	});

	test("does not dispatch to handlers of other event types", () => {
		const datasetEvents: DomainEvent[] = [];
		const entityEvents: DomainEvent[] = [];

		on("dataset.created", (e) => datasetEvents.push(e));
		on("entity.created", (e) => entityEvents.push(e));

		emit({
			type: "entity.created",
			entityId: "x",
			schemaId: "s",
			datasetId: "d",
		});

		expect(entityEvents).toHaveLength(1);
		expect(datasetEvents).toHaveLength(0);
	});

	test("returns an unsubscribe function", () => {
		const calls: DomainEvent[] = [];
		const unsub = on("import.started", (e) => calls.push(e));

		emit({
			type: "import.started",
			runId: "r1",
			definitionId: "def1",
			schemaId: "s",
			datasetId: "d",
			dryRun: false,
		});
		expect(calls).toHaveLength(1);

		unsub();

		emit({
			type: "import.started",
			runId: "r2",
			definitionId: "def2",
			schemaId: "s",
			datasetId: "d",
			dryRun: false,
		});
		expect(calls).toHaveLength(1);
	});
});

describe("onAny", () => {
	test("receives all event types", () => {
		const all: DomainEvent[] = [];
		onAny((e) => all.push(e));

		emit({
			type: "dataset.created",
			datasetId: "ds1",
			name: "My Dataset",
		});
		emit({
			type: "entity.created",
			entityId: "e1",
			schemaId: "s1",
			datasetId: "ds1",
		});

		expect(all).toHaveLength(2);
		expect(all[0]!.type).toBe("dataset.created");
		expect(all[1]!.type).toBe("entity.created");
	});
});

describe("handler error isolation", () => {
	test("errors in one handler do not stop other handlers", () => {
		const calls: string[] = [];

		on("entity.deleted", () => {
			throw new Error("Handler boom");
		});
		on("entity.deleted", () => calls.push("second-handler"));

		expect(() =>
			emit({
				type: "entity.deleted",
				entityId: "e",
				schemaId: "s",
				datasetId: "d",
			}),
		).not.toThrow();

		expect(calls).toContain("second-handler");
	});
});

describe("import events", () => {
	test("import.started and import.finished carry runId", () => {
		const events: DomainEvent[] = [];
		on("import.started", (e) => events.push(e));
		on("import.finished", (e) => events.push(e));

		emit({
			type: "import.started",
			runId: "run-abc",
			definitionId: "def-abc",
			schemaId: "article",
			datasetId: "news",
			dryRun: false,
		});

		emit({
			type: "import.finished",
			runId: "run-abc",
			definitionId: "def-abc",
			schemaId: "article",
			datasetId: "news",
			dryRun: false,
			total: 100,
			imported: 98,
			failed: 2,
			durationMs: 150,
		});

		expect(events).toHaveLength(2);
	});
});
