import { Property } from "./types";

// This represents a subset of the JSON Schema specification.
// It's a recursive type.
interface JsonSchemaObject {
	type?: "string" | "number" | "integer" | "boolean" | "object" | "array";
	properties?: { [key: string]: JsonSchemaObject };
	required?: string[];
	items?: JsonSchemaObject;
	enum?: string[];
}

// --- OpenAPI SCHEMA GENERATOR ---
const generatePropertySchema = (prop: Property): JsonSchemaObject => {
	let propertySchema: JsonSchemaObject;

	if (prop.type === "object") {
		const nestedSchema: JsonSchemaObject = {
			type: "object",
			properties: {},
			required: [],
		};
		prop.children.forEach((child) => {
			if (child.name) {
				if (!nestedSchema.properties) nestedSchema.properties = {};
				nestedSchema.properties[child.name] =
					generatePropertySchema(child);
				if (child.isRequired) {
					if (!nestedSchema.required) nestedSchema.required = [];
					nestedSchema.required.push(child.name);
				}
			}
		});
		if (nestedSchema.required?.length === 0) {
			delete nestedSchema.required;
		}
		propertySchema = nestedSchema;
	} else if (prop.type === "enum") {
		// 'enum' is not a type in JSON Schema. It's a keyword used with a type.
		// Assuming 'string' as the base type for enums here.
		propertySchema = { type: "string", enum: ["VALUE_1", "VALUE_2"] };
	} else {
		propertySchema = { type: prop.type };
	}

	return prop.isArray
		? { type: "array", items: propertySchema }
		: propertySchema;
};

export const generateRootSchema = (
	properties: Property[],
): JsonSchemaObject => {
	const rootSchema: JsonSchemaObject = {
		type: "object",
		properties: {},
		required: [],
	};
	properties.forEach((prop) => {
		if (prop.name) {
			if (!rootSchema.properties) rootSchema.properties = {};
			rootSchema.properties[prop.name] = generatePropertySchema(prop);
			if (prop.isRequired) {
				if (!rootSchema.required) rootSchema.required = [];
				rootSchema.required.push(prop.name);
			}
		}
	});
	if (rootSchema.required?.length === 0) {
		delete rootSchema.required;
	}
	return rootSchema;
};
