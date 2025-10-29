// --- DATA STRUCTURE to match new requirements ---
export interface Property {
	id: string;
	name: string;
	type: "string" | "number" | "integer" | "boolean" | "object" | "enum";
	isArray: boolean;
	isRequired: boolean;
	children: Property[];
}
