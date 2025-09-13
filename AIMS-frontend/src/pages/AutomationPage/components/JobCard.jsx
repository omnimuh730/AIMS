import React from "react";

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
	Paper
} from "@mui/material";

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
				<Chip label={postedAgo} size="small" sx={{ bgcolor: "grey.200" }} />
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
				<Grid size={{ xs: 6, sm: 3, md: 2 }}>
					<Item>
						<DetailItem icon={<LocationOnIcon fontSize="small" />} text={location} />
					</Item>
				</Grid>
				{isRemote && (
					<Grid size={{ xs: 6, sm: 3, md: 2 }}>
						<Item>
							<DetailItem icon={<HomeWorkIcon fontSize="small" />} text={"Remote"} />
						</Item>
					</Grid>
				)}
				<Grid size={{ xs: 6, sm: 3, md: 2 }}>
					<Item>
						<DetailItem icon={<AccessTimeIcon fontSize="small" />} text={type} />
					</Item>
				</Grid>
				<Grid size={{ xs: 6, sm: 3, md: 2 }}>
					<Item>
						<DetailItem icon={<LeaderboardIcon fontSize="small" />} text={level} />
					</Item>
				</Grid>
				<Grid size={{ xs: 6, sm: 3, md: 2 }}>
					<Item>
						<DetailItem icon={<CalendarTodayIcon fontSize="small" />} text={experience} />
					</Item>
				</Grid>
				<Grid size={{ xs: 6, sm: 3, md: 2 }}>
					<Item>
						<DetailItem icon={<AttachMoneyIcon fontSize="small" />} text={salary} />
					</Item>
				</Grid>
			</Grid>
		</Box>
	);
};

const JobCardActions = ({ applicants, onViewDetails, onAskgllama }) => (
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
				size="small"
				sx={{ border: "1px solid", borderColor: "grey.300" }}
			>
				<BlockIcon fontSize="small" />
			</IconButton>
			<IconButton
				onClick={onViewDetails}
				size="small"
				sx={{ border: "1px solid", borderColor: "grey.300" }}
			>
				<VisibilityIcon fontSize="small" />
			</IconButton>
			<Button
				variant="outlined"
				size="small"
				startIcon={<FlashOnIcon />}
				onClick={onAskgllama}
				sx={{
					textTransform: "none",
					borderRadius: "20px",
					color: "black",
					borderColor: "grey.400",
				}}
			>
				Ask gllama
			</Button>
			<Button
				variant="contained"
				size="small"
				sx={{
					textTransform: "none",
					bgcolor: "#00C853",
					"&:hover": { bgcolor: "#00B843" },
					borderRadius: "20px",
				}}
			>
				Apply Now
			</Button>
		</Stack>
	</Box>
);

// --- Main Exported Component ---
const JobCard = ({ job, onViewDetails, onAskgllama }) => (
	<Card
		variant="outlined"
		sx={{
			borderRadius: 3,
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
				onViewDetails={() => onViewDetails(job)}
				onAskgllama={onAskgllama}
			/>
		</CardContent>
	</Card>
);

export default JobCard;

/*
{
	"applyLink": "https://benefis.wd1.myworkdayjobs.com/bhs/job/Remote-USA/Interface-Engineer--Exempt-_JR104744",
		"id": 1757698370903,
			"postedAgo": "32 minutes ago",
				"tags": [
					"98 applicants"
				],
					"company": {
		"name": "Benefis Health System",
			"tags": [
				"Health Care",
				"Hospital",
				"Non Profit",
				"Primary and Urgent Care"
			]
	},
	"title": "Interface Engineer (Exempt)",
		"details": {
		"position": "Remote USA",
			"time": "Full-time",
				"remote": "Remote",
					"seniority": "Mid, Senior Level",
						"date": "5+ years exp"
	},
	"applicants": {
		"count": 98,
			"text": "98 applicants"
	},
	"description": "Responsibilities\nResponsible for implementing integration techniques to link data between functions in separate applications, and for the translation of data between disparate systems.\nBuilds, configures, and tests interfaces using various technologies to connect and exchange data between information systems applications within the health system.\nEnhances, monitors, tests, and troubleshoots existing interfaces and interacts with ITS applications staff and end users to ensure existing systems are meeting end user needs and working effectively.\nMakes recommendation as to the use and the replacement or purchase of a new interface engine.\nDemonstrates the ability to deal with pressure to meet deadlines, to be accurate, and to handle constantly changing situations.\nDemonstrates the ability to deal with a variety of people, deal with stressful situations, and handle conflict.\nWill perform all job duties or job tasks as assigned.\nWill follow and adhere to all requirements, regulations and procedures of any licensing board or agency.\nMust comply with all Benefis Health System’s organization policies and procedures.\n\nQualification\nRepresents the skills you have\n\nFind out how your skills align with this job's requirements. If anything seems off, you can easily click on the tags to select or unselect skills to reflect your actual expertise.\n\nInterface development\nData integration\nHealth care experience\nTeam collaboration\nProject management\nRequired\nBachelor’s degree in Computer Science, Software Engineering or equivalent technical experience required.\nFive years’ experience in developing and maintaining interfaces required.\nAbility to work in a fast-paced environment and manage multiple projects.\nPreferred\nFive years’ experience in a health care environment preferred.\nExperience collaborating with and organizing large teams.",
		"_createdAt": "2025-09-12T17:32:50.927Z"
}
*/