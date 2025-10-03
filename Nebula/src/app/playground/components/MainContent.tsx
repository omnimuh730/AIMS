import * as React from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { PromptInput } from "./PromptInput";

interface MainContentProps {
	prompt: string;
	onPromptChange: (value: string) => void;
	onRun: () => void;
	response: string;
	isLoading: boolean;
}

export function MainContent({
	prompt,
	onPromptChange,
	onRun,
	response,
	isLoading,
}: MainContentProps) {
	return (
		<Grid
			sx={{
				display: "flex",
				flexDirection: "column",
				p: { xs: 2, md: 3 },
			}}
			size={{ md: 12, lg: 9 }}
		>
			<Box
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{isLoading ? (
					<CircularProgress />
				) : response ? (
					<Typography variant="body1">{response}</Typography>
				) : (
					<Typography
						variant="h2"
						component="h1"
						sx={{
							fontWeight: "400",
							mb: 1,
							color: "text.primary",
						}}
					>
						AI Studio
					</Typography>
				)}
			</Box>
			<PromptInput
				prompt={prompt}
				onPromptChange={onPromptChange}
				onRun={onRun}
			/>
		</Grid>
	);
}