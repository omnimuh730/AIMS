import React, { useMemo } from "react";

// MUI Imports
import {
	Card,
	CardContent,
	Typography,
	Grid,
	Avatar,
	Stack,
	Chip,
	Button,
	IconButton,
	Divider,
	Box,
	Paper,
	CircularProgress
} from "@mui/material";

import {
	Check,
	LinkedIn
} from '@mui/icons-material';

// MUI Icon Imports
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BlockIcon from "@mui/icons-material/Block";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { styled } from '@mui/material/styles';

// Internal Component Import
import DetailItem from "./DetailItem";

// --- Sub-Components (Internal to JobCard) ---
const JobCardHeader = ({ company, postedAgo, tags }) => (
	<Box sx={{ display: "flex", alignItems: "start", mb: 1.5 }}>
		<Avatar
			src={company.logo || undefined}
			alt={`${company.name} logo`}
			variant="rounded"
			sx={{ width: 56, height: 56, mr: 2 }}
		>
			{!company.logo && company.name ? String(company.name).charAt(0).toUpperCase() : null}
		</Avatar>
		<Box sx={{ flexGrow: 1 }}>
			<Stack
				direction="row"
				spacing={1}
				sx={{ mb: 0.5, flexWrap: "wrap", gap: 0.5 }}
			>
				<Chip label={postedAgo} size="small" />
				{Array.isArray(tags) && tags.map((tag) => (
					<Chip key={tag} label={tag} size="small" color="info" variant="outlined" />
				))}
			</Stack>
			<Typography variant="h6" component="div" fontWeight="bold">
				{company.title}
			</Typography>
			<Typography variant="body1" color="text.secondary">
				{company.name}
			</Typography>

			{/* Company tags (if any) */}
			{Array.isArray(company.tags) && company.tags.length > 0 && (
				<Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
					{company.tags.map(t => (
						<Chip key={t} label={t} size="small" variant="outlined" />
					))}
				</Stack>
			)}
		</Box>
	</Box>
);

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: (theme.vars ?? theme).palette.text.secondary,
	...theme.applyStyles('dark', {
		backgroundColor: '#1A2027',
	}),
}));

const JobCardDetails = ({ details = {} }) => {
	// Normalize different keys that may come from backend
	const location = details.location || details.position || 'none';
	const isRemote = details.isRemote || (typeof details.remote === 'string' ? details.remote.toLowerCase() === 'remote' : !!details.remote);
	const type = details.type || details.time || 'None';
	const level = details.level || details.seniority || 'None';
	const experience = details.experience || details.date || 'None';
	const salary = details.money || 'None';

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Grid container spacing={2}>
				<Grid size={{ xs: 'auto' }}>
					<Item>
						<DetailItem icon={<LocationOnIcon fontSize="small" />} text={location} />
					</Item>
				</Grid>
				{isRemote && (
					<Grid size={{ xs: 'auto' }}>
						<Item>
							<DetailItem icon={<HomeWorkIcon fontSize="small" />} text={"Remote"} />
						</Item>
					</Grid>
				)}
				<Grid size={{ xs: 'auto' }}>
					<Item>
						<DetailItem icon={<AccessTimeIcon fontSize="small" />} text={type} />
					</Item>
				</Grid>
				<Grid size={{ xs: 'auto' }}>
					<Item>
						<DetailItem icon={<LeaderboardIcon fontSize="small" />} text={level} />
					</Item>
				</Grid>
				<Grid size={{ xs: 'auto' }}>
					<Item>
						<DetailItem icon={<CalendarTodayIcon fontSize="small" />} text={experience} />
					</Item>
				</Grid>
				<Grid size={{ xs: 'auto' }}>
					<Item>
						<DetailItem icon={<AttachMoneyIcon fontSize="small" />} text={salary} />
					</Item>
				</Grid>
			</Grid>
		</Box>
	);
};

