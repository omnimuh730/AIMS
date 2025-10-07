import { ObjectId } from "mongodb";
import {
	jobsCollection,
	personalInfoCollection,
	companyCategoryCollection,
	skillsCategoryCollection,
	accountInfoCollection
} from "../db/mongo.js";
import { calculateJobScores } from "../../../configs/jobScore.js";
import { JobSource } from '../../../configs/pub.js';

export async function createJob(req, res) {
	try {
		const job = req.body;
		if (!job) return res.status(400).json({ error: 'Missing job in request body' });
		const now = new Date();

		const createdAt = now.toISOString();

		let postedAt = createdAt;
		if (job.postedAgo && typeof job.postedAgo === 'string') {
			const match = job.postedAgo.match(/(\d+)\s+(minute|hour|day)/);
			if (match) {
				const value = parseInt(match[1], 10);
				const unit = match[2];
				const postedDate = new Date(now);
				if (unit === 'minute') {
					postedDate.setMinutes(postedDate.getMinutes() - value);
				} else if (unit === 'hour') {
					postedDate.setHours(postedDate.getHours() - value);
				} else if (unit === 'day') {
					postedDate.setDate(postedDate.getDate() - value);
				}
				postedAt = postedDate.toISOString();
			}
		}

		job._createdAt = createdAt;
		job.postedAt = postedAt;
		job.modelVersion = '1.0.0';

		try {
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
}

export async function getJobs(req, res) {
	try {
		if (!jobsCollection) {
			return res.status(503).json({ success: false, error: 'Database not ready' });
		}

		const { q, sort, page = 1, limit = 10, showLinkedInOnly = 'true', postedAtFrom, jobSources, postedAtTo, applied, status, applierName, ...filters } = req.body;

		// Resolve applier (optional)
		let applierId = null;
		if (applierName && accountInfoCollection) {
			const applierDoc = await accountInfoCollection.findOne({ name: applierName });
			applierId = applierDoc?._id || null;
		}
		let userSkills = [];
		if (sort === 'recommended') {
			if (personalInfoCollection) {
				const docs = await personalInfoCollection.find({}).toArray();
				userSkills = docs.map(d => d.name);
			}
		}

		const query = { $and: [] };

		if (q) {
			query.$and.push({ title: { $regex: q, $options: 'i' } });
		}

		for (const key in filters) {
			if (Object.hasOwnProperty.call(filters, key)) {
				const value = filters[key];
				if (!value) continue;

				if (key === 'company.tags' && typeof value === 'string') {
					const tags = value.split(',').map(s => s.trim()).filter(Boolean);
					if (tags.length) {
						query.$and.push({ [key]: { $all: tags.map(tag => new RegExp(tag, 'i')) } });
					}
				} else if (key === 'details.remote' || key === 'details.time') {
					query.$and.push({ [key]: value });
				} else if (typeof value === 'string') {
					query.$and.push({ [key]: { $regex: value, $options: 'i' } });
				}
			}
		}

		//Check Job source platform
		// Step 1 -> Fetching domain from url like from https://www.walmart.workday.com/1234... -> www.walmart.workday.com
		// Step 2 -> check if fetched domain(www.walmart.workday.com) includes any of the jobSources values(like workday) -> if yes, then match
		// Consieration -> Not just check if the url includes jobsource item, must cut domain located between https:// and next first '/'
		let jobSourceItem = [];
		if (jobSources !== undefined) {
			jobSourceItem = jobSources.split(',');
		} else {
			jobSourceItem = ['Not specified'];
		}

		const knownSources = JobSource;

		// Build regexes
		let selectedKnown = jobSourceItem.filter(src => src !== 'Other');
		let jobSourceQuery = "^https://[^/]*(" + selectedKnown.join('|') + ")\.";
		let knownSourcesRegex = "^https://[^/]*(" + knownSources.join('|') + ")\.";

		//{"applyLink": {"$regex": "https://.*(workday).*"}}

		if (jobSourceItem.includes('Other') && selectedKnown.length > 0) {
			query.$and.push({
				$or: [
					{ applyLink: { $regex: jobSourceQuery, $options: 'i' } },
					{ applyLink: { $not: { $regex: knownSourcesRegex, $options: 'i' } } }
				]
			});
		} else if (jobSourceItem.includes('Other')) {
			query.$and.push({ applyLink: { $not: { $regex: knownSourcesRegex, $options: 'i' } } });
		} else {
			query.$and.push({ applyLink: { $regex: jobSourceQuery, $options: 'i' } });
		}

		// Normalize boolean-like flags that may arrive as booleans or strings
		const appliedBool = applied === true || applied === 'true'
			? true
			: applied === false || applied === 'false'
				? false
				: undefined;

		if (appliedBool === false) {
			// Posted: no status entry for this applier
			if (applierId) {
				query.$and.push({ $or: [{ status: { $exists: false } }, { status: { $not: { $elemMatch: { applier: applierId } } } }] });
			} else {
				// Without applier, fallback to no status at all
				query.$and.push({ status: { $exists: false } });
			}
		} else if (appliedBool === true) {
			// Applied filters for this applier
			if (applierId) {
				if (status === 'Applied') {
					query.$and.push({ status: { $elemMatch: { applier: applierId, appliedDate: { $exists: true }, scheduledDate: { $exists: false }, declinedDate: { $exists: false } } } });
				} else if (status === 'Scheduled') {
					query.$and.push({ status: { $elemMatch: { applier: applierId, scheduledDate: { $exists: true } } } });
				} else if (status === 'Declined') {
					query.$and.push({ status: { $elemMatch: { applier: applierId, declinedDate: { $exists: true } } } });
				} else {
					query.$and.push({ status: { $elemMatch: { applier: applierId } } });
				}
			} else {
				// No applier specified: keep previous behavior
				query.$and.push({ status: { $exists: true } });
				if (status === 'Applied') {
					query.$and.push({ status: { $elemMatch: { appliedDate: { $exists: true }, scheduledDate: { $exists: false }, declinedDate: { $exists: false } } } });
				} else if (status === 'Scheduled') {
					query.$and.push({ status: { $elemMatch: { scheduledDate: { $exists: true } } } });
				} else if (status === 'Declined') {
					query.$and.push({ status: { $elemMatch: { declinedDate: { $exists: true } } } });
				}
			}
		}

		if (postedAtFrom || postedAtTo) {
			const postedAtQuery = {};
			if (postedAtFrom) {
				postedAtQuery.$gte = postedAtFrom;
			}
			if (postedAtTo) {
				const toDate = new Date(postedAtTo);
				toDate.setDate(toDate.getDate() + 1);
				postedAtQuery.$lt = toDate.toISOString().split('T')[0];
			}
			query.$and.push({ postedAt: postedAtQuery });
		}

		if (query.$and.length === 1) {
			Object.assign(query, query.$and[0]);
			delete query.$and;
		} else if (query.$and.length === 0) {
			delete query.$and;
		}

		const pageNum = Math.max(1, parseInt(page, 10) || 1);
		const limitNum = Math.max(1, parseInt(limit, 10) || 10);
		const skip = (pageNum - 1) * limitNum;

		let docs;
		let total = await jobsCollection.countDocuments(query);

		if (sort === 'recommended') {
			docs = await jobsCollection.find(query).toArray();
			docs.forEach(job => {
				job._score = calculateJobScores(job, userSkills).overallScore;
			});
			docs.sort((a, b) => b._score - a._score);
			docs = docs.slice(skip, skip + limitNum);
		} else {
			const sortOption = {};
			if (sort && typeof sort === 'string') {
				let sortField = '', sortOrder;
				[sortField, sortOrder] = sort.split('_');
				if (sortField === 'postedAt') {
					sortOption.postedAt = sortOrder === 'asc' ? 1 : -1;
				} else if (sortField && sortField.trim().length > 0) {
					sortOption[sortField] = sortOrder === 'desc' ? -1 : 1;
				} else {
					sortOption.postedAt = -1;
				}
			} else {
				sortOption.postedAt = -1;
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
}

export async function applyToJob(req, res) {
	try {
		if (!jobsCollection) return res.status(503).json({ success: false, error: 'Database not ready' });
		const { id } = req.params;
		const { applierName = 'Jeffrey Yuan' } = req.body;

		let objectId;
		try {
			objectId = new ObjectId(id);
		} catch {
			return res.status(400).json({ success: false, error: 'Invalid id' });
		}

		const applier = await accountInfoCollection.findOne({ name: applierName });
		if (!applier) {
			return res.status(404).json({ success: false, error: `User ${applierName} not found` });
		}

		const existingApplication = await jobsCollection.findOne({ _id: objectId, "status.applier": applier._id });

		if (existingApplication) {
			return res.json({ success: true, data: existingApplication, message: "User has already applied" });
		}

		const now = new Date().toISOString();
		const newApplication = {
			applier: applier._id,
			appliedDate: now
		};

		const update = {
			$push: {
				status: newApplication
			}
		};

		await jobsCollection.updateOne({ _id: objectId }, update);
		const updatedJob = await jobsCollection.findOne({ _id: objectId });

		return res.json({ success: true, data: updatedJob });
	} catch (err) {
		console.error('POST /api/jobs/:id/apply error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
}

export async function updateJobStatus(req, res) {
	try {
		if (!jobsCollection) return res.status(503).json({ success: false, error: 'Database not ready' });
		const { id } = req.params;
		const { status, applierName = 'Jeffrey Yuan' } = req.body;

		let objectId;
		try {
			objectId = new ObjectId(id);
		} catch {
			return res.status(400).json({ success: false, error: 'Invalid id' });
		}

		const applier = await accountInfoCollection.findOne({ name: applierName });
		if (!applier) {
			return res.status(404).json({ success: false, error: `User ${applierName} not found` });
		}

		const now = new Date().toISOString();
		let update;

		if (status === 'Declined') {
			update = {
				$set: { 'status.$[elem].declinedDate': now },
				$unset: { 'status.$[elem].scheduledDate': "" }
			};
		} else if (status === 'Scheduled') {
			update = {
				$set: { 'status.$[elem].scheduledDate': now },
				$unset: { 'status.$[elem].declinedDate': "" }
			};
		} else if (status === 'Applied') { // This is our "Cancel" action
			update = {
				$unset: {
					'status.$[elem].declinedDate': "",
					'status.$[elem].scheduledDate': ""
				}
			};
		} else {
			return res.status(400).json({ success: false, error: 'Invalid status' });
		}

		const options = {
			arrayFilters: [{ "elem.applier": applier._id }]
		};

		await jobsCollection.updateOne({ _id: objectId }, update, options);
		const updatedJob = await jobsCollection.findOne({ _id: objectId });

		return res.json({ success: true, data: updatedJob });
	} catch (err) {
		console.error('POST /api/jobs/:id/status error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
}

export async function removeJobs(req, res) {
	try {
		if (!jobsCollection) return res.status(503).json({ success: false, error: 'Database not ready' });
		const { ids } = req.body;
		if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ success: false, error: 'Missing ids array' });

		const objectIds = ids.map(id => {
			try {
				return new ObjectId(id);
			} catch {
				return null;
			}
		}).filter(Boolean);

		const result = await jobsCollection.deleteMany({ _id: { $in: objectIds } });
		return res.json({ success: true, deletedCount: result.deletedCount });
	} catch (err) {
		console.error('POST /api/jobs/remove error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
}

export async function unapplyFromJob(req, res) {
	try {
		if (!jobsCollection) return res.status(503).json({ success: false, error: 'Database not ready' });
		const { id } = req.params;
		const { applierName = 'Jeffrey Yuan' } = req.body;

		let objectId;
		try {
			objectId = new ObjectId(id);
		} catch {
			return res.status(400).json({ success: false, error: 'Invalid id' });
		}

		const applier = await accountInfoCollection.findOne({ name: applierName });
		if (!applier) {
			return res.status(404).json({ success: false, error: `User ${applierName} not found` });
		}

		const update = {
			$pull: { status: { applier: applier._id } }
		};

		await jobsCollection.updateOne({ _id: objectId }, update);
		const updatedJob = await jobsCollection.findOne({ _id: objectId });

		return res.json({ success: true, data: updatedJob });
	} catch (err) {
		console.error('POST /api/jobs/:id/unapply error', err);
		return res.status(500).json({ success: false, error: err.message });
	}
}
