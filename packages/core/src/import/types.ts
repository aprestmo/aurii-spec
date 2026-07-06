export type SourceType = "csv" | "json";

export interface CsvSourceOptions {
	delimiter?: string;
	skipEmptyLines?: boolean;
}

export interface Source {
	type: SourceType;
	path: string;
	options?: CsvSourceOptions;
}

export type TransformFn =
	| "toBoolean"
	| "toNumber"
	| "toDate"
	| "toSlug"
	| "trim"
	| "toLowerCase"
	| "toUpperCase";

export interface FieldTransform {
	field: string;
	fn: TransformFn;
}

export interface MapStep {
	type: "map";
	/** Keys are schema field names, values are source column names */
	mapping: Record<string, string>;
}

export interface TransformStep {
	type: "transform";
	transforms: FieldTransform[];
}

export interface ValidateStep {
	type: "validate";
}

export interface PersistStep {
	type: "persist";
}

export type PipelineStep = MapStep | TransformStep | ValidateStep | PersistStep;

export interface ImportPipeline {
	steps: PipelineStep[];
}

export type ReferenceValidationMode = "strict" | "warning" | "skip";

export interface ImportDefinition {
	id: string;
	name: string;
	schema: string;
	/** Target dataset; defaults to "default" */
	dataset?: string;
	source: Source;
	pipeline: ImportPipeline;
	/**
	 * Field name to use as the natural key for deduplication.
	 *
	 * When set, the import engine calls `upsertEntitiesByField` instead of
	 * `insertEntities`, so running the same import multiple times never
	 * creates duplicate entities.  The field must be present in every row
	 * that passes validation.
	 */
	deduplicateBy?: string;
	/**
	 * How to handle rows with references to missing entities.
	 * - strict: fail the row (default)
	 * - warning: import with a warning in errors
	 * - skip: remove invalid reference values and import
	 */
	referenceValidation?: ReferenceValidationMode;
}

export interface RowError {
	row: number;
	message: string;
	data?: Record<string, unknown>;
	severity?: "error" | "warning";
}

export interface ImportResult {
	definitionId: string;
	schemaId: string;
	datasetId: string;
	dryRun: boolean;
	total: number;
	/** Rows successfully persisted (inserted + updated) */
	imported: number;
	/** New entities created */
	inserted: number;
	/** Existing entities updated in place (only when deduplicateBy is set) */
	updated: number;
	failed: number;
	errors: RowError[];
	durationMs: number;
	/** Present in dry-run mode: sample of the rows that would be written */
	sample?: Record<string, unknown>[];
}
