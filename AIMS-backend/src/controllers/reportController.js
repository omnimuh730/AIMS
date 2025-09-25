import { jobsCollection } from "../db/mongo.js";
import { JobSource } from '../../../configs/pub.js'; // <-- Import JobSource list

export async function getDailyApplications(req, res) {
	try {
		if (!jobsCollection) {
			return res.status(503).json({ success: false, error: "Database not ready" });
		}

		const dailyApplications = await jobsCollection.aggregate([
			{
				$unwind: "$status"
			},
			{
				$match: {
					"status.appliedDate": { $exists: true }
				}
			},
			{
				$project: {
					date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$status.appliedDate" } } }
				}
			},
			{
				$group: {
					_id: "$date",
					value: { $sum: 1 }
				}
			},
			{
				$project: {
					_id: 0,
					date: "$_id",
					value: 1
				}
			},
			{
				$sort: {
					date: 1
				}
			}
		]).toArray();

		res.json({ success: true, data: dailyApplications });
	} catch (err) {
		console.error('GET /api/reports/daily-applications error', err);
		res.status(500).json({ success: false, error: err.message });
	}
}

export async function getJobSources(req, res) {
	try {
		if (!jobsCollection) {
			return res.status(503).json({ success: false, error: "Database not ready" });
		}

		// Dynamically build the branches for the $switch operator from the pub.js config
		const sourceBranches = JobSource.map(source => ({
			case: { $regexMatch: { input: "$applyLink", regex: source, options: "i" } },
			then: source
		}));

		const jobSources = await jobsCollection.aggregate([
			// Stage 1: Add a new field 'derivedSource' to each document.
			// Use $switch to categorize based on the 'applyLink' URL.
			{
				$addFields: {
					derivedSource: {
						$switch: {
							branches: sourceBranches,
							default: "Other" // If no known source matches, categorize as 'Other'
						}
					}
				}
			},
			// Stage 2: Group by the new 'derivedSource' field and count the documents in each group.
			{
				$group: {
					_id: "$derivedSource",
					value: { $sum: 1 }
				}
			},
			// Stage 3: Reshape the output to match the format expected by the frontend.
			{
				$project: {
					_id: 0,
					source: "$_id",
					value: 1
				}
			}
		]).toArray();

		// The frontend already handles filling in sources with 0 counts,
		// so we don't need to add that logic here. We only return sources that exist in the DB.

		res.json({ success: true, data: jobSources });
	} catch (err) {
		console.error('GET /api/reports/job-sources error', err);
		res.status(500).json({ success: false, error: err.message });
	}
}

export async function getJobSourceSummary(req, res) {
	try {
		if (!jobsCollection) {
			return res.status(503).json({ success: false, error: "Database not ready" });
		}

		const sourceBranches = JobSource.map(source => ({
			case: { $regexMatch: { input: "$applyLink", regex: source, options: "i" } },
			then: source
		}));

		const jobSourceSummary = await jobsCollection.aggregate([
			{
				$addFields: {
					derivedSource: {
						$switch: {
							branches: sourceBranches,
							default: "Other"
						}
					}
				}
			},
			{
				$group: {
					_id: "$derivedSource",
					postings: { $sum: 1 },
					applied: { $sum: { $size: { $ifNull: [ "$status", [] ] } } },
					scheduled: { $sum: { $size: { $filter: { input: { $ifNull: [ "$status", [] ] }, as: "s", cond: { $ifNull: [ "$s.scheduledDate", false ] } } } } },
					declined: { $sum: { $size: { $filter: { input: { $ifNull: [ "$status", [] ] }, as: "s", cond: { $ifNull: [ "$s.declinedDate", false ] } } } } }
				}
			},
			{
				$project: {
					_id: 0,
					source: "$_id",
					postings: 1,
					applied: 1,
					scheduled: 1,
					declined: 1
				}
			}
		]).toArray();

		res.json({ success: true, data: jobSourceSummary });
	} catch (err) {
		console.error('GET /api/reports/job-source-summary error', err);
		res.status(500).json({ success: false, error: err.message });
	}
}

export async function getJobPostingFrequency(req, res) {
	try {
		if (!jobsCollection) {
			return res.status(503).json({ success: false, error: "Database not ready" });
		}

		const { startDate, endDate } = req.query;
		const match = {
			postedAt: {
				$gte: startDate ? new Date(startDate) : new Date(0),
				$lte: endDate ? new Date(endDate) : new Date(),
			}
		};

		const data = await jobsCollection.aggregate([
			{ $match: match },
			{
				$project: {
					date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$postedAt" } } },
					hour: { $hour: { $toDate: "$postedAt" } }
				}
			},
			{
				$group: {
					_id: {
						date: "$date",
						hour: "$hour"
					},
					count: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: "$_id.date",
					hourlyData: {
						$push: {
							hour: "$_id.hour",
							count: "$count"
						}
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]).toArray();

		res.json({ success: true, data });
	} catch (err) {
		console.error('GET /api/reports/job-posting-frequency error', err);
		res.status(500).json({ success: false, error: err.message });
	}
}

export async function getJobApplicationFrequency(req, res) {
	try {
		if (!jobsCollection) {
			return res.status(503).json({ success: false, error: "Database not ready" });
		}

		const { startDate, endDate } = req.query;
		const match = {
			"status.appliedDate": {
				$exists: true,
				$gte: startDate ? new Date(startDate) : new Date(0),
				$lte: endDate ? new Date(endDate) : new Date(),
			}
		};

		const data = await jobsCollection.aggregate([
			{ $unwind: "$status" },
			{ $match: match },
			{
				$project: {
					date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$status.appliedDate" } } },
					hour: { $hour: { $toDate: "$status.appliedDate" } }
				}
			},
			{
				$group: {
					_id: {
						date: "$date",
						hour: "$hour"
					},
					count: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: "$_id.date",
					hourlyData: {
						$push: {
							hour: "$_id.hour",
							count: "$count"
						}
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]).toArray();

		res.json({ success: true, data });
	} catch (err) {
		console.error('GET /api/reports/job-application-frequency error', err);
		res.status(500).json({ success: false, error: err.message });
	}
}
