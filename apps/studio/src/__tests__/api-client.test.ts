/**
 * Studio API client integration tests.
 *
 * These tests verify that the Studio's usage of @aurii/sdk is correct,
 * by running the SDK against an in-process Aurii Core instance.
 *
 * This indirectly validates the Studio's data-fetching layer without
 * requiring a browser or a real HTTP server.
 */

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
// Import Core directly (test environment, not browser)
// Path is relative from apps/studio/src/__tests__/ to repo root
import { buildApp } from "../../../../packages/core/src/api/server";
import { closeStorage, getStorage } from "../../../../packages/core/src/storage";
import { AuriiError, createClient } from "../../../../packages/sdk/src/index";

const MOCK_BASE = "http://localhost:3000";
const originalFetch = globalThis.fetch;

const app = buildApp({ apiToken: "studio-test-token" });

beforeAll(async () => {
	const storage = await getStorage();
	await storage.init();

	const mockFetch = async (
		input: RequestInfo | URL,
		init?: RequestInit,
	) => {
		const url =
			typeof input === "string"
				? input
				: input instanceof URL
					? input.toString()
					: (input as Request).url;
		if (url.startsWith(MOCK_BASE)) {
			return app.handle(new Request(url, init as RequestInit));
		}
		return originalFetch(input as RequestInfo, init);
	};
	// @ts-expect-error — replacing with compatible subset for testing
	globalThis.fetch = mockFetch;
});

afterAll(async () => {
	globalThis.fetch = originalFetch;
	await closeStorage();
});

const client = createClient({
	baseUrl: MOCK_BASE,
	token: "studio-test-token",
	defaultDataset: "default",
});

describe("Studio API client — datasets", () => {
	test("can list datasets", async () => {
		const datasets = await client.datasets.list();
		expect(Array.isArray(datasets)).toBe(true);
	});

	test("can create a dataset", async () => {
		const ds = await client.datasets.create({
			id: "studio-test",
			name: "Studio Test",
			description: "Created by Studio tests",
		});
		expect(ds.id).toBe("studio-test");
		expect(ds.name).toBe("Studio Test");
	});
});

describe("Studio API client — schemas", () => {
	test("can register a schema", async () => {
		const schema = await client.schemas.create({
			id: "studio-news",
			name: "News Article",
			fields: [
				{ name: "title", type: "string", required: true },
				{ name: "content", type: "string" },
				{ name: "published", type: "boolean" },
				{ name: "publishedAt", type: "date" },
			],
		});
		expect(schema.id).toBe("studio-news");
		expect(schema.fields).toHaveLength(4);
	});

	test("can list schemas", async () => {
		const schemas = await client.schemas.list();
		expect(schemas.some((s) => s.id === "studio-news")).toBe(true);
	});

	test("can get schema by id", async () => {
		const schema = await client.schemas.get("studio-news");
		expect(schema.name).toBe("News Article");
	});
});

describe("Studio API client — stats", () => {
	test("can get storage stats", async () => {
		const stats = await client.stats.get();
		expect(stats.datasetId).toBeDefined();
		expect(typeof stats.totalEntities).toBe("number");
		expect(Array.isArray(stats.schemas)).toBe(true);
	});
});

describe("Studio API client — health", () => {
	test("health check is accessible without token", async () => {
		const noAuthClient = createClient({ baseUrl: MOCK_BASE });
		const health = await noAuthClient.health.check();
		expect(health.status).toBe("ok");
		expect(health.version).toBe("0.2.0");
	});
});

describe("Studio API client — error handling", () => {
	test("throws AuriiError on 401", async () => {
		const badClient = createClient({ baseUrl: MOCK_BASE, token: "wrong" });
		try {
			await badClient.datasets.list();
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(AuriiError);
			expect((e as AuriiError).status).toBe(401);
		}
	});

	test("throws AuriiError on 404", async () => {
		await expect(
			client.schemas.get("does-not-exist"),
		).rejects.toBeInstanceOf(AuriiError);
	});
});

describe("Studio API client — import history", () => {
	test("can list import history", async () => {
		const history = await client.import.history();
		expect(Array.isArray(history)).toBe(true);
	});
});

describe("Studio API client — query", () => {
	test("can run a query", async () => {
		const result = await client.query.run("FROM studio-news LIMIT 5");
		expect(result).toBeDefined();
		expect(Array.isArray(result.entities)).toBe(true);
	});
});
