import useSocket from "../../api/useSocket";
import useNotification from "../../api/useNotification";
import { useEffect } from "react";

import {
	Box,
	Typography
} from '@mui/material'

const TestPage = () => {
	const socket = useSocket();
	const notification = useNotification();
	
	// Example: listen for notification event and show snackbar
	useEffect(() => {
		socket.on('notification', (msg) => {
			console.log('Socket notification received:', msg);
			notification.success(`Socket: ${msg}`);
		});
		return () => socket.off('notification');
	}, [socket, notification]);

	return (
		<Box>
			<Typography>Test Page - Socket notifications will appear as snackbars</Typography>
		</Box>
	)
}

export default TestPage;