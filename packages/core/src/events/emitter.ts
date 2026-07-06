/**
 * Internal domain event emitter for the Aurii Runtime.
 *
 * This is a lightweight, synchronous, in-process event bus.
 * It is not an external message queue — listeners run in the same process
 * and same call stack. There is no async fan-out, retry, or delivery
 * guarantee. Those belong to Phase 3+.
 *
 * Usage:
 *   import { on, emit } from "./events";
 *
 *   on("entity.created", (event) => console.log(event));
 *   emit({ type: "entity.created", entityId: "...", ... });
 */

import type {
	DomainEvent,
	DomainEventType,
	EventHandler,
} from "./types";

// ── Event bus ─────────────────────────────────────────────────────────────────

type Handlers = Map<string, Set<EventHandler<DomainEvent>>>;

const handlers: Handlers = new Map();

// ── API ───────────────────────────────────────────────────────────────────────

/**
 * Subscribe to a domain event by type.
 * Returns an unsubscribe function.
 */
export function on<T extends DomainEvent>(
	type: T["type"],
	handler: EventHandler<T>,
): () => void {
	if (!handlers.has(type)) {
		handlers.set(type, new Set());
	}
	const typed = handler as EventHandler<DomainEvent>;
	handlers.get(type)!.add(typed);
	return () => handlers.get(type)?.delete(typed);
}

/**
 * Subscribe to all domain events regardless of type.
 * Returns an unsubscribe function.
 */
export function onAny(handler: EventHandler<DomainEvent>): () => void {
	return on("*" as DomainEventType, handler);
}

/**
 * Emit a domain event to all registered handlers.
 *
 * The emitter enriches the payload with `id` and `timestamp` before
 * dispatching. Handlers are called synchronously in registration order.
 * Errors in handlers are caught and logged — they never interrupt the
 * caller's control flow.
 */
export function emit<T extends Omit<DomainEvent, "id" | "timestamp">>(
	partial: T,
): void {
	const event = {
		...partial,
		id: crypto.randomUUID(),
		timestamp: new Date().toISOString(),
	} as unknown as DomainEvent;

	const typeHandlers = handlers.get(event.type);
	const wildcardHandlers = handlers.get("*");

	for (const handler of typeHandlers ?? []) {
		try {
			handler(event);
		} catch (err) {
			console.error(`[events] Handler error for "${event.type}":`, err);
		}
	}

	for (const handler of wildcardHandlers ?? []) {
		try {
			handler(event);
		} catch (err) {
			console.error(`[events] Wildcard handler error for "${event.type}":`, err);
		}
	}
}

/**
 * Remove all registered handlers.
 * Intended for use in tests only.
 */
export function clearHandlers(): void {
	handlers.clear();
}
