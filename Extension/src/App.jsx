import { useEffect } from "react";
import {
	createTheme,
	ThemeProvider,
	CssBaseline,
	Container,
	Box,
} from "@mui/material";
import useSocket from './api/useSocket';
import useNotification from "./api/useNotification";

import LayoutPage from "./components/layout";


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