const JobCardActions = ({ applicants, applyLink, onViewDetails, onAskgllama }) => {
	const ApplyNow = () => {
		window.open(applyLink || "https://example.com", "_blank", "noopener,noreferrer");
	}
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				mt: 2,
				flexWrap: "wrap",
				gap: 1,
			}}
		>
			<Typography variant="caption" color="text.secondary">
				{applicants.text}
			</Typography>
			<Stack direction="row" spacing={1} alignItems="center">
				<IconButton
					onClick={onViewDetails}
					sx={{ border: "1px solid", borderColor: "grey.300" }}
				>
					<VisibilityIcon fontSize="small" />
				</IconButton>
				<Button
					variant="outlined"
					startIcon={<FlashOnIcon />}
					onClick={onAskgllama}
					sx={{
						textTransform: "none",
						borderRadius: "20px",
					}}
				>
					Ask gllama
				</Button>
				<Button
					variant="contained"
					sx={{
						textTransform: "none",
						bgcolor: "#00C853",
						"&:hover": { bgcolor: "#00B843" },
						borderRadius: "20px",
						display: "flex",        // 👈 ensures flex layout
						alignItems: "center",   // 👈 vertical center
					}}
					onClick={ApplyNow}
				>
					{applyLink && applyLink.includes("linkedin.com") && (
						<LinkedIn style={{ marginRight: 6 }} /> // 👈 space between
					)}
					Apply Now
				</Button>

			</Stack>
		</Box>
	);
};

// --- HELPER FUNCTIONS FOR CALCULATIONS (UNCHANGED and CORRECT) ---
const parseAndCalculateMidYearlySalary = (salaryStr) => {
	if (!salaryStr || typeof salaryStr !== 'string') return null;
	const isHourly = salaryStr.includes('/hr');
	const numbers = salaryStr.match(/[\d.]+/g);
	if (!numbers) return null;
	let values = numbers.map(parseFloat);
	if (salaryStr.toLowerCase().includes('k')) values = values.map(v => v * 1000);
	if (isHourly) values = values.map(v => v * 40 * 52);
	return values.length > 1 ? (values[0] + values[1]) / 2 : values[0];
};
const calculateSalaryScore = (jobMidSalary) => {
	if (jobMidSalary === null) return null;
	/*
	const IDEAL = { min: 120000, max: 190000, mid: 155000 }, ACCEPTABLE = { min: 90000, max: 220000 };
	const interpolate = (val, from1, to1, from2, to2) => (((val - from1) / (to1 - from1)) * (to2 - from2)) + from2;
	if (jobMidSalary >= IDEAL.min && jobMidSalary <= IDEAL.max) return 100 - interpolate(Math.abs(jobMidSalary - IDEAL.mid), 0, IDEAL.mid - IDEAL.min, 0, 10);
	if (jobMidSalary >= ACCEPTABLE.min && jobMidSalary < IDEAL.min) return interpolate(jobMidSalary, ACCEPTABLE.min, IDEAL.min, 50, 90);
	if (jobMidSalary > IDEAL.max && jobMidSalary <= ACCEPTABLE.max) return interpolate(jobMidSalary, IDEAL.max, ACCEPTABLE.max, 90, 50);
	const BUFFER = 20000;
	if (jobMidSalary < ACCEPTABLE.min) return Math.max(0, interpolate(jobMidSalary, ACCEPTABLE.min - BUFFER, ACCEPTABLE.min, 0, 50));
	if (jobMidSalary > ACCEPTABLE.max) return Math.max(0, interpolate(jobMidSalary, ACCEPTABLE.max, ACCEPTABLE.max + BUFFER, 50, 0));
	return 0;
	*/
	if (jobMidSalary > 140000) return 100;
	const x = jobMidSalary / 100000;
	const score = (-(((x - 1.4) / 0.55) ** 4) + 1) ** 2;
	return score > 1 ? 0 : Math.round(score * 100);
};

// --- UI HELPER COMPONENTS ---
const CircularProgressWithLabel = ({ value, size, thickness }) => (
	<Box sx={{ position: 'relative', display: 'inline-flex' }}>
		<CircularProgress variant="determinate" value={value ?? 0} size={size} thickness={thickness} />
		<Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Typography variant={size > 40 ? "h6" : "caption"} component="div" fontWeight="bold">
				{value !== null ? `${Math.round(value)}` : '?'}
			</Typography>
		</Box>
	</Box>
);

