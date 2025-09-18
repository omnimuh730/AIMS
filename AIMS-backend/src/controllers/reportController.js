import { jobsCollection } from '../db/mongo.js';
import { JobSource } from '../../../configs/pub.js';

// Helper function to generate source regexes
const getSourceRegex = (sourceName) => {
	if (sourceName === 'LinkedIn') return /linkedin/i;
	if (sourceName === 'Indeed') return /indeed/i;
	if (sourceName === 'MyWorkdayJobs') return /myworkdayjobs/i;
	if (sourceName === 'Greenhouse') return /greenhouse/i;
	if (sourceName === 'Lever') return /lever/i;
	return null;
};

export async function getPostingVelocity(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const now = new Date();
        const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

        const data = await jobsCollection.aggregate([
            {
                $match: {
                    postedAt: { $gte: fortyEightHoursAgo.toISOString() }
                }
            },
            {
                $project: {
                    postedAt: { $toDate: '$postedAt' },
                    seniority: '$details.seniority'
                }
            },
            {
                $group: {
                    _id: {
                        hour: { $hour: '$postedAt' },
                        day: { $dayOfYear: '$postedAt' },
                        seniority: '$seniority'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: {
                        hour: '$_id.hour',
                        day: '$_id.day'
                    },
                    seniorityBreakdown: {
                        $push: {
                            seniority: '$_id.seniority',
                            count: '$count'
                        }
                    },
                    total: { $sum: '$count' }
                }
            }
        ]).toArray();

        res.json({ success: true, data });
    } catch (err) {
        console.error('GET /api/jobs/posting-velocity error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getPostingCadence(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const data = await jobsCollection.aggregate([
            {
                $match: {
                    postedAt: { $gte: thirtyDaysAgo.toISOString() }
                }
            },
            {
                $project: {
                    postedAt: { $toDate: '$postedAt' }
                }
            },
            {
                $group: {
                    _id: {
                        dayOfWeek: { $dayOfWeek: '$postedAt' },
                        hourOfDay: { $hour: '$postedAt' }
                    },
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        res.json({ success: true, data });
    } catch (err) {
        console.error('GET /api/jobs/posting-cadence error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getJobStats(req, res) {
	try {
		if (!jobsCollection) {
			return res.status(503).json({ success: false, error: 'Database not ready' });
		}

		const { time_zone } = req.query;

		const dailyStats = await jobsCollection.aggregate([
			{
				$project: {
					postedAt: {
						$dateToString: {
							format: '%Y-%m-%d',
							date: { $toDate: '$postedAt' },
							timezone: time_zone || 'America/New_York',
						}
					},
					source: {
						$switch: {
							branches: [
								...JobSource.filter(s => s !== 'Other').map(sourceName => ({
									case: { $regexMatch: { input: '$applyLink', regex: getSourceRegex(sourceName) } },
									then: sourceName
								})),
								{ case: true, then: 'Other' } // Default case
							],
						}
					}
				}
			},
			{
				$group: {
					_id: {
							date: '$postedAt',
							source: '$source'
					},
					count: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: '$_id.date',
					sources: {
						$push: {
							source: '$_id.source',
								count: '$count'
						}
					},
				total: { $sum: '$count' }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]).toArray();

		const appliedStats = await jobsCollection.aggregate([
			{
				$unwind: '$applied'
			},
			{
				$project: {
					appliedDate: {
						$dateToString: {
							format: '%Y-%m-%d',
							date: { $toDate: '$applied.appliedDate' },
							timezone: time_zone || 'America/New_York',
						}
					}
				}
			},
			{
				$group: {
					_id: '$appliedDate',
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]).toArray();

		res.json({ success: true, dailyStats, appliedStats });
	} catch (err) {
		console.error('GET /api/jobs/stats error', err);
		res.status(500).json({ success: false, error: err.message });
	}
}

export async function getJobKpis(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const totalApplications = await jobsCollection.countDocuments({ 'applied.0': { $exists: true } });

        const activeApplications = await jobsCollection.countDocuments({
            'applied.status': { $in: ['Applied', 'Interview'] }
        });

        const interviewJobs = await jobsCollection.countDocuments({
            'applied.status': 'Interview'
        });

        const interviewRate = totalApplications > 0 ? (interviewJobs / totalApplications) * 100 : 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentApplications = await jobsCollection.countDocuments({
            'applied.appliedDate': { $gte: sevenDaysAgo.toISOString() }
        });

        const applicationVelocity = recentApplications; // Applications in the last 7 days

        res.json({ 
            kpis: { 
                totalApplications, 
                activeApplications, 
                interviewRate, 
                applicationVelocity 
            }
        });
    } catch (err) {
        console.error('GET /api/jobs/kpis error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getJobSankey(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const data = await jobsCollection.aggregate([
            {
                $match: { 'applied.0': { $exists: true } }
            },
            {
                $unwind: '$applied'
            },
            {
                $project: {
                    source: {
                        $switch: {
                            branches: [
                                ...JobSource.filter(s => s !== 'Other').map(sourceName => ({
                                    case: { $regexMatch: { input: '$applyLink', regex: getSourceRegex(sourceName) } },
                                    then: sourceName
                                })),
                                { case: true, then: 'Other' } // Default case
                            ],
                        }
                    },
                    company: '$company.name',
                    status: '$applied.status'
                }
            },
            {
                $group: {
                    _id: {
                        source: '$source',
                        company: '$company',
                        status: '$status'
                    },
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        const nodes = [];
        const links = [];
        const nodeMap = new Map();

        function addNode(name) {
            if (!nodeMap.has(name)) {
                nodeMap.set(name, nodes.length);
                nodes.push({ id: name });
            }
            return nodeMap.get(name);
        }

        data.forEach(item => {
            const sourceIndex = addNode(item._id.source);
            const companyIndex = addNode(item._id.company);
            const statusIndex = addNode(item._id.status);

            links.push({ source: sourceIndex, target: companyIndex, value: item.count });
            links.push({ source: companyIndex, target: statusIndex, value: item.count });
        });

        res.json({ data: { nodes, links } });
    } catch (err) {
        console.error('GET /api/jobs/sankey error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getCompanyFocus(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const data = await jobsCollection.aggregate([
            {
                $match: { 'applied.0': { $exists: true } }
            },
            {
                $group: {
                    _id: '$company.name',
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: '$_id',
                    size: '$value',
                    _id: 0
                }
            }
        ]).toArray();

        res.json({ data });
    } catch (err) {
        console.error('GET /api/jobs/company-focus error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getTargetedSkills(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const data = await jobsCollection.aggregate([
            {
                $match: { 'applied.0': { $exists: true } }
            },
            {
                $unwind: '$skills'
            },
            {
                $group: {
                    _id: '$skills',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 20
            },
            {
                $project: {
                    skill: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]).toArray();

        res.json({ data });
    } catch (err) {
        console.error('GET /api/jobs/targeted-skills error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getJobTitleBreakdown(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const data = await jobsCollection.aggregate([
            {
                $match: { 'applied.0': { $exists: true } }
            },
            {
                $group: {
                    _id: {
                        title: '$title',
                        seniority: '$details.seniority'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.title',
                    seniorityBreakdown: {
                        $push: {
                            seniority: '$_id.seniority',
                            count: '$count'
                        }
                    },
                    total: { $sum: '$count' }
                }
            },
            {
                $sort: { total: -1 }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    title: '$_id',
                    seniorityBreakdown: 1,
                    total: 1,
                    _id: 0
                }
            }
        ]).toArray();

        res.json({ data });
    } catch (err) {
        console.error('GET /api/jobs/job-title-breakdown error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getApplicationRhythm(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const data = await jobsCollection.aggregate([
            {
                $match: { 'applied.0': { $exists: true } }
            },
            {
                $unwind: '$applied'
            },
            {
                $project: {
                    appliedDate: { $toDate: '$applied.appliedDate' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$appliedDate' } },
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    day: '$_id',
                    value: 1,
                    _id: 0
                }
            }
        ]).toArray();

        res.json({ data });
    } catch (err) {
        console.error('GET /api/jobs/application-rhythm error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getJobSpaceData(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const data = await jobsCollection.find(
            { 'applied.0': { $exists: true } },
            {
                projection: {
                    title: 1,
                    skills: 1,
                    applied: 1,
                    company: 1,
                    applyLink: 1
                }
            }
        ).toArray();

        res.json({ data });
    } catch (err) {
        console.error('GET /api/jobs/job-space error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getSkillProfileAlignment(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const appliedSkills = await jobsCollection.aggregate([
            { $match: { 'applied.status': 'Applied' } },
            { $unwind: '$skills' },
            { $group: { _id: '$skills', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { skill: '$_id', count: 1, _id: 0 } }
        ]).toArray();

        const interviewSkills = await jobsCollection.aggregate([
            { $match: { 'applied.status': 'Interview' } },
            { $unwind: '$skills' },
            { $group: { _id: '$skills', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { skill: '$_id', count: 1, _id: 0 } }
        ]).toArray();

        const allSkills = [...new Set([...appliedSkills.map(s => s.skill), ...interviewSkills.map(s => s.skill)])];

        const data = allSkills.map(skill => ({
            skill,
            applied: appliedSkills.find(s => s.skill === skill)?.count || 0,
            interview: interviewSkills.find(s => s.skill === skill)?.count || 0
        }));

        res.json({ data });
    } catch (err) {
        console.error('GET /api/jobs/skill-profile-alignment error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getSkillSynergy(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const topSkills = await jobsCollection.aggregate([
            { $unwind: '$skills' },
            { $group: { _id: '$skills', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 },
            { $project: { _id: 0, skill: '$_id' } }
        ]).toArray();

        const skillNames = topSkills.map(s => s.skill);

        const jobsWithSkills = await jobsCollection.find(
            { skills: { $in: skillNames } },
            { projection: { skills: 1 } }
        ).toArray();

        const coOccurrence = {};
        for (const skill1 of skillNames) {
            coOccurrence[skill1] = {};
            for (const skill2 of skillNames) {
                coOccurrence[skill1][skill2] = 0;
            }
        }

        for (const job of jobsWithSkills) {
            for (let i = 0; i < job.skills.length; i++) {
                for (let j = i; j < job.skills.length; j++) {
                    const skill1 = job.skills[i];
                    const skill2 = job.skills[j];
                    if (skillNames.includes(skill1) && skillNames.includes(skill2)) {
                        if (i === j) {
                            coOccurrence[skill1][skill2]++;
                        } else {
                            coOccurrence[skill1][skill2]++;
                            coOccurrence[skill2][skill1]++;
                        }
                    }
                }
            }
        }

        const data = [];
        for (const skill1 of skillNames) {
            const row = { id: skill1 };
            for (const skill2 of skillNames) {
                row[skill2] = coOccurrence[skill1][skill2];
            }
            data.push(row);
        }

        res.json({ data: { data, keys: skillNames } });
    } catch (err) {
        console.error('GET /api/jobs/skill-synergy error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getApplicationResponseLatency(req, res) {
    try {
        if (!jobsCollection) {
            return res.status(503).json({ success: false, error: 'Database not ready' });
        }

        const data = await jobsCollection.aggregate([
            {
                $match: { 'applied.0': { $exists: true } }
            },
            {
                $unwind: '$applied'
            },
            {
                $project: {
                    appliedDate: { $toDate: '$applied.appliedDate' },
                    firstResponseDate: {
                        $ifNull: [
                            { $min: '$applied.statusHistory.date' },
                            null
                        ]
                    },
                    source: {
                        $switch: {
                            branches: [
                                ...JobSource.filter(s => s !== 'Other').map(sourceName => ({
                                    case: { $regexMatch: { input: '$applyLink', regex: getSourceRegex(sourceName) } },
                                    then: sourceName
                                })),
                                { case: true, then: 'Other' } // Default case
                            ],
                        }
                    }
                }
            },
            {
                $project: {
                    latency: {
                        $divide: [
                            { $subtract: [{ $toDate: '$firstResponseDate' }, '$appliedDate'] },
                            1000 * 60 * 60 * 24 // Convert to days
                        ]
                    },
                    source: 1
                }
            },
            {
                $group: {
                    _id: '$source',
                    latencies: { $push: '$latency' }
                }
            },
            {
                $project: {
                    source: '$_id',
                    latencies: 1,
                    _id: 0
                }
            }
        ]).toArray();

        res.json({ data });
    } catch (err) {
        console.error('GET /api/jobs/response-latency error', err);
        res.status(500).json({ success: false, error: err.message });
    }
}