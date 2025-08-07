import useSocket from "../../api/useSocket";
import useNotification from "../../api/useNotification";
import { useState, useCallback, useEffect } from "react";

import { Box, Typography } from "@mui/material";

const BACKEND_URL = "http://localhost:3000"; // Backend server

const TestPage = () => {
	const socket = useSocket();
	const notification = useNotification();
	// const [gmailAuthUrl, setGmailAuthUrl] = useState(null); // Removed unused state
	const [gmailAuthenticated, setGmailAuthenticated] = useState(false);

	// Example: listen for notification event and show snackbar
	useEffect(() => {
		socket.on("notification", (msg) => {
			console.log("Socket notification received:", msg);
			notification.success(`Socket: ${msg}`);
		});
		return () => socket.off("notification");
	}, [socket, notification]);

	// Check for Gmail OAuth2 redirect
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		console.log(params);
		if (params.get("gmail") === "success") {
			console.log("Gmail is already logged in");
			setGmailAuthenticated(true);
		}
	}, []);

	const handleGmailLogin = useCallback(async () => {
		try {
			const res = await fetch(`${BACKEND_URL}/auth-url`);
			const data = await res.json();
			if (data.authUrl) {
				window.location.href = data.authUrl;
			}
		} catch (err) {
			console.error("Failed to get Gmail auth URL", err);
		}
	}, []);

	// Fetch emails after successful auth
	useEffect(() => {
		if (gmailAuthenticated) {
			fetch(`${BACKEND_URL}/emails`)
				.then((res) => res.json())
				.then((data) => {
					console.log("Fetched Gmail emails:", data);
				})
				.catch((err) => {
					console.error("Failed to fetch Gmail emails", err);
				});
		}
	}, [gmailAuthenticated]);

	return (
		<Box>
			<Typography>
				Test Page - Socket notifications will appear as snackbars
			</Typography>
			{!gmailAuthenticated && (
				<Box mt={2}>
					<button onClick={handleGmailLogin}>Login with Gmail</button>
				</Box>
			)}
			{gmailAuthenticated && (
				<Typography mt={2}>
					Gmail authenticated! Check console for emails.
				</Typography>
			)}
		</Box>
	);
};

export default TestPage;
