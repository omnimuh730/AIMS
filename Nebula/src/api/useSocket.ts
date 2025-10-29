import { useContext } from "react";
import { SocketContext } from "./socket";
import { Socket } from "socket.io-client";

const useSocket = (): Socket => {
	const socket = useContext(SocketContext);
	if (!socket) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return socket;
};

export default useSocket;
