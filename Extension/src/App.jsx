import { useState, useEffect } from "react";
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
	Divider,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import useSocket from './api/useSocket';
import useNotification from "./api/useNotification";

import LayoutPage from "./components/layout";

// A list of common HTML tags and attributes for the dropdowns
const commonTags = ["div", "a", "span", "img", "input", "button", "li", "h1", "h2", "p", "form", "section", "header", "footer", "textarea"];
const commonProperties = ["id", "class", "name", "href", "src", "alt", "for", "type", "role", "aria-label", "data-testid"];

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {

	const socket = useSocket();
	const notification = useNotification();

	useEffect(() => {
		socket.on("notification", (msg) => {
			console.log("Socket notification received:", msg);
			notification.success(`Socket: ${msg}`);
		});
		return () => socket.off("notification");
	}, [socket, notification]);

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Container maxWidth="sm" sx={{ py: 2 }}>
				<Box sx={{ textAlign: 'center', mb: 3 }}>
					<LayoutPage />
				</Box>
			</Container>
		</ThemeProvider>
	);
}

// Snackbar/Alert JSX appended near top-level return via fragment or portal. We'll insert it before export by editing the return to include it.


export default App;