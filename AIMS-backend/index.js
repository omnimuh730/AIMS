import express from "express";
import http from "http";

import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from 'cors';
import { MongoClient } from "mongodb";

import { SOCKET_PROTOCOL } from "../configs/socket_protocol.js";
import { calculateJobScores } from "../configs/jobScore.js";

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
let companyCategoryCollection;
let skillsCategoryCollection;
let personalInfoCollection;

async function initMongo() {
	mongoClient = new MongoClient(mongoUrl);
	await mongoClient.connect();
	const db = mongoClient.db(mongoDbName);
	jobsCollection = db.collection('job_market');
	companyCategoryCollection = db.collection('company_category');
	skillsCategoryCollection = db.collection('skills_category');
	personalInfoCollection = db.collection('personal_info');
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

/* Example job document
{
	"applyLink": "https://jobs.lever.co/pano/a1769b96-d7e3-4a8e-a902-32944191af88/apply?utm_source=jobright",
		"id": 1757740788386,
			"postedAgo": "4 hours ago",
				"tags": [
					"29 applicants"
				],
					"company": {
		"name": "Pano AI",
			"tags": [
				"Artificial Intelligence (AI)",
				"Hardware",
				"Public Safety",
				"Software"
			]
	},
	"title": "Senior Software Engineer - Backend",
		"details": {
		"position": "San Francisco, California",
			"time": "Full-time",
				"remote": "Remote",
					"seniority": "Senior Level",
						"money": "$150K/yr - $202K/yr",
							"date": "5+ years exp"
	},
	"applicants": {
		"count": 29,
			"text": "29 applicants"
	},
	"description": "Responsibilities\nWork with your teammates to build highly scalable solutions that enable positive impact for our users and our business\nDevelop new features as well as tools, frameworks, and workflows in support of rapidly emerging business and project requirements\nDrive new projects, from conceptualization to deployment\nEnsure application performance, uptime, and scale, and maintain high standards for code quality, maintainability, security, and application design\nWork with agile development methodologies, adhering to best practices and pursuing continued learning opportunities\nParticipate in on-call rotation to respond to, triage, mitigate, and resolve production issues\nCreate run-books, metrics, and dashboards\n\nQualification\nRepresents the skills you have\n\nFind out how your skills align with this job's requirements. If anything seems off, you can easily click on the tags to select or unselect skills to reflect your actual expertise.\n\nJava\nPython\nSQL\nPostgreSQL\nSpring\nDjango\nGCP\nAWS\nDocker\nKubernetes\nRedis\nMemcached\nVarnish\nGit\nCI/CD\nSOC2\nISO 27001\nRequired\n5+ years of hands-on experience as a backend Software Engineer\n3+ years of professional experience in a fast-paced SaaS or a similar business environment\nExperience with server-side Java and Python software development, with modern frameworks and methodologies, such as Spring and Django\nProficiency with SQL, RDBMS (ideally PostgreSQL), and familiarity with ORMs\nAbility to visualize a proposed system and be able to build it\nProven ability to troubleshoot and resolve technical issues in complex systems\nAbility to communicate effectively within the team and across the organization while sharing insights and updates and collaborating to achieve project goals\nMust be located in the Pacific or Mountain time zone\nPreferred\nHands-on experience with cloud platforms, such as GCP and AWS\nFamiliarity working with Linux-based systems as well as containerization and orchestration tools, such as Docker and Kubernetes\nFamiliarity with caching mechanisms such as Redis, Memcached, and Varnish\nFamiliarity with common DevOps tools and practices, such as Git and CI/CD\nFamiliarity with SOC2 / ISO 27001 security frameworks\n\nBenefits\nStock options\nComprehensive health insurance\nPaid time off\n401k",
		"skills": [
			"Java",
			"Python",
			"SQL",
			"PostgreSQL",
			"Spring",
			"Django",
			"GCP",
			"AWS",
			"Docker",
			"Kubernetes",
			"Redis",
			"Memcached",
			"Varnish",
			"Git",
			"CI/CD",
			"SOC2",
			"ISO 27001"
		],
			"_createdAt": "2025-09-13T05:19:48.447Z",
				"postedAt": "2025-09-13T01:19:48.447Z"
}
*/

// Simple API to store and retrieve scraped jobs
app.post('/api/jobs', async (req, res) => {
	try {
		const job = req.body;
		if (!job) return res.status(400).json({ error: 'Missing job in request body' });
		const now = new Date();

		// We have to set both of postedAt and createdAt(now)
		// Need to add postedAt field
		// This field is used for sorting and filtering on frontend
		// PostedAt is current time(cretedAt) - postedAgo
		// Postedago (x minutes ago, x hours ago, x days ago)
		// So if postedago includes 'minute'(not minutes), subtract that many minutes from now
		// If 'hour' (not hours), subtract that many hours
		// If 'day' (not days), subtract that many days
		const createdAt = now.toISOString();

		// How to get postedAt from postedAgo and createdAt
		let postedAt = createdAt;
		if (job.postedAgo && typeof job.postedAgo === 'string') {
			const match = job.postedAgo.match(/(\d+)\s+(minute|hour|day)/);
			if (match) {
				const value = parseInt(match[1], 10);
				const unit = match[2];
				const postedDate = new Date(now);
				if (unit === 'minute') {
					postedDate.setMinutes(postedDate.getMinutes() - value);
				}
				else if (unit === 'hour') {
					postedDate.setHours(postedDate.getHours() - value);
				}
				else if (unit === 'day') {
					postedDate.setDate(postedDate.getDate() - value);
				}
				postedAt = postedDate.toISOString();
			}
		}

		job._createdAt = createdAt;
		job.postedAt = postedAt;

		// Before inserting job, upsert company tags and skills into categories
		try {
			// company tags
			const companyTags = Array.isArray(job.company?.tags) ? job.company.tags.map(t => String(t).trim()).filter(Boolean) : [];
			if (companyCategoryCollection && companyTags.length) {
				const ops = companyTags.map(tag => ({
					updateOne: {
						filter: { name: tag },
						update: { $setOnInsert: { name: tag, createdAt: new Date().toISOString() } },
						upsert: true,
					}
				}));
				await companyCategoryCollection.bulkWrite(ops, { ordered: false });
			}

			// skills
			const skills = Array.isArray(job.skills) ? job.skills.map(s => String(s).trim()).filter(Boolean) : [];
			if (skillsCategoryCollection && skills.length) {
				const ops = skills.map(skill => ({
					updateOne: {
						filter: { name: skill },
						update: { $setOnInsert: { name: skill, createdAt: new Date().toISOString() } },
						upsert: true,
					}
				}));
				await skillsCategoryCollection.bulkWrite(ops, { ordered: false });
			}
		} catch (e) {
			console.warn('Failed to upsert categories', e);
		}

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
		// For recommended sort, userSkills comes from query param (comma separated)
		let userSkills = [];
		if (req.query.userSkills) {
			userSkills = Array.isArray(req.query.userSkills) ? req.query.userSkills : String(req.query.userSkills).split(',').map(s => s.trim()).filter(Boolean);
		}

		// 1. Build Query
		const query = {};

		// Search - limit to title only for performance
		if (q) {
			query.title = { $regex: q, $options: 'i' };
		}

		// Filters - ignore empty keys/values. If a value contains commas treat as $in
		/*
		for (const key in filters) {
			if (key === 'skill' || key === 'skills' || key === 'skillset' || key === 'skill_set') continue; // Ignore skill filters
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
			*/

		// 2. Build Sort
		const pageNum = Math.max(1, parseInt(page, 10) || 1);
		const limitNum = Math.max(1, parseInt(limit, 10) || 10);
		const skip = (pageNum - 1) * limitNum;

		let docs;
		let total = await jobsCollection.countDocuments(query);

		if (sort === 'recommended') {
			if (userSkills && userSkills.length > 0) {
				// Fetch all matching jobs, score and sort by overallScore
				docs = await jobsCollection.find(query).toArray();
				docs.forEach(job => {
					job._score = calculateJobScores(job, userSkills).overallScore;
				});
				docs.sort((a, b) => b._score - a._score);
				docs = docs.slice(skip, skip + limitNum);
			} else {
				// Fallback to default sort if no userSkills
				const sortOption = { _createdAt: -1 };
				docs = await jobsCollection.find(query).sort(sortOption).skip(skip).limit(limitNum).toArray();
			}
		} else {
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
			docs = await jobsCollection.find(query).sort(sortOption).skip(skip).limit(limitNum).toArray();
		}

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

// Personal info endpoints - manage user's saved skills
// GET - returns array of saved skill names
app.get('/api/personal/skills', async (req, res) => {
	try {
		if (!personalInfoCollection) return res.status(503).json({ success: false, error: 'Database not ready' });
		const docs = await personalInfoCollection.find({}).toArray();
		// return only names
		const skills = docs.map(d => d.name);
		return res.json({ success: true, skills });
	} catch (err) {
		console.error('GET /api/personal/skills error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
});

// POST - add a skill (upsert)
app.post('/api/personal/skills', async (req, res) => {
	try {
		if (!personalInfoCollection) return res.status(503).json({ success: false, error: 'Database not ready' });
		const { skill } = req.body;
		if (!skill || typeof skill !== 'string') return res.status(400).json({ success: false, error: 'Missing skill string in body' });
		const name = skill.trim();
		if (!name) return res.status(400).json({ success: false, error: 'Empty skill' });
		await personalInfoCollection.updateOne({ name }, { $setOnInsert: { name, createdAt: new Date().toISOString() } }, { upsert: true });
		const docs = await personalInfoCollection.find({}).toArray();
		return res.json({ success: true, skills: docs.map(d => d.name) });
	} catch (err) {
		console.error('POST /api/personal/skills error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
});

// DELETE - remove a skill
app.delete('/api/personal/skills', async (req, res) => {
	try {
		if (!personalInfoCollection) return res.status(503).json({ success: false, error: 'Database not ready' });
		const { skill } = req.body;
		if (!skill || typeof skill !== 'string') return res.status(400).json({ success: false, error: 'Missing skill string in body' });
		const name = skill.trim();
		if (!name) return res.status(400).json({ success: false, error: 'Empty skill' });
		await personalInfoCollection.deleteOne({ name });
		const docs = await personalInfoCollection.find({}).toArray();
		return res.json({ success: true, skills: docs.map(d => d.name) });
	} catch (err) {
		console.error('DELETE /api/personal/skills error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
});

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
