import React from "react";

// MUI Imports
import {
	Card,
	CardContent,
	Typography,
	Grid,
	Box,
	Avatar,
	Stack,
	Chip,
	Button,
	IconButton,
	Divider,
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

// Internal Component Import
import DetailItem from "./DetailItem";

// --- Sub-Components (Internal to JobCard) ---
const JobCardHeader = ({ company, postedAgo, tags }) => (
	<Box sx={{ display: "flex", alignItems: "start", mb: 1.5 }}>
		<Avatar
			src={company.logo}
			alt={`${company.name} logo`}
			variant="rounded"
			sx={{ width: 56, height: 56, mr: 2 }}
		/>
		<Box sx={{ flexGrow: 1 }}>
			<Stack
				direction="row"
				spacing={1}
				sx={{ mb: 0.5, flexWrap: "wrap", gap: 0.5 }}
			>
				<Chip
					label={postedAgo}
					size="small"
					sx={{ bgcolor: "grey.200" }}
				/>
				{tags.map((tag) => (
					<Chip
						key={tag}
						label={tag}
						size="small"
						color="info"
						variant="outlined"
					/>
				))}
			</Stack>
			<Typography variant="h6" component="div" fontWeight="bold">
				{company.title}
			</Typography>
			<Typography variant="body1" color="text.secondary">
				{company.name}
			</Typography>
		</Box>
	</Box>
);

const JobCardDetails = ({ details }) => (
	<Grid container spacing={{ xs: 1, sm: 2 }} sx={{ my: 1 }}>
		<Grid item xs={6} sm={4}>
			<DetailItem
				icon={<LocationOnIcon fontSize="small" />}
				text={details.location}
			/>
		</Grid>
		{details.isRemote && (
			<Grid item xs={6} sm={4}>
				<DetailItem
					icon={<HomeWorkIcon fontSize="small" />}
					text="Remote"
				/>
			</Grid>
		)}
		<Grid item xs={6} sm={4}>
			<DetailItem
				icon={<AccessTimeIcon fontSize="small" />}
				text={details.type}
			/>
		</Grid>
		<Grid item xs={6} sm={4}>
			<DetailItem
				icon={<LeaderboardIcon fontSize="small" />}
				text={details.level}
			/>
		</Grid>
		<Grid item xs={6} sm={4}>
			<DetailItem
				icon={<CalendarTodayIcon fontSize="small" />}
				text={details.experience}
			/>
		</Grid>
		<Grid item xs={6} sm={4}>
			<DetailItem
				icon={<AttachMoneyIcon fontSize="small" />}
				text={details.salary}
			/>
		</Grid>
	</Grid>
);

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
					name: job.company.name,
					logo: job.company.logo,
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
