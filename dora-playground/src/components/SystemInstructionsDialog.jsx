import * as React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	TextField,
	Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export function SystemInstructionsDialog({
	open,
	onClose,
	value,
	onChange,
	onSave,
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>
				System instructions{" "}
				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", right: 8, top: 8 }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="system-instructions"
					label="Optional tone and style instructions for the model"
					type="text"
					fullWidth
					multiline
					rows={8}
					variant="outlined"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onSave} variant="contained">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
