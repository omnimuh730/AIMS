import { jobsCollection } from "../db/mongo.js";

export async function getDailyApplications(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: "Database not ready" });
        }

        const dailyApplications = await jobsCollection.aggregate([
            { $unwind: "$applied" },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$applied.appliedDate" } } }
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
