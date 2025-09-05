import { useState } from "react";
import {
	createTheme,
	ThemeProvider,
	CssBaseline,
	Container,
	Typography,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Stack,
	Tooltip,
	Paper,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// A list of common HTML tags and attributes for the dropdowns
const commonTags = ["div", "a", "span", "img", "input", "button", "li", "h1", "h2", "p", "form", "section", "header", "footer"];
const commonProperties = ["id", "class", "name", "href", "src", "alt", "for", "type", "role", "aria-label", "data-testid"];

// Define a sleek dark theme for the UI
const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {
	// State for the tracking inputs
	const [tag, setTag] = useState("div");
	const [property, setProperty] = useState("class");
	const [pattern, setPattern] = useState("");

	/* global chrome */

	// Function to send the highlight command with specific details
	const handleHighlight = () => {
		if (!pattern) {
			// In a real app, you might show a snackbar notification instead of an alert
			console.warn("Pattern is empty. Highlighting aborted.");
			return;
		}
		chrome.runtime.sendMessage({
			action: "highlightByPattern",
			payload: {
				componentType: tag,
				propertyName: property,
				pattern: pattern,
			},
		});
	};

	// Function to clear all highlights
	const handleClear = () => {
		chrome.runtime.sendMessage({ action: "clearHighlight" });
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Container maxWidth="sm" sx={{ py: 2 }}>
				<Box sx={{ textAlign: 'center', mb: 3 }}>
					<Typography variant="h5" component="h1" gutterBottom>
						Element Tracker
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Select an element and attribute, then enter a pattern to highlight it on the page.
					</Typography>
				</Box>

				<Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
					<Stack spacing={3}>
						<FormControl fullWidth>
							<InputLabel id="tag-select-label">Tag Name</InputLabel>
							<Select
								labelId="tag-select-label"
								id="tag-select"
								value={tag}
								label="Tag Name"
								onChange={(e) => setTag(e.target.value)}
							>
								{commonTags.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel id="prop-select-label">Attribute</InputLabel>
							<Select
								labelId="prop-select-label"
								id="prop-select"
								value={property}
								label="Attribute"
								onChange={(e) => setProperty(e.target.value)}
							>
								{commonProperties.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
							</Select>
						</FormControl>

						<Tooltip 
							title="Use '?' for wildcards. `?text?` contains, `text?` starts-with, `?text` ends-with."
							arrow
						>
							<TextField
								fullWidth
								id="pattern-input"
								label="Pattern"
								variant="outlined"
								value={pattern}
								onChange={(e) => setPattern(e.target.value)}
								placeholder="e.g., user-profile"
							/>
						</Tooltip>
					</Stack>
				</Paper>

				<Stack direction="row" spacing={2} sx={{ mt: 3 }}>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						startIcon={<SearchIcon />}
						onClick={handleHighlight}
						disabled={!pattern}
					>
						Highlight
					</Button>
					<Button
						fullWidth
						variant="outlined"
						color="secondary"
						startIcon={<ClearIcon />}
						onClick={handleClear}
					>
						Clear
					</Button>
				</Stack>
			</Container>
		</ThemeProvider>
	);
}

export default App;