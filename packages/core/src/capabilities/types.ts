/**
 * Capability model for the Aurii Runtime.
 *
 * Capabilities describe what the Runtime can do — they are registered
 * self-declarations, not hardcoded feature flags.
 *
 * This is intentionally minimal for Phase 2.1.
 * In Phase 3, capabilities will drive plugin discovery, permission scoping,
 * and AI context generation.
 */

export type CapabilityKind =
	| "Storage"
	| "Import"
	| "Query"
	| "Search"
	| "Assets"
	| "Schema"
	| "Pipeline"
	| "API";

export type CapabilityStatus = "available" | "degraded" | "unavailable";

export interface Capability {
	/** Unique capability identifier. */
	readonly id: string;
	/** Human-readable name. */
	readonly name: string;
	/** Capability category. */
	readonly kind: CapabilityKind;
	/** Current operational status. */
	status: CapabilityStatus;
	/** Optional version or adapter label (e.g. "sqlite", "postgres"). */
	readonly variant?: string;
	/** ISO timestamp when this capability was registered. */
	readonly registeredAt: string;
}

export interface CapabilityRegistration {
	id: string;
	name: string;
	kind: CapabilityKind;
	variant?: string;
}
