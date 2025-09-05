// src/mockJobs.js

export const mockJobs = [
	{
		id: 1,
		postedAgo: "22 minutes ago",
		tags: ["Be an early applicant", "2 former colleagues work here"],
		company: {
			name: "JRD Systems",
			logo: "https://via.placeholder.com/150/FFC107/000000?Text=JRD", // Placeholder URL
		},
		title: "Senior Java Developer",
		details: {
			location: "Downey, CA",
			isRemote: true,
			type: "Contract",
			level: "Senior Level",
			experience: "7+ years exp",
			salary: null,
		},
		applicants: {
			count: 24,
			text: "Less than 25 applicants",
		},
	},
	{
		id: 2,
		postedAgo: "3 hours ago",
		tags: [],
		company: {
			name: "Jobgether",
			logo: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=G", // Placeholder URL
		},
		title: "Frontend Engineer (Remote - US)",
		details: {
			location: "United States",
			isRemote: true,
			type: "Full-time",
			level: "Mid Level",
			experience: null,
			salary: "$140K/yr - $180K/yr",
		},
		applicants: {
			count: 132,
			text: "132 applicants",
		},
	},
	{
		id: 3,
		postedAgo: "1 day ago",
		tags: ["Actively recruiting"],
		company: {
			name: "Tech Solutions",
			logo: "https://via.placeholder.com/150/2196F3/FFFFFF?Text=TS", // Placeholder URL
		},
		title: "Cloud DevOps Engineer",
		details: {
			location: "Austin, TX",
			isRemote: true,
			type: "Full-time",
			level: "Senior Level",
			experience: "5+ years exp",
			salary: "$150K/yr - $190K/yr",
		},
		applicants: {
			count: 89,
			text: "89 applicants",
		},
	},
];
