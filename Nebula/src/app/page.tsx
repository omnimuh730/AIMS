"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";

export default function DemoPageContent() {
	const pathname = usePathname();
	return (
		<Box
			sx={{
				py: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				textAlign: "center",
			}}
		>
			<Typography>Dashboard content for {pathname}</Typography>
		</Box>
	);
}
