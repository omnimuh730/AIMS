import { v4 as uuidv4 } from "uuid";
import { Property } from "./types";

export const initialProperties: Property[] = [
	{
		id: uuidv4(),
		name: "Interaction Item",
		type: "object",
		isArray: false,
		isRequired: false,
		children: [],
	},
];

// --- HELPER FUNCTIONS for immutable state updates ---
export const updatePropertyInTree = (
	properties: Property[],
	id: string,
	newValues: Partial<Property>,
): Property[] => {
	return properties.map((prop) => {
		if (prop.id === id) {
			return { ...prop, ...newValues };
		}
		if (prop.children.length > 0) {
			return {
				...prop,
				children: updatePropertyInTree(prop.children, id, newValues),
			};
		}
		return prop;
	});
};

export const addPropertyToTree = (
	properties: Property[],
	parentId: string | null,
): Property[] => {
	const newProp: Property = {
		id: uuidv4(),
		name: "",
		type: "string",
		isArray: false,
		isRequired: false,
		children: [],
	};
	if (!parentId) {
		// Add to root
		return [...properties, newProp];
	}
	return properties.map((prop) => {
		if (prop.id === parentId) {
			return { ...prop, children: [...prop.children, newProp] };
		}
		if (prop.children.length > 0) {
			return {
				...prop,
				children: addPropertyToTree(prop.children, parentId),
			};
		}
		return prop;
	});
};

export const deletePropertyFromTree = (
	properties: Property[],
	id: string,
): Property[] => {
	return properties
		.filter((prop) => prop.id !== id)
		.map((prop) => {
			if (prop.children.length > 0) {
				return {
					...prop,
					children: deletePropertyFromTree(prop.children, id),
				};
			}
			return prop;
		});
};
