// Storage
export { getStorage, closeStorage, DEFAULT_DATASET, SqliteAdapter, PostgresAdapter } from "./storage";
export type { StorageAdapter, Dataset, DatasetInput, ImportRunRecord, StorageStats, SchemaStats } from "./storage";

// Schema
export { registerSchema, getSchema, listSchemas, deleteSchema } from "./schema/registry";
export { validateEntity, validateSchemaDefinition } from "./schema/validator";
export type { SchemaDefinition, StoredSchema, FieldDefinition, FieldType, ValidationResult } from "./schema/types";

// Entity
export { createEntity, createEntities, getEntity, listEntities, countEntities } from "./entity/store";
export type { Entity, EntityInput, EntityPage, EntityState } from "./entity/types";

// Query
export { parseQuery } from "./query/parser";
export { executeQuery } from "./query/executor";
export type { ParsedQuery, Condition, OrderBy, Operator } from "./query/parser";
export type { QueryResult } from "./query/executor";

// Import
export { runImport, loadImportDefinition } from "./import/engine";
export { analyzeContent, detectFormat, detectDelimiter, slugifyFieldName } from "./import/analyze";
export type { ImportDefinition, ImportResult, ImportPipeline, PipelineStep, FieldTransform } from "./import/types";
export type { AnalysisResult } from "./import/analyze";

// Pipeline
export { runPipeline, runStep } from "./pipeline/runner";
export { applyTransform } from "./pipeline/transforms";
