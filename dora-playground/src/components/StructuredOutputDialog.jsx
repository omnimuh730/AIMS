import * as React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Typography,
	TextField,
	Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export function StructuredOutputDialog({
	open,
	onClose,
	initialJsonSchema,
	onSave,
}) {
	const [jsonSchema, setJsonSchema] = React.useState(initialJsonSchema || "");

	React.useEffect(() => {
		if (open && initialJsonSchema) {
			setJsonSchema(initialJsonSchema);
		}
	}, [open, initialJsonSchema]);

	const handleSave = () => {
		if (onSave) {
			onSave(jsonSchema);
		}
		onClose();
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
					Enter a JSON schema to constrain the model output.
				</Typography>
				<TextField
					autoFocus
					margin="dense"
					id="json-schema"
					label="JSON Schema"
					type="text"
					fullWidth
					multiline
					rows={12}
					variant="outlined"
					value={jsonSchema}
					onChange={(e) => setJsonSchema(e.target.value)}
					placeholder='{"type": "object", "properties": {...}}'
				/>
			</DialogContent>
			<DialogActions sx={{ p: "16px 24px" }}>
				<Button onClick={onClose} sx={{ fontWeight: "medium" }}>
					Cancel
				</Button>
				<Button
					onClick={handleSave}
					variant="contained"
					sx={{ borderRadius: "8px" }}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
