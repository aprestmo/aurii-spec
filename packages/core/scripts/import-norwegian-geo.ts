#!/usr/bin/env bun
/**
 * Import the Norwegian public reference dataset into Aurii Core.
 *
 * Usage (from repo root):
 *   bun run import:norwegian-geo
 *
 * With PostgreSQL:
 *   AURII_STORAGE=postgres DATABASE_URL=postgres://aurii:aurii@localhost:5432/aurii \
 *     bun run import:norwegian-geo
 */

import { resolve } from "path";
import { parse as parseYaml } from "yaml";
import { loadImportDefinition, runImport } from "../src/import/engine";
import { registerSchema } from "../src/schema/registry";
import type { SchemaDefinition } from "../src/schema/types";
import { closeStorage, getStorage } from "../src/storage";

const ROOT = resolve(import.meta.dir, "../../..");
const DEMO = resolve(ROOT, "demo/norwegian-geo");
const DATASET = "norwegian-geo";

const SCHEMAS = [
	"county",
	"municipality",
	"postal-code",
	"school",
	"kindergarten",
	"hospital",
	"public-holiday",
] as const;

const IMPORTS = [
	"counties",
	"municipalities",
	"postal-codes",
	"schools",
	"kindergartens",
	"hospitals",
	"public-holidays",
] as const;

async function applySchema(file: string): Promise<void> {
	const content = await Bun.file(file).text();
	const def = parseYaml(content) as SchemaDefinition;
	await registerSchema(def, DATASET);
	console.log(`  ✓ Schema "${def.id}" registered`);
}

async function runImportFile(file: string): Promise<void> {
	const def = await loadImportDefinition(file);
	const result = await runImport(def, resolve(file, ".."));
	console.log(
		`  ✓ ${def.name}: ${result.inserted} inserted, ${result.updated} updated, ${result.failed} failed (${result.durationMs}ms)`,
	);
	if (result.failed > 0) {
		for (const e of result.errors.slice(0, 5)) {
			console.error(`    Row ${e.row}: ${e.message}`);
		}
		process.exit(1);
	}
}

console.log("\nAurii — Norwegian Public Reference Data Import\n");

const storage = await getStorage();
await storage.init();

try {
	await storage.createDataset({
		id: DATASET,
		name: "Norwegian Public Reference Data",
	});
	console.log(`Dataset "${DATASET}" ready\n`);
} catch {
	console.log(`Dataset "${DATASET}" already exists\n`);
}

console.log("Registering schemas...");
for (const schema of SCHEMAS) {
	await applySchema(resolve(DEMO, "schemas", `${schema}.yaml`));
}

console.log("\nRunning imports...");
for (const imp of IMPORTS) {
	await runImportFile(resolve(DEMO, "imports", `${imp}.yaml`));
}

console.log("\n── Summary ──────────────────────────────");
for (const schema of SCHEMAS) {
	const count = await storage.countEntities(schema, DATASET);
	const label = schema.padEnd(16);
	console.log(`  ${label} ${count}`);
}
console.log("────────────────────────────────────────\n");

await closeStorage();
