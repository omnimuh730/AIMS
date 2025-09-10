import React, { useEffect } from "react";
import JobListingsPage from "./JobListingsPage";
import { Button } from "@mui/material";

import useSocket from "../../api/useSocket";
import useNotification from "../../api/useNotification";

const LEVEL_ONE = 1;
const LEVEL_TWO = 2;
const POS_AUTOMATION = "automation";

// You can also add ThemeProviders, Routers, etc. here in a real app
function AutomationPage() {
	// Call the hook to get the socket instance
	const socket = useSocket();

	// Call the notification hook at top level (HOOKS must be called at top-level)
	const notification = useNotification();

	useEffect(() => {
		if (socket) {
			const handleNotification = (message) => {
				// Use the notification object returned by the hook
				// If server sends objects, try to stringify/parse as needed
				try {
					// If message is JSON string, parse to object then show property; otherwise show message
					const parsed =
						typeof message === "string" && message.trim().startsWith("{")
							? JSON.parse(message)
							: message;
					// Show a simple info notification; adapt to your needs
					notification.info(
						typeof parsed === "string" ? parsed : JSON.stringify(parsed)
					);
				} catch (err) {
					// Fallback to raw message if parsing fails
					notification.info(String(message));
				}
			};

			// Listen for generic server notifications...
			socket.on("notification", handleNotification);

			// ...and also listen for the automation channel the backend emits when
			// the `order` event arrives (backend uses data.Position as the event name).
			socket.on(POS_AUTOMATION, handleNotification);

			// Cleanup on unmount
			return () => {
				socket.off("notification", handleNotification);
				socket.off(POS_AUTOMATION, handleNotification);
			};
		}
	}, [socket, notification]);

	const OpenDetails = () => {
		if (socket && typeof socket.emit === "function") {
			socket.emit("order", {
				Level: LEVEL_ONE,
				Position: POS_AUTOMATION,
				Message: "Open Details button clicked",
			});
		} else {
			console.warn("Socket not ready - cannot emit 'order' event");
		}
	};

	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				style={{ margin: 16 }}
				onClick={OpenDetails}
			>
				Open Details
			</Button>
			<Button variant="contained" color="primary" style={{ margin: 16 }}>
				Fetch Information
			</Button>
			<Button variant="contained" color="primary" style={{ margin: 16 }}>
				Remove from List
			</Button>
			<JobListingsPage />
		</div>
	);
}

export default AutomationPage;