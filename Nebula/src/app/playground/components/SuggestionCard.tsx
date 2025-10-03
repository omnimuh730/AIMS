import * as React from "react";
import { Grid, Paper, Box, Typography } from "@mui/material";

export const SuggestionCard = ({
	icon,
	title,
	text,
}: {
	icon: React.ReactNode;
	title: string;
	text: string;
}) => (
	<Grid sx={{ xs: 12, sm: 6 }}>
		<Paper
			variant="outlined"
			sx={{
				p: 2,
				display: "flex",
				gap: 2,
				alignItems: "center",
				height: "100%",
				cursor: "pointer",
				borderRadius: 2,
				"&:hover": { borderColor: "primary.main", boxShadow: 1 },
			}}
		>
			<Box sx={{ color: "text.secondary" }}>{icon}</Box>
			<Box>
				<Typography variant="body1" fontWeight="medium">
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{text}
				</Typography>
			</Box>
		</Paper>
	</Grid>
);