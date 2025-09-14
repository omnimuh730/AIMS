import React, { useMemo } from "react";
import { calculateJobScores } from "../../../utils/jobScore";

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
	const scores = useMemo(() => calculateJobScores(job, userSkills), [job, userSkills]);

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
					<MetricItem label={`Bid.Est ${scores.estimateApplicantNumber}`} score={scores.applicantScore} />
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