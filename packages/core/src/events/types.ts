/**
 * Internal domain event types for the Aurii Runtime.
 *
 * These events enable loose coupling between Runtime subsystems.
 * They are emitted internally — there is no external subscription or
 * network transport in Phase 2.1. External event streaming belongs to
 * Phase 3+.
 *
 * Design constraints:
 * - All events are typed discriminated unions
 * - Every event carries a timestamp and a correlation id
 * - Handlers are synchronous fire-and-forget (no awaiting in the emitter)
 */

// ── Base ──────────────────────────────────────────────────────────────────────

export interface BaseEvent {
	/** ISO 8601 timestamp when the event was emitted. */
	readonly timestamp: string;
	/** Unique event id (UUID v4). */
	readonly id: string;
}

// ── Dataset events ────────────────────────────────────────────────────────────

export interface DatasetCreatedEvent extends BaseEvent {
	readonly type: "dataset.created";
	readonly datasetId: string;
	readonly name: string;
}

// ── Entity events ─────────────────────────────────────────────────────────────

export interface EntityCreatedEvent extends BaseEvent {
	readonly type: "entity.created";
	readonly entityId: string;
	readonly schemaId: string;
	readonly datasetId: string;
}

export interface EntityUpdatedEvent extends BaseEvent {
	readonly type: "entity.updated";
	readonly entityId: string;
	readonly schemaId: string;
	readonly datasetId: string;
}

export interface EntityDeletedEvent extends BaseEvent {
	readonly type: "entity.deleted";
	readonly entityId: string;
	readonly schemaId: string;
	readonly datasetId: string;
}

// ── Import events ─────────────────────────────────────────────────────────────

export interface ImportStartedEvent extends BaseEvent {
	readonly type: "import.started";
	readonly runId: string;
	readonly definitionId: string;
	readonly schemaId: string;
	readonly datasetId: string;
	readonly dryRun: boolean;
}

export interface ImportFinishedEvent extends BaseEvent {
	readonly type: "import.finished";
	readonly runId: string;
	readonly definitionId: string;
	readonly schemaId: string;
	readonly datasetId: string;
	readonly dryRun: boolean;
	readonly total: number;
	readonly imported: number;
	readonly failed: number;
	readonly durationMs: number;
}

// ── Union ─────────────────────────────────────────────────────────────────────

export type DomainEvent =
	| DatasetCreatedEvent
	| EntityCreatedEvent
	| EntityUpdatedEvent
	| EntityDeletedEvent
	| ImportStartedEvent
	| ImportFinishedEvent;

export type DomainEventType = DomainEvent["type"];

export type EventHandler<T extends DomainEvent = DomainEvent> = (
	event: T,
) => void;
