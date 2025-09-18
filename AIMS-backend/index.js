import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from 'cors';

import { initMongo } from "./src/db/mongo.js";
import { setupWebSocket } from "./src/websocket/handler.js";
import { setSocketIO } from "./src/controllers/openTabsController.js";

import openTabsRoutes from "./src/routes/openTabsRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import personalInfoRoutes from "./src/routes/personalInfoRoutes.js";
import skillCategoryRoutes from "./src/routes/skillCategoryRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: '*' }));

initMongo().catch(err => {
	console.error('Failed to connect to MongoDB', err);
	process.exit(1);
});

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

setupWebSocket(io);
setSocketIO(io); // Pass the io instance to the controller

// Setup routes
app.use('/api', openTabsRoutes);
app.use('/api', jobRoutes);
app.use('/api', personalInfoRoutes);
app.use('/api', skillCategoryRoutes);
import reportRoutes from "./src/routes/reportRoutes.js";
app.use('/api/jobs', reportRoutes);

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});