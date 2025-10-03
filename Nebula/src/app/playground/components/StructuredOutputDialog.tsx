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
} from "@mui/material";
import {
	Close as CloseIcon,
	StarBorder as StarIcon,
	DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

interface StructuredOutputDialogProps {
	open: boolean;
	onClose: () => void;
}

export function StructuredOutputDialog({
	open,
	onClose,
}: StructuredOutputDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>
				Structured output{" "}
				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", right: 8, top: 8 }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body2" sx={{ mb: 2 }}>
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
					value={"visual"}
					exclusive
					size="small"
					sx={{ mb: 2 }}
				>
					<ToggleButton value="code">Code Editor</ToggleButton>
					<ToggleButton value="visual">Visual Editor</ToggleButton>
				</ToggleButtonGroup>
				<Paper variant="outlined" sx={{ p: 2 }}>
					<Typography variant="overline" color="text.secondary">
						Property
					</Typography>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						<TextField
							defaultValue="interaction_item"
							size="small"
							sx={{ flexGrow: 1 }}
						/>
						<TextField defaultValue="object" size="small" />
						<IconButton>
							<StarIcon />
						</IconButton>
						<IconButton>
							<DeleteIcon />
						</IconButton>
					</Box>
					<Button size="small" sx={{ mt: 1 }}>
						Add nested property
					</Button>
					<br />
					<Button size="small">Add property</Button>
				</Paper>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Reset</Button>
				<Button onClick={onClose} variant="contained">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}