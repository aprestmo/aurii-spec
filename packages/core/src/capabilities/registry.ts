/**
 * Aurii Capability Registry.
 *
 * A lightweight self-registration mechanism that allows Runtime subsystems
 * to declare what they provide. The registry surfaces this information via
 * the health API and prepares the ground for Phase 3 plugin discovery.
 *
 * Design constraints:
 * - No external dependencies
 * - No async I/O (pure in-memory)
 * - Idempotent registration (re-registering the same id replaces the entry)
 */

import type {
	Capability,
	CapabilityKind,
	CapabilityRegistration,
	CapabilityStatus,
} from "./types";

// ── Registry store ────────────────────────────────────────────────────────────

const registry = new Map<string, Capability>();

// ── API ───────────────────────────────────────────────────────────────────────

/**
 * Register a capability with the Runtime.
 *
 * Safe to call multiple times — subsequent calls update `status` and
 * `variant` in place, which allows storage adapters to re-announce
 * themselves after hot-swapping.
 */
export function registerCapability(
	registration: CapabilityRegistration,
	status: CapabilityStatus = "available",
): Capability {
	const existing = registry.get(registration.id);
	if (existing) {
		existing.status = status;
		return existing;
	}

	const capability: Capability = {
		id: registration.id,
		name: registration.name,
		kind: registration.kind,
		status,
		registeredAt: new Date().toISOString(),
		...(registration.variant !== undefined
			? { variant: registration.variant }
			: {}),
	};

	registry.set(registration.id, capability);
	return capability;
}

/**
 * Update the status of a previously registered capability.
 * No-op if the capability has not been registered.
 */
export function updateCapabilityStatus(
	id: string,
	status: CapabilityStatus,
): boolean {
	const cap = registry.get(id);
	if (!cap) return false;
	cap.status = status;
	return true;
}

/**
 * Return all registered capabilities.
 */
export function listCapabilities(): Capability[] {
	return Array.from(registry.values());
}

/**
 * Return all capabilities of a given kind.
 */
export function listCapabilitiesByKind(kind: CapabilityKind): Capability[] {
	return listCapabilities().filter((c) => c.kind === kind);
}

/**
 * Return a capability by its id, or undefined if not registered.
 */
export function getCapability(id: string): Capability | undefined {
	return registry.get(id);
}

/**
 * Check whether a capability is registered and available.
 */
export function hasCapability(id: string): boolean {
	const cap = registry.get(id);
	return cap?.status === "available";
}

/**
 * Clear all registrations. Intended for use in tests only.
 */
export function clearCapabilities(): void {
	registry.clear();
}

// ── Built-in capability registrations ────────────────────────────────────────
// These are registered at module load time so they are always present
// when Core is imported. Storage capabilities are re-registered from
// the storage layer with the correct variant and status.

registerCapability({ id: "schema", name: "Schema Registry", kind: "Schema" });
registerCapability({
	id: "import",
	name: "Import Engine",
	kind: "Import",
});
registerCapability({
	id: "pipeline",
	name: "Pipeline Runner",
	kind: "Pipeline",
});
registerCapability({
	id: "query",
	name: "Query Language",
	kind: "Query",
});
registerCapability({
	id: "api",
	name: "HTTP API",
	kind: "API",
});
