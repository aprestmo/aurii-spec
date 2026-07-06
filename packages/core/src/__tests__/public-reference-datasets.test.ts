/**
 * Public reference datasets — integration test
 *
 * Validates that multiple independent Norwegian open datasets import through
 * the same declarative pipeline, with cross-dataset reference integrity.
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { resolve } from "path";
import { parse as parseYaml } from "yaml";
import { loadImportDefinition, runImport } from "../import/engine";
import { executeQuery } from "../query/executor";
import { parseQuery } from "../query/parser";
import { registerSchema } from "../schema/registry";
import type { SchemaDefinition } from "../schema/types";
import { closeStorage, getStorage } from "../storage";

const ROOT = resolve(import.meta.dir, "../../../..");
const DEMO = resolve(ROOT, "demo/norwegian-geo");
const DATASET = "norwegian-geo";
const TEST_TIMEOUT_MS = 120_000;

const SCHEMA_FILES = [
	"county",
	"municipality",
	"postal-code",
	"school",
	"kindergarten",
	"hospital",
	"public-holiday",
] as const;

const IMPORT_FILES = [
	"counties",
	"municipalities",
	"postal-codes",
	"schools",
	"kindergartens",
	"hospitals",
	"public-holidays",
] as const;

beforeAll(async () => {
	process.env["AURII_STORAGE"] = "sqlite";
	process.env["AURII_DB_PATH"] = ":memory:";

	const storage = await getStorage();
	await storage.createDataset({
		id: DATASET,
		name: "Norwegian Public Reference Data",
	});

	for (const schema of SCHEMA_FILES) {
		const content = await Bun.file(
			resolve(DEMO, "schemas", `${schema}.yaml`),
		).text();
		const def = parseYaml(content) as SchemaDefinition;
		await registerSchema(def, DATASET);
	}

	for (const imp of IMPORT_FILES) {
		const file = resolve(DEMO, "imports", `${imp}.yaml`);
		const def = await loadImportDefinition(file);
		const result = await runImport(def, resolve(file, ".."), {
			datasetId: DATASET,
		});
		expect(result.failed).toBe(0);
	}
}, TEST_TIMEOUT_MS);

afterAll(async () => {
	await closeStorage();
});

describe("Public reference datasets", () => {
	it("imports all bundled datasets with expected counts", async () => {
		const storage = await getStorage();

		expect(await storage.countEntities("county", DATASET)).toBe(15);
		expect(await storage.countEntities("municipality", DATASET)).toBe(357);
		expect(await storage.countEntities("postal-code", DATASET)).toBeGreaterThan(
			5000,
		);
		expect(await storage.countEntities("school", DATASET)).toBeGreaterThan(
			5000,
		);
		expect(await storage.countEntities("kindergarten", DATASET)).toBeGreaterThan(
			5000,
		);
		expect(await storage.countEntities("hospital", DATASET)).toBeGreaterThan(
			100,
		);
		expect(
			await storage.countEntities("public-holiday", DATASET),
		).toBeGreaterThan(80);
	});

	it("validates school and kindergarten references to municipalities", async () => {
		const osloSchools = (
			await executeQuery(
				parseQuery(
					'from school where municipalityId == "0301" and isActive == true limit 5',
				),
				DATASET,
			)
		).entities;
		expect(osloSchools.length).toBeGreaterThan(0);

		for (const school of osloSchools) {
			const municipality = (
				await executeQuery(
					parseQuery(
						`from municipality where id == "${school.data.municipalityId}"`,
					),
					DATASET,
				)
			).entities;
			expect(municipality[0]?.data.countyId).toBe("03");
		}

		const osloKindergartens = (
			await executeQuery(
				parseQuery('from kindergarten where municipalityId == "0301" limit 5'),
				DATASET,
			)
		).entities;
		expect(osloKindergartens.length).toBeGreaterThan(0);
	});

	it("supports cross-dataset queries for hospitals and holidays", async () => {
		const hospitals = (
			await executeQuery(
				parseQuery('from hospital where municipalityId == "0301"'),
				DATASET,
			)
		).entities;
		expect(hospitals.length).toBeGreaterThan(0);

		const holidays2026 = (
			await executeQuery(
				parseQuery(
					"from public-holiday where year == 2026 order by date asc",
				),
				DATASET,
			)
		).entities;
		expect(holidays2026.length).toBe(12);
		expect(holidays2026[0]?.data.localName).toBe("Første nyttårsdag");
	});

	it(
		"re-imports idempotently for schools and kindergartens",
		async () => {
			const file = resolve(DEMO, "imports/schools.yaml");
			const def = await loadImportDefinition(file);
			const second = await runImport(def, resolve(file, ".."), {
				datasetId: DATASET,
			});

			expect(second.inserted).toBe(0);
			expect(second.updated).toBeGreaterThan(5000);
			expect(second.failed).toBe(0);
		},
		TEST_TIMEOUT_MS,
	);
});
