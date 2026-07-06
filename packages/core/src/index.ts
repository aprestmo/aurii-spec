// Storage

// Entity
export {
	countEntities,
	createEntities,
	createEntity,
	getEntity,
	listEntities,
} from "./entity/store";
export type {
	Entity,
	EntityInput,
	EntityPage,
	EntityState,
} from "./entity/types";
export type { AnalysisResult } from "./import/analyze";
export {
	analyzeContent,
	detectDelimiter,
	detectFormat,
	slugifyFieldName,
} from "./import/analyze";
// Import
export { loadImportDefinition, runImport } from "./import/engine";
export type {
	FieldTransform,
	ImportDefinition,
	ImportPipeline,
	ImportResult,
	PipelineStep,
} from "./import/types";
// Pipeline
export { runPipeline, runStep } from "./pipeline/runner";
export { applyTransform } from "./pipeline/transforms";
export type { QueryResult } from "./query/executor";
export { executeQuery } from "./query/executor";
export type { Condition, Operator, OrderBy, ParsedQuery } from "./query/parser";
// Query
export { parseQuery } from "./query/parser";
// Schema
export {
	deleteSchema,
	getSchema,
	listSchemas,
	registerSchema,
} from "./schema/registry";
export type {
	FieldDefinition,
	FieldType,
	SchemaDefinition,
	StoredSchema,
	ValidationResult,
} from "./schema/types";
export { validateEntity, validateSchemaDefinition } from "./schema/validator";
export type {
	Dataset,
	DatasetInput,
	ImportRunRecord,
	SchemaStats,
	StorageAdapter,
	StorageStats,
} from "./storage";
export {
	closeStorage,
	DEFAULT_DATASET,
	getStorage,
	PostgresAdapter,
	SqliteAdapter,
} from "./storage";
// Capabilities
export {
	clearCapabilities,
	getCapability,
	hasCapability,
	listCapabilities,
	listCapabilitiesByKind,
	registerCapability,
	updateCapabilityStatus,
} from "./capabilities";
export type {
	Capability,
	CapabilityKind,
	CapabilityRegistration,
	CapabilityStatus,
} from "./capabilities";
// Events
export { clearHandlers, emit, on, onAny } from "./events";
export type {
	BaseEvent,
	DatasetCreatedEvent,
	DomainEvent,
	DomainEventType,
	EntityCreatedEvent,
	EntityDeletedEvent,
	EntityUpdatedEvent,
	EventHandler,
	ImportFinishedEvent,
	ImportStartedEvent,
} from "./events";
