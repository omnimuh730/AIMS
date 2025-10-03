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

interface Model {
	name: string;
	id: string;
	desc: string;
}

interface ModelSelectionDialogProps {
	open: boolean;
	onClose: () => void;
	onSelectModel: (model: Model) => void;
}

const models: Model[] = [
	{
		name: "Gemini 2.5 Pro",
		id: "gemini-2.5-pro",
		desc: "Our most powerful reasoning model...",
	},
	{
		name: "Nano Banana",
		id: "gemini-2.5-flash-image",
		desc: "State-of-the-art image generation...",
	},
	{
		name: "Gemini Flash Latest",
		id: "gemini-flash-latest",
		desc: "Our hybrid reasoning model...",
	},
];

export function ModelSelectionDialog({
	open,
	onClose,
	onSelectModel,
}: ModelSelectionDialogProps) {
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
						<Typography variant="subtitle1">{model.name}</Typography>
						<Typography variant="body2" color="text.secondary">
							{model.desc}
						</Typography>
					</Paper>
				))}
			</DialogContent>
		</Dialog>
	);
}