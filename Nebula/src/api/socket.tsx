import React, { createContext, useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({
	children,
	url,
}: {
	children: React.ReactNode;
	url: string;
}) => {
	const socketRef = useRef<Socket | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const socket = io(url);
		socketRef.current = socket;
		setReady(true);

		return () => {
			socket.disconnect();
			socketRef.current = null;
			setReady(false);
		};
	}, [url]);

	if (!ready || !socketRef.current) return null;

	return (
		<SocketContext.Provider value={socketRef.current}>
			{children}
		</SocketContext.Provider>
	);
};

export { SocketContext };
