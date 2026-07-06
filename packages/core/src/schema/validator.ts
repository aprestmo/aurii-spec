import type {
	FieldDefinition,
	SchemaDefinition,
	ValidationResult,
} from "./types";
import { isReferenceField, referenceTarget } from "./types";

const ISO_DATE_RE =
	/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;

function checkType(
	name: string,
	value: unknown,
	type: FieldDefinition["type"],
): string | null {
	switch (type) {
		case "string":
			return typeof value === "string"
				? null
				: `Field "${name}" must be a string`;
		case "number":
			return typeof value === "number" && !isNaN(value)
				? null
				: `Field "${name}" must be a number`;
		case "boolean":
			return typeof value === "boolean"
				? null
				: `Field "${name}" must be a boolean`;
		case "date":
			if (typeof value !== "string")
				return `Field "${name}" must be an ISO date string`;
			return ISO_DATE_RE.test(value)
				? null
				: `Field "${name}" is not a valid ISO date (got "${value}")`;
		case "string[]":
			return Array.isArray(value) && value.every((v) => typeof v === "string")
				? null
				: `Field "${name}" must be an array of strings`;
		case "number[]":
			return Array.isArray(value) && value.every((v) => typeof v === "number")
				? null
				: `Field "${name}" must be an array of numbers`;
		case "reference":
			if (value === null || value === undefined) return null;
			return typeof value === "string" || Array.isArray(value)
				? null
				: `Field "${name}" must be a string reference ID or array of IDs`;
		default:
			return null;
	}
}

export function validateEntity(
	data: Record<string, unknown>,
	schema: SchemaDefinition,
): ValidationResult {
	const errors: string[] = [];

	for (const field of schema.fields) {
		const value = data[field.name];
		const missing = value === undefined || value === null || value === "";

		if (field.required && missing) {
			errors.push(`Field "${field.name}" is required`);
			continue;
		}

		if (!missing) {
			if (isReferenceField(field) && field.multiple) {
				if (!Array.isArray(value)) {
					errors.push(`Field "${field.name}" must be an array of reference IDs`);
					continue;
				}
				for (const id of value) {
					if (typeof id !== "string") {
						errors.push(
							`Field "${field.name}" must contain string reference IDs`,
						);
					}
				}
			} else {
				const typeError = checkType(field.name, value, field.type);
				if (typeError) errors.push(typeError);
			}
		}
	}

	return { valid: errors.length === 0, errors };
}

export function validateSchemaDefinition(def: unknown): ValidationResult {
	const errors: string[] = [];

	if (typeof def !== "object" || def === null) {
		return { valid: false, errors: ["Schema definition must be an object"] };
	}

	const d = def as Record<string, unknown>;

	if (!d["id"] || typeof d["id"] !== "string")
		errors.push("Schema must have a string `id`");
	if (!d["name"] || typeof d["name"] !== "string")
		errors.push("Schema must have a string `name`");
	if (!Array.isArray(d["fields"]))
		errors.push("Schema must have a `fields` array");

	if (Array.isArray(d["fields"])) {
		const VALID_TYPES = new Set<string>([
			"string",
			"number",
			"boolean",
			"date",
			"reference",
			"string[]",
			"number[]",
		]);
		for (let i = 0; i < d["fields"].length; i++) {
			const f = d["fields"][i] as Record<string, unknown>;
			if (!f["name"] || typeof f["name"] !== "string") {
				errors.push(`Field at index ${i} must have a string \`name\``);
			}
			if (!f["type"] || !VALID_TYPES.has(f["type"] as string)) {
				errors.push(
					`Field "${f["name"] ?? i}" has invalid type "${f["type"]}". Valid: ${[...VALID_TYPES].join(", ")}`,
				);
			}
			if (f["type"] === "reference" && !f["to"] && !f["schema"]) {
				errors.push(
					`Reference field "${f["name"] ?? i}" must declare a target schema via \`to\``,
				);
			}
		}
	}

	return { valid: errors.length === 0, errors };
}
