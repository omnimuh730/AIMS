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
import { generateRootSchema } from "./schema";
import { VisualEditor } from "./VisualEditor";
import { CodeEditor } from "./CodeEditor";

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
					<VisualEditor
						properties={properties}
						onAdd={handleAddProperty}
						onUpdate={handleUpdateProperty}
						onDelete={handleDeleteProperty}
					/>
				) : (
					<CodeEditor jsonSchema={jsonSchema} />
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
