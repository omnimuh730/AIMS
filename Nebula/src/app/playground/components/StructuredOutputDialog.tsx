import * as React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Typography,
	Link,
	ToggleButtonGroup,
	ToggleButton,
	Paper,
	Box,
	TextField,
	Button,
	Select,
	MenuItem,
} from "@mui/material";
import {
	Close as CloseIcon,
	Star as StarIcon,
	StarBorder as StarBorderIcon,
	DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid"; // For unique IDs. Install: npm install uuid @types/uuid

// --- DATA STRUCTURE to match new requirements ---
interface Property {
	id: string;
	name: string;
	type: "string" | "number" | "integer" | "boolean" | "object" | "enum";
	isArray: boolean;
	isRequired: boolean;
	children: Property[];
}

const initialProperties: Property[] = [
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
const updatePropertyInTree = (
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

const addPropertyToTree = (
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

const deletePropertyFromTree = (
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

const generateRootSchema = (properties: Property[]) => {
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

// --- RECURSIVE COMPONENT for rendering property rows ---
interface PropertyRowProps {
	property: Property;
	level: number;
	onUpdate: (id: string, newValues: Partial<Property>) => void;
	onAddNested: (parentId: string) => void;
	onDelete: (id: string) => void;
}

function PropertyRow({
	property,
	level,
	onUpdate,
	onAddNested,
	onDelete,
}: PropertyRowProps) {
	return (
		<Box sx={{ ml: level * 4, pt: level > 0 ? 2 : 0 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
				<TextField
					placeholder="Enter property name"
					value={property.name}
					onChange={(e) =>
						onUpdate(property.id, { name: e.target.value })
					}
					size="small"
					sx={{ flexGrow: 1 }}
				/>
				<Select
					value={property.type}
					onChange={(e) =>
						onUpdate(property.id, {
							type: e.target.value as Property["type"],
						})
					}
					size="small"
				>
					<MenuItem value="string">string</MenuItem>
					<MenuItem value="number">number</MenuItem>
					<MenuItem value="integer">integer</MenuItem>
					<MenuItem value="boolean">boolean</MenuItem>
					<MenuItem value="object">object</MenuItem>
					<MenuItem value="enum">enum</MenuItem>
				</Select>
				<IconButton
					onClick={() =>
						onUpdate(property.id, { isArray: !property.isArray })
					}
					title="Make property an array"
					sx={{
						color: property.isArray
							? "primary.main"
							: "text.secondary",
					}}
				>
					<span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
						[ ]
					</span>
				</IconButton>
				<IconButton
					onClick={() =>
						onUpdate(property.id, {
							isRequired: !property.isRequired,
						})
					}
					title="Make property required"
				>
					{property.isRequired ? (
						<StarIcon sx={{ color: "#E67E22" }} />
					) : (
						<StarBorderIcon />
					)}
				</IconButton>
				<IconButton
					onClick={() => onDelete(property.id)}
					title="Delete property"
				>
					<DeleteIcon />
				</IconButton>
			</Box>
			{property.type === "object" && (
				<Button
					size="small"
					onClick={() => onAddNested(property.id)}
					sx={{ mt: 1, textTransform: "none", fontWeight: "medium" }}
				>
					Add nested property
				</Button>
			)}
			{property.children.map((child) => (
				<PropertyRow
					key={child.id}
					property={child}
					level={level + 1}
					onUpdate={onUpdate}
					onAddNested={onAddNested}
					onDelete={onDelete}
				/>
			))}
		</Box>
	);
}

// --- MAIN DIALOG COMPONENT ---
interface StructuredOutputDialogProps {
	open: boolean;
	onClose: () => void;
}

export function StructuredOutputDialog({
	open,
	onClose,
}: StructuredOutputDialogProps) {
	const [viewMode, setViewMode] = React.useState<"visual" | "code">("visual");
	const [properties, setProperties] =
		React.useState<Property[]>(initialProperties);

	const handleAddProperty = (parentId: string | null = null) =>
		setProperties((current) => addPropertyToTree(current, parentId));
	const handleUpdateProperty = (id: string, newValues: Partial<Property>) =>
		setProperties((current) =>
			updatePropertyInTree(current, id, newValues),
		);
	const handleDeleteProperty = (id: string) =>
		setProperties((current) => deletePropertyFromTree(current, id));
	const handleReset = () =>
		setProperties(JSON.parse(JSON.stringify(initialProperties)));

	const jsonSchema = React.useMemo(
		() => JSON.stringify(generateRootSchema(properties), null, 2),
		[properties],
	);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
			PaperProps={{ sx: { borderRadius: "16px" } }}
		>
			<DialogTitle
				sx={{ fontWeight: 400, fontSize: "1.5rem", p: "24px" }}
			>
				Structured output
				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", right: 16, top: 16 }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ p: "0 24px 24px" }}>
				<Typography
					variant="body2"
					sx={{ mb: 2, color: "text.secondary" }}
				>
					Enter an{" "}
					<Link href="#" underline="hover">
						OpenAPI schema object
					</Link>{" "}
					to constrain the model output. See the{" "}
					<Link href="#" underline="hover">
						API documentation
					</Link>{" "}
					for examples.
				</Typography>
				<ToggleButtonGroup
					value={viewMode}
					exclusive
					size="small"
					onChange={(e, newMode) => newMode && setViewMode(newMode)}
					sx={{ mb: 2 }}
				>
					<ToggleButton
						value="code"
						sx={{ textTransform: "none", px: 2 }}
					>
						Code Editor
					</ToggleButton>
					<ToggleButton
						value="visual"
						sx={{ textTransform: "none", px: 2 }}
					>
						Visual Editor
					</ToggleButton>
				</ToggleButtonGroup>

				{viewMode === "visual" ? (
					<Paper
						variant="outlined"
						sx={{ p: "16px 24px", borderRadius: 2 }}
					>
						<Typography variant="overline" color="text.secondary">
							Property
						</Typography>
						{properties.map((prop) => (
							<PropertyRow
								key={prop.id}
								property={prop}
								level={0}
								onUpdate={handleUpdateProperty}
								onAddNested={handleAddProperty}
								onDelete={handleDeleteProperty}
							/>
						))}
						<Button
							size="small"
							onClick={() => handleAddProperty(null)}
							sx={{
								mt: 2,
								textTransform: "none",
								fontWeight: "medium",
							}}
						>
							Add property
						</Button>
					</Paper>
				) : (
					<TextField
						multiline
						fullWidth
						rows={15}
						value={jsonSchema}
						InputProps={{ readOnly: true }}
						variant="outlined"
						sx={{
							"& .MuiOutlinedInput-root": {
								fontFamily: "monospace",
							},
						}}
					/>
				)}
			</DialogContent>
			<DialogActions sx={{ p: "16px 24px" }}>
				<Button onClick={handleReset} sx={{ fontWeight: "medium" }}>
					Reset
				</Button>
				<Button
					onClick={onClose}
					variant="contained"
					sx={{ borderRadius: "8px" }}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
