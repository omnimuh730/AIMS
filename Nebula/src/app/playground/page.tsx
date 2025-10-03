"use client";

import * as React from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Grid,
	Paper,
	Slider,
	Switch,
	IconButton,
	InputAdornment,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	ToggleButtonGroup,
	ToggleButton,
	Link,
} from "@mui/material";
import {
	Add as AddIcon,
	MoreVert as MoreVertIcon,
	AutoAwesome as SparkleIcon,
	ChevronRight as ChevronRightIcon,
	Public as PublicIcon,
	RecordVoiceOver as RecordVoiceOverIcon,
	Code as CodeIcon,
	ExpandMore as ExpandMoreIcon,
	PlayArrow as PlayArrowIcon,
	Close as CloseIcon,
	StarBorder as StarIcon,
	DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

// Helper component for suggestion cards
const SuggestionCard = ({
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

// Helper component for settings items in the right panel
const SettingsItem = ({
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

export default function GoogleAIStudioPage() {
	// State for the main prompt input
	const [prompt, setPrompt] = React.useState(
		"Explain the probability of rolling two dice and getting 7",
	);

	// State for settings controls
	const [temperature, setTemperature] = React.useState<number>(1);
	const [thinkingMode, setThinkingMode] = React.useState(false);
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

	return (
		<Box sx={{ display: "flex", height: "100vh", backgroundColor: "#fff" }}>
			<Grid container sx={{ flexGrow: 1 }}>
				{/* Main Content Area */}
				<Grid
					sx={{
						display: "flex",
						flexDirection: "column",
						p: { xs: 2, md: 3 },
					}}
					size={{ md: 12, lg: 9 }}
				>
					{/* Centered content with suggestions */}
					<Box
						sx={{
							flexGrow: 1,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
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
					</Box>

					{/* PROBLEM 4 SOLVED: User Input field at the bottom */}
					<Box
						sx={{
							width: "100%",
							maxWidth: "900px",
							mx: "auto",
							py: 2,
						}}
					>
						<Paper elevation={2} sx={{ borderRadius: "28px" }}>
							<TextField
								fullWidth
								multiline
								minRows={1}
								variant="outlined"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								placeholder="Enter a prompt here"
								sx={{
									"& .MuiOutlinedInput-root": {
										paddingRight: "4px",
										borderRadius: "24px",
										"& fieldset": { border: "none" },
									},
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Button
												variant="contained"
												endIcon={<PlayArrowIcon />}
												sx={{
													borderRadius: "20px",
													mr: 1,
													textTransform: "none",
												}}
											>
												Run
											</Button>
										</InputAdornment>
									),
								}}
							/>
						</Paper>
					</Box>
				</Grid>

				{/* Right Settings Panel */}
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

					{/* PROBLEM 1 SOLVED: This button now opens the Model Selection Dialog */}
					<Button
						onClick={() => setModelSelectionOpen(true)}
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
							<Typography variant="subtitle2">
								{selectedModel.name}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{selectedModel.id}
							</Typography>
						</Box>
						<ChevronRightIcon />
					</Button>

					{/* PROBLEM 2 SOLVED: This button now opens the System Instructions Dialog */}
					<Button
						onClick={() => setSystemInstructionsOpen(true)}
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

					<Box>
						<SettingsItem label="Temperature">
							<Typography variant="body2" color="text.secondary">
								{temperature.toFixed(1)}
							</Typography>
						</SettingsItem>
						<Slider
							value={temperature}
							onChange={(e, v) => setTemperature(v as number)}
							aria-labelledby="temperature-slider"
							step={0.1}
							min={0}
							max={2}
						/>
					</Box>

					<Divider sx={{ my: 1 }} />

					<Typography variant="overline" color="text.secondary">
						Tools
					</Typography>

					{/* PROBLEM 3 SOLVED: Switch controls the Edit button, which opens the Structured Output Dialog */}
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
									onClick={() =>
										setStructuredOutputOpen(true)
									}
									sx={{ textTransform: "none" }}
								>
									Edit
								</Button>
							)}
							<Switch
								checked={structuredOutputEnabled}
								onChange={(e) =>
									setStructuredOutputEnabled(e.target.checked)
								}
							/>
						</Box>
					</SettingsItem>

					<SettingsItem label="Grounding with Google Search">
						<Switch
							checked={groundingWithSearch}
							onChange={(e) =>
								setGroundingWithSearch(e.target.checked)
							}
						/>
					</SettingsItem>
					<SettingsItem label="URL context">
						<Switch
							checked={urlContext}
							onChange={(e) => setUrlContext(e.target.checked)}
						/>
					</SettingsItem>
				</Grid>
			</Grid>

			{/* Dialog for Model Selection */}
			<Dialog
				open={modelSelectionOpen}
				onClose={() => setModelSelectionOpen(false)}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>
					Model selection{" "}
					<IconButton
						onClick={() => setModelSelectionOpen(false)}
						sx={{ position: "absolute", right: 8, top: 8 }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<Typography
						variant="body2"
						color="text.secondary"
						gutterBottom
					>
						Select a model to use for your prompt.
					</Typography>
					{/* Dummy Model Data */}
					{[
						{
							name: "Gemini 2.5 Pro",
							id: "gemini-2.5-pro",
							desc: "Our most powerful reasoning model...",
						},
						{
							name: "Nano Banana",
							id: "gemini-2.5-flash-image",
							desc: "State-of-the-art image generation...",
						},
						{
							name: "Gemini Flash Latest",
							id: "gemini-flash-latest",
							desc: "Our hybrid reasoning model...",
						},
					].map((model) => (
						<Paper
							key={model.id}
							variant="outlined"
							sx={{
								p: 2,
								mb: 1,
								cursor: "pointer",
								"&:hover": { borderColor: "primary.main" },
							}}
							onClick={() => {
								setSelectedModel(model);
								setModelSelectionOpen(false);
							}}
						>
							<Typography variant="subtitle1">
								{model.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{model.desc}
							</Typography>
						</Paper>
					))}
				</DialogContent>
			</Dialog>

			{/* Dialog for System Instructions */}
			<Dialog
				open={systemInstructionsOpen}
				onClose={() => setSystemInstructionsOpen(false)}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>
					System instructions{" "}
					<IconButton
						onClick={() => setSystemInstructionsOpen(false)}
						sx={{ position: "absolute", right: 8, top: 8 }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="system-instructions"
						label="Optional tone and style instructions for the model"
						type="text"
						fullWidth
						multiline
						rows={8}
						variant="outlined"
						value={systemInstructions}
						onChange={(e) => setSystemInstructions(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setSystemInstructionsOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => setSystemInstructionsOpen(false)}
						variant="contained"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			{/* Dialog for Structured Output */}
			<Dialog
				open={structuredOutputOpen}
				onClose={() => setStructuredOutputOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>
					Structured output{" "}
					<IconButton
						onClick={() => setStructuredOutputOpen(false)}
						sx={{ position: "absolute", right: 8, top: 8 }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<Typography variant="body2" sx={{ mb: 2 }}>
						Enter an{" "}
						<Link href="#" underline="hover">
							OpenAPI schema object
						</Link>{" "}
						to constrain the model output. See the{" "}
						<Link href="#" underline="hover">
							API documentation
						</Link>{" "}
						for examples.
					</Typography>
					<ToggleButtonGroup
						value={"visual"}
						exclusive
						size="small"
						sx={{ mb: 2 }}
					>
						<ToggleButton value="code">Code Editor</ToggleButton>
						<ToggleButton value="visual">
							Visual Editor
						</ToggleButton>
					</ToggleButtonGroup>
					<Paper variant="outlined" sx={{ p: 2 }}>
						<Typography variant="overline" color="text.secondary">
							Property
						</Typography>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<TextField
								defaultValue="interaction_item"
								size="small"
								sx={{ flexGrow: 1 }}
							/>
							<TextField defaultValue="object" size="small" />
							<IconButton>
								<StarIcon />
							</IconButton>
							<IconButton>
								<DeleteIcon />
							</IconButton>
						</Box>
						<Button size="small" sx={{ mt: 1 }}>
							Add nested property
						</Button>
						<br />
						<Button size="small">Add property</Button>
					</Paper>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setStructuredOutputOpen(false)}>
						Reset
					</Button>
					<Button
						onClick={() => setStructuredOutputOpen(false)}
						variant="contained"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
