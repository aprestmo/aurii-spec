/**
 * Capability Registry tests.
 */

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
	clearCapabilities,
	getCapability,
	hasCapability,
	listCapabilities,
	listCapabilitiesByKind,
	registerCapability,
	updateCapabilityStatus,
} from "../capabilities/registry";

beforeEach(() => {
	clearCapabilities();
});

afterEach(() => {
	clearCapabilities();
});

describe("registerCapability", () => {
	test("registers a capability and returns it", () => {
		const cap = registerCapability({
			id: "test-storage",
			name: "Test Storage",
			kind: "Storage",
			variant: "sqlite",
		});
		expect(cap.id).toBe("test-storage");
		expect(cap.name).toBe("Test Storage");
		expect(cap.kind).toBe("Storage");
		expect(cap.variant).toBe("sqlite");
		expect(cap.status).toBe("available");
		expect(cap.registeredAt).toBeDefined();
	});

	test("re-registering the same id updates status", () => {
		registerCapability({ id: "x", name: "X", kind: "Query" }, "available");
		const updated = registerCapability(
			{ id: "x", name: "X", kind: "Query" },
			"degraded",
		);
		expect(updated.status).toBe("degraded");
		expect(listCapabilities()).toHaveLength(1);
	});

	test("supports degraded and unavailable statuses", () => {
		const cap = registerCapability(
			{ id: "y", name: "Y", kind: "Search" },
			"unavailable",
		);
		expect(cap.status).toBe("unavailable");
	});
});

describe("listCapabilities", () => {
	test("returns all registered capabilities", () => {
		registerCapability({ id: "a", name: "A", kind: "Storage" });
		registerCapability({ id: "b", name: "B", kind: "Import" });
		expect(listCapabilities()).toHaveLength(2);
	});

	test("returns empty array when nothing registered", () => {
		expect(listCapabilities()).toHaveLength(0);
	});
});

describe("listCapabilitiesByKind", () => {
	test("filters capabilities by kind", () => {
		registerCapability({ id: "s1", name: "Storage 1", kind: "Storage", variant: "sqlite" });
		registerCapability({ id: "s2", name: "Storage 2", kind: "Storage", variant: "postgres" });
		registerCapability({ id: "q1", name: "Query 1", kind: "Query" });

		expect(listCapabilitiesByKind("Storage")).toHaveLength(2);
		expect(listCapabilitiesByKind("Query")).toHaveLength(1);
		expect(listCapabilitiesByKind("Import")).toHaveLength(0);
	});
});

describe("getCapability", () => {
	test("returns capability by id", () => {
		registerCapability({ id: "cap1", name: "Cap 1", kind: "API" });
		const cap = getCapability("cap1");
		expect(cap?.id).toBe("cap1");
	});

	test("returns undefined for unknown id", () => {
		expect(getCapability("nonexistent")).toBeUndefined();
	});
});

describe("hasCapability", () => {
	test("returns true for available capability", () => {
		registerCapability({ id: "h1", name: "H1", kind: "Storage" }, "available");
		expect(hasCapability("h1")).toBe(true);
	});

	test("returns false for degraded capability", () => {
		registerCapability({ id: "h2", name: "H2", kind: "Storage" }, "degraded");
		expect(hasCapability("h2")).toBe(false);
	});

	test("returns false for unregistered capability", () => {
		expect(hasCapability("unknown")).toBe(false);
	});
});

describe("updateCapabilityStatus", () => {
	test("updates status of registered capability", () => {
		registerCapability({ id: "u1", name: "U1", kind: "Import" });
		const result = updateCapabilityStatus("u1", "degraded");
		expect(result).toBe(true);
		expect(getCapability("u1")?.status).toBe("degraded");
	});

	test("returns false for unknown id", () => {
		expect(updateCapabilityStatus("unknown", "available")).toBe(false);
	});
});
