import express from "express";
import http from "http";

import { Server } from "socket.io";
import dotenv from "dotenv";

import { core_process } from "./core/test.js";

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
	socket.emit("notification", "Welcome to the Socket.IO server!");

	socket.on("test-event", async (data) => {
		console.log("Received test-event with data:");
		socket.emit("notification", `Server received your data`);

		const json_Parsed = JSON.parse(data);
		const system_Prompt = json_Parsed.systemInstruction;
		const user_Prompt = json_Parsed.userInput;
		const result = await core_process(system_Prompt, user_Prompt);

		socket.emit("bid-plan", result);
		console.log("Processed result was returned");
	});

	socket.on("order", (data) => {
		console.log("Order event received from client:", socket.id);
		console.log(data);
		// Notify sender that order was received
		socket.emit(data.Position, "Order event received. Processing...");

		// Broadcast to any connected extension clients
		// Use a dedicated event name so extension background can listen for it
		io.emit("to-extension", { fromSocketId: socket.id, order: data });
	});

	// Handle messages coming from extension clients
	// Extensions should emit 'from-extension' with a payload containing { position, payload }
	// The backend will forward that to frontend clients by emitting to the `position` event
	socket.on("from-extension", (msg) => {
		try {
			console.log("Received from-extension:", msg);
			const position = msg.position || msg.Position || "automation";
			// Emit to all connected frontend clients listening on this position/event
			io.emit(position, msg.payload || msg);
		} catch (err) {
			console.error("Error handling from-extension message:", err);
		}
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
