/**
 * Aurii HTTP API — Phase 2
 *
 * Routes:
 *   GET  /health
 *   GET  /datasets
 *   POST /datasets
 *   GET  /schemas?dataset=
 *   POST /schemas?dataset=
 *   GET  /schemas/:id?dataset=
 *   GET  /entities?schema=&dataset=&limit=&offset=
 *   GET  /entities/:id
 *   GET  /query?q=&dataset=
 *   POST /import/analyze          (multipart file upload)
 *   POST /import/run              { uploadId, schemaId, datasetId, mapping, transforms, dryRun }
 *   POST /import                  { path } — Phase 1 compatibility
 *   GET  /imports?dataset=
 *   GET  /stats?dataset=
 *
 * Auth: if AURII_API_TOKEN is set, all routes except /health require
 * `Authorization: Bearer <token>`.
 */

import { resolve, join } from "path";
import { mkdir } from "fs/promises";
import { parse as parseYaml } from "yaml";
import { getStorage, DEFAULT_DATASET } from "../storage";
import { registerSchema, getSchema, listSchemas } from "../schema/registry";
import { getEntity, listEntities, countEntities } from "../entity/store";
import { parseQuery } from "../query/parser";
import { executeQuery } from "../query/executor";
import { runImport, loadImportDefinition } from "../import/engine";
import { analyzeContent } from "../import/analyze";
import type { SchemaDefinition } from "../schema/types";
import type { ImportDefinition, PipelineStep, FieldTransform } from "../import/types";

const PORT = parseInt(process.env["PORT"] ?? "3000", 10);
const API_TOKEN = process.env["AURII_API_TOKEN"];
const UPLOAD_DIR = process.env["AURII_UPLOAD_DIR"] ?? join(process.cwd(), ".aurii-uploads");

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

function unauthorized(): Response {
  return json({ error: "Unauthorized" }, 401);
}

