import * as React from "react";
import { Box, Switch, Button } from "@mui/material";
import { SettingsItem } from "./SettingsItem";

interface ToolSwitchesProps {
	structuredOutputEnabled: boolean;
	onStructuredOutputChange: (enabled: boolean) => void;
	onEditStructuredOutput: () => void;
	groundingWithSearch: boolean;
	onGroundingWithSearchChange: (enabled: boolean) => void;
	urlContext: boolean;
	onUrlContextChange: (enabled: boolean) => void;
}

export function ToolSwitches({
	structuredOutputEnabled,
	onStructuredOutputChange,
	onEditStructuredOutput,
	groundingWithSearch,
	onGroundingWithSearchChange,
	urlContext,
	onUrlContextChange,
}: ToolSwitchesProps) {
	return (
		<>
			<SettingsItem label="Structured output">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					{structuredOutputEnabled && (
						<Button
							size="small"
							onClick={onEditStructuredOutput}
							sx={{ textTransform: "none" }}
						>
							Edit
						</Button>
					)}
					<Switch
						checked={structuredOutputEnabled}
						onChange={(e) => onStructuredOutputChange(e.target.checked)}
					/>
				</Box>
			</SettingsItem>
			<SettingsItem label="Grounding with Google Search">
				<Switch
					checked={groundingWithSearch}
					onChange={(e) => onGroundingWithSearchChange(e.target.checked)}
				/>
			</SettingsItem>
			<SettingsItem label="URL context">
				<Switch
					checked={urlContext}
					onChange={(e) => onUrlContextChange(e.target.checked)}
				/>
			</SettingsItem>
		</>
	);
}