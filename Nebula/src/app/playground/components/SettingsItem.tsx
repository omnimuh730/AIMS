import * as React from "react";
import { Box, Typography } from "@mui/material";

export const SettingsItem = ({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) => (
	<Box
		sx={{
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			my: 1,
		}}
	>
		<Typography variant="body2">{label}</Typography>
		{children}
	</Box>
);