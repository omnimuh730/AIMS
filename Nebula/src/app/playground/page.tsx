"use client";

import * as React from "react";
import { Box, Grid } from "@mui/material";
import { MainContent } from "./components/MainContent";
import { SettingsPanel } from "./components/SettingsPanel";
import { ModelSelectionDialog } from "./components/ModelSelectionDialog";
import { SystemInstructionsDialog } from "./components/SystemInstructionsDialog";
import { StructuredOutputDialog } from "./components/StructuredOutputDialog";
import { generateContent } from "@/api/graphql";

export default function PlaygroundPage() {
	// State for the main prompt input
	const [prompt, setPrompt] = React.useState(
		"Explain the probability of rolling two dice and getting 7",
	);

	// State for settings controls
	const [temperature, setTemperature] = React.useState<number>(1);
	const [groundingWithSearch, setGroundingWithSearch] = React.useState(true);
	const [urlContext, setUrlContext] = React.useState(true);
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
		name: "Gemini 2.5 Pro",
		id: "gemini-2.5-pro",
	});
	const [systemInstructions, setSystemInstructions] = React.useState("");

	const [response, setResponse] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);

	const handleRun = async () => {
		setIsLoading(true);
		setResponse("");
		try {
			const result = await generateContent(prompt);
			setResponse(result);
		} catch (error) {
			console.error("Error generating content:", error);
			setResponse("Error generating content. Please check the server logs.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<Grid container sx={{ flexGrow: 1 }}>
				<MainContent
					prompt={prompt}
					onPromptChange={setPrompt}
					onRun={handleRun}
					response={response}
					isLoading={isLoading}
				/>
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
					onEditStructuredOutput={() => setStructuredOutputOpen(true)}
					groundingWithSearch={groundingWithSearch}
					onGroundingWithSearchChange={setGroundingWithSearch}
					urlContext={urlContext}
					onUrlContextChange={setUrlContext}
				/>
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
			/>
		</Box>
	);
}