// NEW component for a single item within the 2x2 grid
const MetricItem = ({ label, score }) => {

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
			<Box sx={{ width: 60, display: 'flex', justifyContent: 'center', margin: 0.5 }}>
				<CircularProgressWithLabel value={score} size={30} thickness={5} />
			</Box>
			<Typography
				variant="caption"
				sx={{ px: 0.5, borderRadius: 1 }}
			>
				{label}
			</Typography>
		</Box>
	);
};


// --- THE MAIN MATCH PANEL COMPONENT (with corrected 2x2 Grid Layout) ---
const MatchPanel = ({ job, userSkills }) => {
	const scores = useMemo(() => {
		//Example of userSkills
		/*
			[
				"Cloud-based product experience",
				"React",
				"Ruby on Rails",
				"Documentation"
			]
		*/
		const requiredSkills = job.skills || [];
		const matchedCount = requiredSkills.filter(item => userSkills.includes(item)).length;
		const skillMatch = requiredSkills.length > 0 ? (matchedCount / requiredSkills.length) * 100 : 0;
		const applicantCount = job.applicants?.count;
		let applicantScore = 0;
		if (typeof applicantCount === 'number') {
			if (applicantCount <= 25) applicantScore = 100;
			else if (applicantCount >= 200) applicantScore = 0;
			else applicantScore = 100 - (((applicantCount - 25) / 175) * 100);
		}
		let postedDateScore = 0;
		if (job.postedAt) {
			const hoursAgo = (Date.now() - new Date(job.postedAt).getTime()) / 3600000;
			if (hoursAgo <= 24) postedDateScore = 100;
			else if (hoursAgo <= 48) postedDateScore = 80;
			else if (hoursAgo <= 72) postedDateScore = 60;
			else postedDateScore = 40;
		}
		const midSalary = parseAndCalculateMidYearlySalary(job.details?.money);
		const salaryScore = calculateSalaryScore(midSalary);
		const individualScores = { skillMatch, applicantScore, postedDateScore, salaryScore };
		const validScores = Object.values(individualScores).filter(s => s !== null);
		const overallScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
		return {
			skillMatch: Math.round(skillMatch),
			applicantScore: Math.round(applicantScore),
			postedDateScore: Math.round(postedDateScore),
			salaryScore: salaryScore !== null ? Math.round(salaryScore) : null,
			overallScore: Math.round(overallScore)
		};
	}, [job, userSkills]);

	return (
		<Paper variant="outlined" sx={{ width: 340, minWidth: 240, p: 2, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			{/* Overall Score */}
			<Box sx={{ mb: 1.5, textAlign: 'center' }}>
				<CircularProgressWithLabel value={scores.overallScore} size={60} thickness={5} />
				<Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1 }}>
					OVERALL SCORE
				</Typography>
			</Box>

			{/* 2x2 Grid for Sub-Metrics */}
			<Grid container rowSpacing={1} columnSpacing={1}>
				<Grid size={{ md: 6 }}>
					<MetricItem label="Skill" score={scores.skillMatch} />
				</Grid>
				<Grid size={{ md: 6 }}>
					<MetricItem label="Applicants" score={scores.applicantScore} />
				</Grid>
				<Grid size={{ md: 6 }}>
					<MetricItem label="Freshness" score={scores.postedDateScore} />
				</Grid>
				<Grid size={{ md: 6 }}>
					<MetricItem label="Salary" score={scores.salaryScore} />
				</Grid>
			</Grid>
		</Paper>
	);
};

// --- Main Exported Component - MODIFIED FOR LAYOUT ---
const JobCard = ({ job, userSkills, onViewDetails, onAskgllama }) => (
	<Box sx={{ display: 'flex' }}>
		{/* This is your original Card component, now acting as the left panel */}
		<Card
			variant="outlined"
			sx={{
				flexGrow: 1, // Allow this card to take up the remaining space
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0,
				transition: "box-shadow 0.3s",
				"&:hover": { boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)" },
			}}
		>
			<CardContent>
				<JobCardHeader
					company={{
						...job.company,
						title: job.title,
					}}
					postedAgo={job.postedAgo}
					tags={job.tags}
				/>
				<Divider sx={{ my: 1 }} />
				<JobCardDetails details={job.details} />
				<JobCardActions
					applicants={job.applicants}
					applyLink={job.applyLink}
					onViewDetails={() => onViewDetails(job)}
					onAskgllama={onAskgllama}
				/>
			</CardContent>
		</Card>

		{/* This is the new right panel for the percentage UI */}
		<MatchPanel job={job} userSkills={userSkills} />
	</Box>
);

