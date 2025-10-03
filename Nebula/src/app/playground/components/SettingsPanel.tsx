import * as React from "react";
import { Box, Typography, Grid, Button, Divider } from "@mui/material";
import { ModelSelector } from "./ModelSelector";
import { TemperatureSlider } from "./TemperatureSlider";
import { ToolSwitches } from "./ToolSwitches";

interface SettingsPanelProps {
	selectedModel: { name: string; id: string };
	onModelSelectClick: () => void;
	onSystemInstructionsClick: () => void;
	temperature: number;
	onTemperatureChange: (value: number) => void;
	structuredOutputEnabled: boolean;
	onStructuredOutputChange: (enabled: boolean) => void;
	onEditStructuredOutput: () => void;
	groundingWithSearch: boolean;
	onGroundingWithSearchChange: (enabled: boolean) => void;
	urlContext: boolean;
	onUrlContextChange: (enabled: boolean) => void;
}

export function SettingsPanel({
	selectedModel,
	onModelSelectClick,
	onSystemInstructionsClick,
	temperature,
	onTemperatureChange,
	structuredOutputEnabled,
	onStructuredOutputChange,
	onEditStructuredOutput,
	groundingWithSearch,
	onGroundingWithSearchChange,
	urlContext,
	onUrlContextChange,
}: SettingsPanelProps) {
	return (
		<Grid
			sx={{
				width: { xs: "100%", md: "33.33%", lg: "25%" },
				bgcolor: "#f7f9fc",
				borderLeft: "1px solid #e0e0e0",
				p: 2.5,
				display: "flex",
				flexDirection: "column",
				gap: 2,
				overflowY: "auto",
			}}
			size={{ md: 12, lg: 3 }}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Typography variant="subtitle1" fontWeight="medium">
					Run settings
				</Typography>
			</Box>

			<ModelSelector
				selectedModel={selectedModel}
				onClick={onModelSelectClick}
			/>

			<Button
				onClick={onSystemInstructionsClick}
				fullWidth
				variant="outlined"
				sx={{
					justifyContent: "flex-start",
					textTransform: "none",
					color: "text.primary",
					borderColor: "rgba(0, 0, 0, 0.23)",
					borderRadius: 2,
					p: 1.5,
				}}
			>
				System instructions
			</Button>

			<TemperatureSlider value={temperature} onChange={onTemperatureChange} />

			<Divider sx={{ my: 1 }} />

			<Typography variant="overline" color="text.secondary">
				Tools
			</Typography>

			<ToolSwitches
				structuredOutputEnabled={structuredOutputEnabled}
				onStructuredOutputChange={onStructuredOutputChange}
				onEditStructuredOutput={onEditStructuredOutput}
				groundingWithSearch={groundingWithSearch}
				onGroundingWithSearchChange={onGroundingWithSearchChange}
				urlContext={urlContext}
				onUrlContextChange={onUrlContextChange}
			/>
		</Grid>
	);
}