import React, { createContext, useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useNotification from "./useNotification";

const SocketContext = createContext(null);

export const SocketProvider = ({
	children,
	url,
}) => {
	const socketRef = useRef(null);
	const [ready, setReady] = useState(false);
	const notification = useNotification();

	useEffect(() => {
		const socket = io(url, {
			reconnectionAttempts: 5,
			reconnectionDelay: 5000,
		});
		socketRef.current = socket;

		socket.on("connect", () => {
			setReady(true);
			notification.success("Socket connected successfully");
		});

		socket.on("connect_error", (err) => {
			setReady(false);
			notification.error(`Socket connection failed: ${err.message}`);
		});

		return () => {
			socket.disconnect();
			socketRef.current = null;
			setReady(false);
		};
	}, [url, notification]);

	if (!ready || !socketRef.current) return null;

	return (
		<SocketContext.Provider value={socketRef.current}>
			{children}
		</SocketContext.Provider>
	);
};

export { SocketContext };