function checkAuth(req: Request): boolean {
  if (!API_TOKEN) return true;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${API_TOKEN}`;
}

async function parseBody<T>(req: Request): Promise<T> {
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/yaml") || ct.includes("text/yaml")) {
    const text = await req.text();
    return parseYaml(text) as T;
  }
  return req.json() as Promise<T>;
}

interface ImportRunRequest {
  uploadId: string;
  filename?: string;
  schemaId: string;
  datasetId?: string;
  mapping: Record<string, string>;
  transforms?: FieldTransform[];
  dryRun?: boolean;
  delimiter?: string;
}

const server = Bun.serve({
  port: PORT,
  maxRequestBodySize: 100 * 1024 * 1024, // 100 MB uploads
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    const method = req.method.toUpperCase();

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (method === "GET" && path === "/health") {
      const storage = await getStorage();
      return json({ status: "ok", phase: "2", version: "0.2.0", storage: storage.kind });
    }

    if (!checkAuth(req)) return unauthorized();

    const dataset = url.searchParams.get("dataset") ?? DEFAULT_DATASET;

    try {
      // ── Datasets ─────────────────────────────────────────────────────────
      if (method === "GET" && path === "/datasets") {
        const storage = await getStorage();
        return json(await storage.listDatasets());
      }

      if (method === "POST" && path === "/datasets") {
        const body = await parseBody<{ id: string; name: string; description?: string }>(req);
        if (!body.id || !body.name) return error("Dataset requires `id` and `name`");
        if (!/^[a-z0-9][a-z0-9-]*$/.test(body.id)) {
          return error("Dataset id must be lowercase alphanumeric with dashes");
        }
        const storage = await getStorage();
        return json(await storage.createDataset(body), 201);
      }

      // ── Schemas ──────────────────────────────────────────────────────────
      if (method === "GET" && path === "/schemas") {
        return json(await listSchemas(url.searchParams.has("dataset") ? dataset : undefined));
      }

      if (method === "POST" && path === "/schemas") {
        const def = await parseBody<SchemaDefinition>(req);
        return json(await registerSchema(def, dataset), 201);
      }

      const schemaMatch = path.match(/^\/schemas\/([^/]+)$/);
      if (method === "GET" && schemaMatch) {
        const schema = await getSchema(schemaMatch[1]!, dataset);
        if (!schema) return error(`Schema "${schemaMatch[1]}" not found`, 404);
        return json(schema);
      }

      // ── Entities ─────────────────────────────────────────────────────────
      if (method === "GET" && path === "/entities") {
        const schemaId = url.searchParams.get("schema");
        if (!schemaId) return error('Missing "schema" parameter');
        const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);
        const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
        const [entities, total] = await Promise.all([
          listEntities(schemaId, dataset, limit, offset),
          countEntities(schemaId, dataset),
        ]);
        return json({ entities, total, limit, offset });
      }

      const entityMatch = path.match(/^\/entities\/([^/]+)$/);
      if (method === "GET" && entityMatch) {
        const entity = await getEntity(entityMatch[1]!);
        if (!entity) return error(`Entity "${entityMatch[1]}" not found`, 404);
        return json(entity);
      }

      // ── Query ────────────────────────────────────────────────────────────
      if (method === "GET" && path === "/query") {
        const q = url.searchParams.get("q");
        if (!q) return error('Missing query parameter "q"');
        const parsed = parseQuery(q);
        return json(await executeQuery(parsed, dataset));
      }

      // ── Import: analyze ──────────────────────────────────────────────────
      if (method === "POST" && path === "/import/analyze") {
        const form = await req.formData();
        const file = form.get("file");
        if (!(file instanceof File)) return error('Multipart field "file" is required');

        const content = await file.text();
        const analysis = analyzeContent(file.name, content);

        await mkdir(UPLOAD_DIR, { recursive: true });
        const uploadId = crypto.randomUUID();
        const ext = analysis.format === "json" ? "json" : "csv";
        await Bun.write(join(UPLOAD_DIR, `${uploadId}.${ext}`), content);

        return json({ uploadId, filename: file.name, ...analysis });
      }

      // ── Import: run (wizard) ─────────────────────────────────────────────
      if (method === "POST" && path === "/import/run") {
        const body = await parseBody<ImportRunRequest>(req);
        if (!body.uploadId || !body.schemaId || !body.mapping) {
          return error("Required: uploadId, schemaId, mapping");
        }

        const csvPath = join(UPLOAD_DIR, `${body.uploadId}.csv`);
        const jsonPath = join(UPLOAD_DIR, `${body.uploadId}.json`);
        const isCsv = await Bun.file(csvPath).exists();
        const isJson = !isCsv && (await Bun.file(jsonPath).exists());
        if (!isCsv && !isJson) return error(`Upload "${body.uploadId}" not found`, 404);

        const steps: PipelineStep[] = [
          { type: "map", mapping: body.mapping },
        ];
        if (body.transforms && body.transforms.length > 0) {
          steps.push({ type: "transform", transforms: body.transforms });
        }
        steps.push({ type: "validate" }, { type: "persist" });

        const def: ImportDefinition = {
          id: `wizard-${body.uploadId}`,
          name: body.filename ?? `Wizard import ${body.uploadId}`,
          schema: body.schemaId,
          source: {
            type: isCsv ? "csv" : "json",
            path: isCsv ? csvPath : jsonPath,
            options: body.delimiter ? { delimiter: body.delimiter } : undefined,
          },
          pipeline: { steps },
        };

        const result = await runImport(def, "/", {
          datasetId: body.datasetId ?? dataset,
          dryRun: body.dryRun ?? false,
        });
        return json(result);
      }

      // ── Import: Phase 1 compatibility ────────────────────────────────────
      if (method === "POST" && path === "/import") {
        const body = await parseBody<{ path?: string }>(req);
        if (!body.path) return error('Provide "path" to an import YAML file');
        const def = await loadImportDefinition(resolve(process.cwd(), body.path));
        const result = await runImport(def, process.cwd(), { datasetId: dataset });
        return json(result);
      }

      // ── Import history ───────────────────────────────────────────────────
      if (method === "GET" && path === "/imports") {
        const storage = await getStorage();
        const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
        return json(await storage.listImportRuns(dataset, limit));
      }

      // ── Stats ────────────────────────────────────────────────────────────
      if (method === "GET" && path === "/stats") {
        const storage = await getStorage();
        return json(await storage.getStats(dataset));
      }

      return error(`Not found: ${method} ${path}`, 404);
    } catch (e) {
      return error(String(e), 500);
    }
  },
});

console.log(`Aurii API running on http://localhost:${server.port}`);
console.log(`Storage: ${process.env["AURII_STORAGE"] ?? "sqlite"}`);
console.log(`Auth: ${API_TOKEN ? "token required" : "open (set AURII_API_TOKEN to protect)"}`);
