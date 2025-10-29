import * as React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Typography,
	Paper,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const models = [
	{
		name: "Gemini 2.5 Pro",
		id: "gemini-2.5-pro",
		desc: "Our most powerful reasoning model...",
	},
	{
		name: "Gemini 2.5 Flash",
		id: "gemini-2.5-flash",
		desc: "State-of-the-art image generation...",
	},
	{
		name: "Gemini 2.5 Flash Preview",
		id: "gemini-2.5-flash-preview-09-2025",
		desc: "State-of-the-art image generation...",
	},
	{
		name: "Gemini Flash Lite",
		id: "gemini-2.5-flash-lite",
		desc: "Our hybrid reasoning model...",
	},
	{
		name: "Gemini Flash Lite Preview",
		id: "gemini-2.5-flash-lite-preview-09-2025",
		desc: "Our hybrid reasoning model...",
	},
];

export function ModelSelectionDialog({
	open,
	onClose,
	onSelectModel,
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>
				Model selection{" "}
				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", right: 8, top: 8 }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body2" color="text.secondary" gutterBottom>
					Select a model to use for your prompt.
				</Typography>
				{models.map((model) => (
					<Paper
						key={model.id}
						variant="outlined"
						sx={{
							p: 2,
							mb: 1,
							cursor: "pointer",
							"&:hover": { borderColor: "primary.main" },
						}}
						onClick={() => {
							onSelectModel(model);
							onClose();
						}}
					>
						<Typography variant="subtitle1">
							{model.name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{model.desc}
						</Typography>
					</Paper>
				))}
			</DialogContent>
		</Dialog>
	);
}
