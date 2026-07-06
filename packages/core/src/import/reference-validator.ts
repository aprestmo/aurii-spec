/**
 * Reference validation during import.
 */

import type { Entity } from "../entity/types";
import type { FieldDefinition, SchemaDefinition } from "../schema/types";
import { isReferenceField, referenceTarget } from "../schema/types";

export type ReferenceValidationMode = "strict" | "warning" | "skip";

export interface ReferenceIssue {
	field: string;
	value: string;
	targetSchema: string;
	message: string;
}

export interface ReferenceValidationResult {
	issues: ReferenceIssue[];
	/** Row data with invalid references removed (skip mode). */
	data: Record<string, unknown>;
}

export async function validateReferences(
	data: Record<string, unknown>,
	schema: SchemaDefinition,
	lookup: (targetSchema: string, id: string) => Promise<Entity | null>,
	mode: ReferenceValidationMode = "strict",
): Promise<ReferenceValidationResult> {
	const issues: ReferenceIssue[] = [];
	const result = { ...data };

	for (const field of schema.fields) {
		if (!isReferenceField(field)) continue;
		const target = referenceTarget(field);
		if (!target) continue;

		const value = data[field.name];
		if (value === undefined || value === null || value === "") continue;

		const ids = field.multiple
			? Array.isArray(value)
				? value
				: [value]
			: [value];

		for (const id of ids) {
			if (typeof id !== "string") continue;
			const found = await lookup(target, id);
			if (!found) {
				issues.push({
					field: field.name,
					value: id,
					targetSchema: target,
					message: `Reference "${field.name}" points to missing ${target} "${id}"`,
				});
			}
		}
	}

	if (mode === "skip" && issues.length > 0) {
		for (const issue of issues) {
			const field = schema.fields.find((f) => f.name === issue.field);
			if (!field) continue;
			const value = result[issue.field];
			if (field.multiple && Array.isArray(value)) {
				result[issue.field] = value.filter((v) => v !== issue.value);
			} else {
				delete result[issue.field];
			}
		}
	}

	return { issues, data: result };
}

export function referenceIssuesToErrors(
	issues: ReferenceIssue[],
	mode: ReferenceValidationMode,
): string[] {
	if (mode === "warning") {
		return issues.map((i) => `Warning: ${i.message}`);
	}
	if (mode === "strict") {
		return issues.map((i) => i.message);
	}
	return [];
}

export function getReferenceFields(schema: SchemaDefinition): FieldDefinition[] {
	return schema.fields.filter(isReferenceField);
}
