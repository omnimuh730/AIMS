import { Property } from "./types";
import { v4 as uuidv4 } from "uuid";

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

const jsonTypeToPropertyType = (
	type: string | undefined,
	property: JsonSchemaObject,
): "string" | "number" | "integer" | "boolean" | "object" | "enum" => {
	if (property.enum) {
		return "enum";
	}
	switch (type) {
		case "string":
		case "number":
		case "integer":
		case "boolean":
		case "object":
			return type;
		default:
			return "string"; // Default to string
	}
};

const processSchemaProperties = (
	properties: { [key: string]: JsonSchemaObject },
	required: string[],
): Property[] => {
	return Object.entries(properties).map(([name, schema]) => {
		return schemaToProperty(name, schema, required.includes(name));
	});
};

const schemaToProperty = (
	name: string,
	schema: JsonSchemaObject,
	isRequired: boolean,
): Property => {
	let children: Property[] = [];
	let type = schema.type;
	let isArray = false;
	let itemsSchema = schema;

	if (type === "array") {
		isArray = true;
		itemsSchema = schema.items || {};
		type = itemsSchema.type;
	}

	if (itemsSchema.type === "object" && itemsSchema.properties) {
		children = processSchemaProperties(
			itemsSchema.properties,
			itemsSchema.required || [],
		);
	}

	return {
		id: uuidv4(),
		name: name,
		type: jsonTypeToPropertyType(type, itemsSchema),
		isRequired: isRequired,
		isArray: isArray,
		children: children,
	};
};

export const schemaToProperties = (
	schema: JsonSchemaObject,
): Property[] => {
	if (
		schema.type !== "object" ||
		!schema.properties
	) {
		// Return empty array or throw an error if the root is not an object with properties
		return [];
	}

	return processSchemaProperties(schema.properties, schema.required || []);
};
