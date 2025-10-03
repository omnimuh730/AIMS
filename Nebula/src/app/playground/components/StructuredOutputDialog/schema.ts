import { Property } from "./types";

// --- OpenAPI SCHEMA GENERATOR ---
const generatePropertySchema = (prop: Property): any => {
	let propertySchema: any;
	if (prop.type === "object") {
		const nestedSchema: any = {
			type: "object",
			properties: {},
			required: [],
		};
		prop.children.forEach((child) => {
			if (child.name) {
				nestedSchema.properties[child.name] =
					generatePropertySchema(child);
				if (child.isRequired) nestedSchema.required.push(child.name);
			}
		});
		if (nestedSchema.required.length === 0) delete nestedSchema.required;
		propertySchema = nestedSchema;
	} else {
		propertySchema = { type: prop.type };
		if (prop.type === "enum") propertySchema.enum = ["VALUE_1", "VALUE_2"]; // Placeholder for enum values
	}
	return prop.isArray
		? { type: "array", items: propertySchema }
		: propertySchema;
};

export const generateRootSchema = (properties: Property[]) => {
	const rootSchema: any = { type: "object", properties: {}, required: [] };
	properties.forEach((prop) => {
		if (prop.name) {
			rootSchema.properties[prop.name] = generatePropertySchema(prop);
			if (prop.isRequired) rootSchema.required.push(prop.name);
		}
	});
	if (rootSchema.required.length === 0) delete rootSchema.required;
	return rootSchema;
};
