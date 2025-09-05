import React, { useState, useEffect } from "react";

// MUI Imports
import {
	Container,
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
	Drawer,
	Modal,
	CircularProgress,
} from "@mui/material";

// MUI Icon Imports
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BlockIcon from "@mui/icons-material/Block";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

// Mock Data
import { mockJobs } from "./mockJobs";

// --- Reusable Sub-Components ---
const DetailItem = ({ icon, text }) =>
	text ? (
		<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
			{icon}
			<Typography variant="body2" color="text.secondary">
				{text}
			</Typography>
		</Box>
	) : null;

// --- New "Ask Orion" Modal Component ---
const AskOrionModal = ({ open, onClose }) => {
	const [isAnalyzing, setIsAnalyzing] = useState(true);

	useEffect(() => {
		if (open) {
			setIsAnalyzing(true);
			const timer = setTimeout(() => {
				setIsAnalyzing(false);
			}, 2000); // Simulate 2-second analysis
			return () => clearTimeout(timer);
		}
	}, [open]);

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "1px solid #ddd",
		boxShadow: 24,
		p: 4,
		borderRadius: 2,
		textAlign: "center",
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={style}>
				{isAnalyzing ? (
					<>
						<CircularProgress sx={{ mb: 2 }} />
						<Typography variant="h6">
							Analyzing Job Description...
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Orion is checking your profile against the job
							requirements.
						</Typography>
					</>
				) : (
					<>
						<Typography variant="h6" color="primary">
							Analysis Complete!
						</Typography>
						<Typography variant="body1" sx={{ mt: 2 }}>
							You are a <strong>strong match</strong> for this
							role.
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mt: 1 }}
						>
							Highlight your experience in Java EE and
							microservices.
						</Typography>
						<Button
							variant="contained"
							onClick={onClose}
							sx={{ mt: 3 }}
						>
							Close
						</Button>
					</>
				)}
			</Box>
		</Modal>
	);
};

// --- New Job Detail Drawer Component ---
const JobDetailDrawer = ({ job, open, onClose, onAskOrion }) => {
	if (!job) return null;

	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Box
				sx={{
					width: { xs: "100vw", sm: 500, md: 600 },
					p: 3,
					position: "relative",
					height: "100%",
				}}
			>
				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", top: 16, right: 16 }}
				>
					<CloseIcon />
				</IconButton>

				<Typography variant="h5" fontWeight="bold">
					{job.title}
				</Typography>
				<Typography variant="body1" color="text.secondary" gutterBottom>
					{job.company.name} &middot; {job.details.location}
				</Typography>

				<Divider sx={{ my: 2 }} />

				<Box
					sx={{ overflowY: "auto", height: "calc(100% - 150px)" }}
					dangerouslySetInnerHTML={{ __html: job.description }}
				/>

				{/* Sticky Footer */}
				<Box
					sx={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						p: 2,
						bgcolor: "background.paper",
						borderTop: "1px solid",
						borderColor: "divider",
					}}
				>
					<Stack
						direction="row"
						spacing={2}
						justifyContent="flex-end"
					>
						<Button
							variant="outlined"
							startIcon={<FlashOnIcon />}
							onClick={onAskOrion}
							size="small"
							sx={{
								textTransform: "none",
								borderRadius: "20px",
								color: "black",
								borderColor: "grey.400",
							}}
						>
							Ask Orion
						</Button>
						<Button
							variant="contained"
							color="primary"
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
			</Box>
		</Drawer>
	);
};

// --- Job Card Components (with updates) ---
const JobCardHeader = ({ company, postedAgo, tags } /* Unchanged */) => (
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
const JobCardDetails = ({ details } /* Unchanged */) => (
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

const JobCardActions = (
	{ applicants, onViewDetails, onAskOrion }, // Updated with new props
) => (
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
				onClick={onAskOrion}
				sx={{
					textTransform: "none",
					borderRadius: "20px",
					color: "black",
					borderColor: "grey.400",
				}}
			>
				Ask Orion
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

const JobCard = (
	{ job, onViewDetails, onAskOrion }, // Updated with new props
) => (
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
				onAskOrion={onAskOrion}
			/>
		</CardContent>
	</Card>
);

// --- Main Page Component with State Management ---
function JobListingsPage() {
	const [jobs] = useState(mockJobs);
	const [selectedJob, setSelectedJob] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleViewDetails = (job) => {
		setSelectedJob(job);
	};

	const handleCloseDrawer = () => {
		setSelectedJob(null);
	};

	const handleAskOrion = () => {
		setIsModalOpen(true);
		// If the drawer is open, we can keep it open or close it.
		// For a better UX, let's keep it open.
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<Container
			maxWidth="lg"
			sx={{ py: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}
		>
			<Stack spacing={2.5}>
				<Typography
					variant="h4"
					component="h1"
					fontWeight="bold"
					gutterBottom
				>
					Recommended Jobs
				</Typography>
				{jobs.map((job) => (
					<JobCard
						key={job.id}
						job={job}
						onViewDetails={handleViewDetails}
						onAskOrion={handleAskOrion}
					/>
				))}
			</Stack>

			<JobDetailDrawer
				job={selectedJob}
				open={!!selectedJob}
				onClose={handleCloseDrawer}
				onAskOrion={handleAskOrion}
			/>

			<AskOrionModal open={isModalOpen} onClose={handleCloseModal} />
		</Container>
	);
}

function App() {
	return <JobListingsPage />;
}

export default App;
