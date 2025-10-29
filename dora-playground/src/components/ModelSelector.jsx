import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";

export function ModelSelector({ selectedModel, onClick }) {
	return (
		<Button
			onClick={onClick}
			fullWidth
			variant="outlined"
			sx={{
				justifyContent: "space-between",
				textAlign: "left",
				textTransform: "none",
				color: "text.primary",
				borderColor: "rgba(0, 0, 0, 0.23)",
				borderRadius: 2,
				p: 1.5,
			}}
		>
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="subtitle2">{selectedModel.name}</Typography>
				<Typography variant="caption" color="text.secondary">
					{selectedModel.id}
				</Typography>
			</Box>
			<ChevronRightIcon />
		</Button>
	);
}