export default JobCard;

/*
{
  "applyLink": "https://firstam.wd1.myworkdayjobs.com/firstamericancareers/job/USA-California-Santa-Ana/Software-Engineer--Remote-in-CA-_R051832?source=LINKED",
  "id": 1757826403786,
  "postedAgo": "12 hours ago",
  "tags": [
	"200+ applicants"
  ],
  "company": {
	"name": "First American",
	"tags": [
	  "Financial Services",
	  "Insurance",
	  "Property Insurance",
	  "Real Estate",
	  "Real Estate Investment"
	],
	"logo": "https://media.licdn.com/dms/image/v2/C4E0BAQGm3U8CaUDy2A/company-logo_100_100/company-logo_100_100/0/1630580362791/first_american_logo?e=2147483647&v=beta&t=-a9Ylz8YY02z9P6TTpJie-SQKd6KSEqHEnoDZNNzVvE"
  },
  "title": "Software Engineer (Remote In CA)",
  "details": {
	"position": "Santa Ana, CA",
	"time": "Full-time",
	"remote": "Remote",
	"seniority": "Mid Level",
	"money": "$34.68/hr - $46.21/hr",
	"date": "4+ years exp"
  },
  "applicants": {
	"count": 200,
	"text": "200+ applicants"
  },
  "description": "Responsibilities\nContribute to design, development, coding, testing, debugging, and deploying of software in an Azure cloud environment.\nModify and enhance existing applications as well as assist the team on product delivery by writing code and reviewing pull requests.\nIndependently define, prioritize goals and tasks in a fast-paced agile product environment with small, focused teams.\nCommunicate effectively with a variety of stakeholders to ensure project success.\nDerive optimal solutions and implement best coding practices.\nWork with Solution Architect and strategize design plans.\n\nQualification\nRepresents the skills you have\n\nFind out how your skills align with this job's requirements. If anything seems off, you can easily click on the tags to select or unselect skills to reflect your actual expertise.\n\nAzure\nPython\nObject-Oriented Programming\nRDBMS\nNoSQL\nReact\nJavaScript/TypeScript\nREST API\nDocker\nLinux\nWindows\nGIT\nNPM Package Management\nEager to Learn\nCommunication Skills\nRequired\n4 + years of experience in cloud-native applications (Azure strongly preferred, AWS is also ok) using Python.\nThorough understanding of Object-Oriented Programming (OOP) design and practices.\nStrong RDBMS experience (PostgreSQL, MS SQL etc.) designing tables & writing queries. NoSQL experience is a strong plus.\nFamiliarity with design patterns.\nConduct code reviews to ensure best coding practices are utilized.\nBachelor’s degree in computer science or equivalent combination of education and experience.\nStrong knowledge of professional software engineering best practices for the full software development life cycle, including coding standards, code reviews, source control management, build processes, testing, CI/CD, and DevOps.\nFluency with multi-platform software utilizing various programming environments and tools.\nExcellent communication and written skills.\nEager to learn new languages and technologies.\nFamiliar with Python, Azure, React, JavaScript/TypeScript, REST API, Relational Databases (PostgreSQL, MySQL etc.), NoSQL Databases (MongoDB etc.).\nExperience with Docker, Linux, Windows, Azure, GIT, NPM Package Management.\n\nBenefits\nMedical\nDental\nVision\n401k\nPTO/paid sick leave\nEmployee stock purchase plan",
  "skills": [
	"Azure",
	"Python",
	"Object-Oriented Programming",
	"RDBMS",
	"NoSQL",
	"React",
	"JavaScript/TypeScript",
	"REST API",
	"Docker",
	"Linux",
	"Windows",
	"GIT",
	"NPM Package Management",
	"Eager to Learn",
	"Communication Skills"
  ],
  "_createdAt": "2025-09-14T05:06:43.788Z",
  "postedAt": "2025-09-13T17:06:43.788Z"
}
*/