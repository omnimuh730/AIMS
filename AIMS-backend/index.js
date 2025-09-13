import express from "express";
import http from "http";

import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from 'cors';
import { MongoClient } from "mongodb";

import { SOCKET_PROTOCOL } from "../configs/socket_protocol.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // parse JSON bodies
app.use(cors({ origin: '*' }));

// MongoDB setup
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const mongoDbName = process.env.MONGO_DB || 'AIMS_local';
let mongoClient;
let jobsCollection;

async function initMongo() {
	mongoClient = new MongoClient(mongoUrl);
	await mongoClient.connect();
	const db = mongoClient.db(mongoDbName);
	jobsCollection = db.collection('job_market');
	console.log('Connected to MongoDB', mongoUrl, 'DB:', mongoDbName);
}

initMongo().catch(err => {
	console.error('Failed to connect to MongoDB', err);
});

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

// Simple API to store and retrieve scraped jobs
app.post('/api/jobs', async (req, res) => {
	try {
		const job = req.body;
		if (!job) return res.status(400).json({ error: 'Missing job in request body' });
		const now = new Date();
		job._createdAt = now.toISOString();
		const result = jobsCollection ? await jobsCollection.insertOne(job) : null;
		return res.status(201).json({ success: true, insertedId: result ? result.insertedId : null });
	} catch (err) {
		console.error('POST /api/jobs error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
});

app.get('/api/jobs', async (req, res) => {
	try {
		if (!jobsCollection) {
			return res.status(503).json({ success: false, error: 'Database not ready' });
		}

		const { q, sort, page = 1, limit = 10, ...filters } = req.query;

		// 1. Build Query
		const query = {};

		// Search - limit to title only for performance
		if (q) {
			query.title = { $regex: q, $options: 'i' };
		}

		// Filters - ignore empty keys/values. If a value contains commas treat as $in
		for (const key in filters) {
			let value = filters[key];
			if (!key || value === undefined || value === '') continue;
			// If comma-separated, create an array of trimmed values and remove empties
			if (typeof value === 'string' && value.includes(',')) {
				const arr = value.split(',').map(v => v.trim()).filter(Boolean);
				if (arr.length > 0) {
					// Try to convert numeric strings to numbers
					const converted = arr.map(v => (v !== '' && !isNaN(v) ? Number(v) : v));
					query[key] = { $in: converted };
				}
			} else {
				// single value - trim
				if (typeof value === 'string') value = value.trim();
				if (value !== '') {
					// try convert numeric
					const conv = (typeof value === 'string' && !isNaN(value)) ? Number(value) : value;
					query[key] = conv;
				}
			}
		}

		// 2. Build Sort
		// Build sort option safely: avoid empty field names which cause Mongo errors
		const sortOption = {};
		if (sort && typeof sort === 'string') {
			const [sortField = '', sortOrder] = sort.split('_');
			if (sortField && sortField.trim().length > 0) {
				sortOption[sortField] = sortOrder === 'desc' ? -1 : 1;
			} else {
				// fallback to default if field is empty
				sortOption._createdAt = -1;
			}
		} else {
			sortOption._createdAt = -1; // Default sort
		}

		// 3. Pagination
		const pageNum = Math.max(1, parseInt(page, 10) || 1);
		const limitNum = Math.max(1, parseInt(limit, 10) || 10);
		const skip = (pageNum - 1) * limitNum;

		// Execute query
		const cursor = jobsCollection.find(query).sort(sortOption).skip(skip).limit(limitNum);
		const docs = await cursor.toArray();
		const total = await jobsCollection.countDocuments(query);

		return res.json({
			success: true,
			data: docs,
			pagination: {
				total,
				page: pageNum,
				limit: limitNum,
				totalPages: Math.ceil(total / limitNum),
			}
		});

	} catch (err) {
		console.error('GET /api/jobs error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
});

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
