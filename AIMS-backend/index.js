import express from "express";
import http from "http";

import { Server } from "socket.io";
import dotenv from "dotenv";

import { core_process } from "./core/test.js";
import { SOCKET_PROTOCOL } from "../configs/socket_protocol.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*", // Adjust as needed for production
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on(SOCKET_PROTOCOL.TYPE.CONNECTION, (data) => {
		console.log("Connection event data:", data);
		//Broadcast-reply(amplifying) all messages to all connected clients every receiving - backend works like intermidiate server
		io.emit(SOCKET_PROTOCOL.TYPE.CONNECTION, {
			timestamp: new Date().toISOString(),
			payload: data || {},
		});
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
