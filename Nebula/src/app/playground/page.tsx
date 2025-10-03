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
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Switch,
	IconButton,
	InputAdornment,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Divider,
	SelectChangeEvent,
} from "@mui/material";
import {
	Add as AddIcon,
	MoreVert as MoreVertIcon,
	AutoAwesome as SparkleIcon,
	ChevronRight as ChevronRightIcon,
	Public as PublicIcon,
	RecordVoiceOver as RecordVoiceOverIcon,
	Code as CodeIcon,
	Settings as SettingsIcon,
	ExpandMore as ExpandMoreIcon,
	PlayArrow as PlayArrowIcon,
	Edit as EditIcon,
} from "@mui/icons-material";

// Helper component for the suggestion cards in the center
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

// Helper component for settings items in the right panel for consistency
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
	// State for various controls in the settings panel
	const [temperature, setTemperature] = React.useState<number>(1);
	const [mediaResolution, setMediaResolution] = React.useState("default");
	const [thinkingMode, setThinkingMode] = React.useState(false);
	const [groundingWithSearch, setGroundingWithSearch] = React.useState(true);
	const [urlContext, setUrlContext] = React.useState(true);

	// State for the main prompt input
	const [prompt, setPrompt] = React.useState(
		"Explain the probability of rolling two dice and getting 7",
	);

	const handleTemperatureChange = (
		event: Event,
		newValue: number | number[],
	) => {
		setTemperature(newValue as number);
	};

	const handleMediaResolutionChange = (event: SelectChangeEvent) => {
		setMediaResolution(event.target.value as string);
	};

	return (
		<Box sx={{ display: "flex", height: "100vh", backgroundColor: "#fff" }}>
			<Grid container sx={{ flexGrow: 1 }}>
				{/* Main Content Area (Left/Center) */}
				<Grid
					sx={{
						xs: 12,
						md: 8,
						lg: 9,
						display: "flex",
						flexDirection: "column",
						p: { xs: 2, md: 3 },
					}}
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
							Google AI Studio
						</Typography>
						<Typography
							variant="body1"
							sx={{ mb: 4, color: "text.secondary" }}
						>
							What's new
						</Typography>
						<Grid
							container
							spacing={2}
							sx={{ maxWidth: "800px", width: "100%" }}
						>
							<SuggestionCard
								icon={<SparkleIcon />}
								title="Try Nano Banana"
								text="Gemini 2.5 Flash image, state-of-the-art image generation and editing"
							/>
							<SuggestionCard
								icon={<PublicIcon />}
								title="Fetch information with URL context"
								text="Fetch real-time information from web links"
							/>
							<SuggestionCard
								icon={<RecordVoiceOverIcon />}
								title="Generate native speech with Gemini"
								text="Generate high quality text to speech with Gemini"
							/>
							<SuggestionCard
								icon={<CodeIcon />}
								title="Talk to Gemini live"
								text="Try Gemini's natural, real-time dialogue experience, with audio and video inputs"
							/>
						</Grid>
					</Box>

					{/* Prompt Input at the bottom */}
					<Box
						sx={{
							width: "100%",
							maxWidth: "900px",
							mx: "auto",
							py: 2,
						}}
					>
						<Paper
							elevation={2}
							sx={{ borderRadius: "28px", p: "4px" }}
						>
							<TextField
								fullWidth
								multiline
								minRows={1}
								variant="outlined"
								placeholder="Explain the probability of rolling two dice and getting 7"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								sx={{
									"& .MuiOutlinedInput-root": {
										paddingRight: "4px",
										borderRadius: "24px",
										"& fieldset": {
											border: "none",
										},
									},
									"& .MuiOutlinedInput-input": {
										padding: "16.5px 14px",
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
						width: { xs: "100%", md: "33.33%", lg: "25%" }, // Responsive width
						bgcolor: "#f7f9fc",
						borderLeft: "1px solid #e0e0e0",
						p: 2.5,
						display: "flex",
						flexDirection: "column",
						gap: 2,
						overflowY: "auto", // Allow scrolling if content overflows
					}}
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
						<Box>
							<IconButton size="small">
								<AddIcon />
							</IconButton>
							<IconButton size="small">
								<MoreVertIcon />
							</IconButton>
							<Button
								variant="outlined"
								size="small"
								startIcon={<CodeIcon />}
								sx={{
									ml: 1,
									textTransform: "none",
									borderRadius: "16px",
								}}
							>
								Get code
							</Button>
						</Box>
					</Box>

					<Button
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
								Gemini 2.5 Pro
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Our most powerful reasoning model...
							</Typography>
						</Box>
						<ChevronRightIcon />
					</Button>

					<Button
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
							onChange={handleTemperatureChange}
							aria-labelledby="temperature-slider"
							valueLabelDisplay="auto"
							step={0.1}
							min={0}
							max={2}
						/>
					</Box>

					<FormControl fullWidth variant="outlined" size="small">
						<InputLabel>Media resolution</InputLabel>
						<Select
							label="Media resolution"
							value={mediaResolution}
							onChange={handleMediaResolutionChange}
						>
							<MenuItem value="default">Default</MenuItem>
							<MenuItem value="high">High</MenuItem>
							<MenuItem value="low">Low</MenuItem>
						</Select>
					</FormControl>

					<Divider sx={{ my: 1 }} />

					<Typography variant="overline" color="text.secondary">
						Thinking
					</Typography>
					<SettingsItem label="Thinking mode">
						<Switch
							checked={thinkingMode}
							onChange={(e) => setThinkingMode(e.target.checked)}
						/>
					</SettingsItem>
					<SettingsItem label="Set thinking budget">
						<IconButton size="small">
							<SettingsIcon />
						</IconButton>
					</SettingsItem>

					<Divider sx={{ my: 1 }} />

					<Typography variant="overline" color="text.secondary">
						Tools
					</Typography>
					<SettingsItem label="Structured output">
						<Button
							size="small"
							variant="text"
							endIcon={<EditIcon />}
							sx={{ textTransform: "none" }}
						>
							Edit
						</Button>
					</SettingsItem>
					<SettingsItem label="Code execution">
						<Button
							size="small"
							variant="text"
							endIcon={<EditIcon />}
							sx={{ textTransform: "none" }}
						>
							Edit
						</Button>
					</SettingsItem>
					<SettingsItem label="Function calling">
						<Button
							size="small"
							variant="text"
							endIcon={<EditIcon />}
							sx={{ textTransform: "none" }}
						>
							Edit
						</Button>
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

					<Accordion
						disableGutters
						elevation={0}
						sx={{
							bgcolor: "transparent",
							"&:before": { display: "none" },
						}}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							sx={{
								p: 0,
								minHeight: "auto",
								"& .MuiAccordionSummary-content": { m: 0 },
							}}
						>
							<Typography variant="body2">
								Advanced settings
							</Typography>
						</AccordionSummary>
						<AccordionDetails sx={{ p: 0, pt: 1 }}>
							<Typography variant="body2" color="text.secondary">
								Advanced options like safety settings can be
								configured here.
							</Typography>
						</AccordionDetails>
					</Accordion>
				</Grid>
			</Grid>
		</Box>
	);
}
