"use client";

import * as React from "react";
import { Box, Grid } from "@mui/material";
import { MainContent } from "./components/MainContent";
import { SettingsPanel } from "./components/SettingsPanel";
import { ModelSelectionDialog } from "./components/ModelSelectionDialog";
import { SystemInstructionsDialog } from "./components/SystemInstructionsDialog";
import { StructuredOutputDialog } from "./components/StructuredOutputDialog";
import { generateContent } from "@/api/rest";

export default function PlaygroundPage() {
	// State for the main prompt input
	const [prompt, setPrompt] = React.useState(
		"Explain the probability of rolling two dice and getting 7",
	);

	// State for settings controls
	const [temperature, setTemperature] = React.useState<number>(1);
	const [structuredOutputEnabled, setStructuredOutputEnabled] =
		React.useState(false);

	// State to control the open/closed status of dialogs
	const [modelSelectionOpen, setModelSelectionOpen] = React.useState(false);
	const [systemInstructionsOpen, setSystemInstructionsOpen] =
		React.useState(false);
	const [structuredOutputOpen, setStructuredOutputOpen] =
		React.useState(false);

	// State for the data inside the dialogs
	const [selectedModel, setSelectedModel] = React.useState({
		name: "Gemini 2.5 Flash Lite",
		id: "gemini-2.5-flash-lite",
	});
	const [systemInstructions, setSystemInstructions] = React.useState("");

	const [response, setResponse] = React.useState("");
	const [jsonSchema, setJsonSchema] = React.useState<string | undefined>(
		undefined,
	);
	const [isLoading, setIsLoading] = React.useState(false);

	const handleRun = async () => {
		setIsLoading(true);
		setResponse("");
		try {
			const result = await generateContent({
				prompt,
				systemInstruction: systemInstructions,
				temperature,
				jsonOutput: structuredOutputEnabled,
				modelName: selectedModel.id,
				responseSchema: structuredOutputEnabled ? jsonSchema ?? null : null,
			});
			setResponse(result);
		} catch (error) {
			console.error("Error generating content:", error);
			setResponse(
				"Error generating content. Please check the server logs.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<Grid container sx={{ flexGrow: 1 }}>
				<Grid size={{ lg: 9, md: 12 }}>
					<MainContent
						prompt={prompt}
						onPromptChange={setPrompt}
						onRun={handleRun}
						response={response}
						isLoading={isLoading}
					/>
				</Grid>
				<Grid size={{ lg: 3, md: 12 }}>
					<SettingsPanel
						selectedModel={selectedModel}
						onModelSelectClick={() => setModelSelectionOpen(true)}
						onSystemInstructionsClick={() =>
							setSystemInstructionsOpen(true)
						}
						temperature={temperature}
						onTemperatureChange={setTemperature}
						structuredOutputEnabled={structuredOutputEnabled}
						onStructuredOutputChange={setStructuredOutputEnabled}
						onEditStructuredOutput={() =>
							setStructuredOutputOpen(true)
						}
					/>
				</Grid>
			</Grid>

			<ModelSelectionDialog
				open={modelSelectionOpen}
				onClose={() => setModelSelectionOpen(false)}
				onSelectModel={(model) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { desc, ...rest } = model;
					setSelectedModel(rest);
				}}
			/>

			<SystemInstructionsDialog
				open={systemInstructionsOpen}
				onClose={() => setSystemInstructionsOpen(false)}
				value={systemInstructions}
				onChange={setSystemInstructions}
				onSave={() => setSystemInstructionsOpen(false)}
			/>

			<StructuredOutputDialog
				open={structuredOutputOpen}
				onClose={() => setStructuredOutputOpen(false)}
				initialJsonSchema={jsonSchema}
				onSave={(schema) => setJsonSchema(schema)}
			/>
		</Box>
	);
}
