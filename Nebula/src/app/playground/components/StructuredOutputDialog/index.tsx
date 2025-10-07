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
	Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Property } from "./types";
import {
	initialProperties,
	addPropertyToTree,
	updatePropertyInTree,
	deletePropertyFromTree,
} from "./state";
import { generateRootSchema, schemaToProperties } from "./schema";
import { VisualEditor } from "./VisualEditor";
import { CodeEditor } from "./CodeEditor";

// --- MAIN DIALOG COMPONENT ---
interface StructuredOutputDialogProps {
	open: boolean;
	onClose: () => void;
	initialJsonSchema?: string;
	onSave?: (jsonSchema: string) => void;
}

export function StructuredOutputDialog({
	open,
	onClose,
	initialJsonSchema,
	onSave,
}: StructuredOutputDialogProps) {
	const [viewMode, setViewMode] = React.useState<"visual" | "code">("visual");
	const [properties, setProperties] =
		React.useState<Property[]>(initialProperties);
	const [jsonSchemaString, setJsonSchemaString] = React.useState(() =>
		JSON.stringify(generateRootSchema(properties), null, 2),
	);

	React.useEffect(() => {
		setJsonSchemaString(JSON.stringify(generateRootSchema(properties), null, 2));
	}, [properties]);

	// When dialog opens or initialJsonSchema changes, seed state from it if provided
	React.useEffect(() => {
		if (!open) return;
		if (!initialJsonSchema) return;
		try {
			const parsed = JSON.parse(initialJsonSchema);
			setProperties(schemaToProperties(parsed));
			setJsonSchemaString(JSON.stringify(parsed, null, 2));
		} catch (e) {
			console.warn("Invalid initialJsonSchema passed to StructuredOutputDialog");
		}
	}, [open, initialJsonSchema]);

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

	const handleSchemaChange = (newSchema: string) => {
		setJsonSchemaString(newSchema);
		try {
			const schema = JSON.parse(newSchema);
			const newProperties = schemaToProperties(schema);
			setProperties(newProperties);
		} catch (error) {
			// In a real app, you'd want to show a validation error to the user
			console.error("Invalid JSON:", error);
		}
	};

	const handleViewModeChange = (
		event: React.MouseEvent<HTMLElement>,
		newMode: "visual" | "code" | null,
	) => {
		if (newMode) {
			if (viewMode === "code" && newMode === "visual") {
				try {
					const schema = JSON.parse(jsonSchemaString);
					const newProperties = schemaToProperties(schema);
					setProperties(newProperties);
				} catch (error) {
					console.error("Invalid JSON, cannot switch to visual mode:", error);
					// Optionally, prevent switching or show an error to the user
					return;
				}
			}
			setViewMode(newMode);
		}
	};

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
					onChange={handleViewModeChange}
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
					<VisualEditor
						properties={properties}
						onAdd={handleAddProperty}
						onUpdate={handleUpdateProperty}
						onDelete={handleDeleteProperty}
					/>
				) : (
					<CodeEditor
						jsonSchema={jsonSchemaString}
						onJsonSchemaChange={handleSchemaChange}
					/>
				)}
			</DialogContent>
			<DialogActions sx={{ p: "16px 24px" }}>
				<Button onClick={handleReset} sx={{ fontWeight: "medium" }}>
					Reset
				</Button>
				<Button
					onClick={() => {
						if (onSave) onSave(jsonSchemaString);
						onClose();
					}}
					variant="contained"
					sx={{ borderRadius: "8px" }}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
