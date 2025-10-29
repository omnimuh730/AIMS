import * as React from "react";
import { Box, Switch, Button } from "@mui/material";
import { SettingsItem } from "./SettingsItem";

export function ToolSwitches({
	structuredOutputEnabled,
	onStructuredOutputChange,
	onEditStructuredOutput,
}) {
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
						onChange={(e) =>
							onStructuredOutputChange(e.target.checked)
						}
					/>
				</Box>
			</SettingsItem>
		</>
	);
}
