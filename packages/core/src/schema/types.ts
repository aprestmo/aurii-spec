export type FieldType =
	| "string"
	| "number"
	| "boolean"
	| "date"
	| "reference"
	| "string[]"
	| "number[]";

export interface FieldDefinition {
	name: string;
	type: FieldType;
	required?: boolean;
	default?: unknown;
	label?: string;
	description?: string;
	/**
	 * Target schema id for reference fields.
	 * `to` is the canonical name; `schema` is accepted for backward compatibility.
	 */
	to?: string;
	/** @deprecated Use `to` instead */
	schema?: string;
	/** When true, the field stores an array of reference IDs (one-to-many). */
	multiple?: boolean;
}

export interface SchemaDefinition {
	id: string;
	name: string;
	description?: string;
	version?: number;
	fields: FieldDefinition[];
}

export interface StoredSchema {
	id: string;
	datasetId: string;
	name: string;
	description?: string;
	version: number;
	fields: FieldDefinition[];
	createdAt: string;
	updatedAt: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

/** Resolve the target schema id for a reference field. */
export function referenceTarget(field: FieldDefinition): string | undefined {
	return field.to ?? field.schema;
}

/** Whether a field is a reference (single or multiple). */
export function isReferenceField(field: FieldDefinition): boolean {
	return field.type === "reference";
}
