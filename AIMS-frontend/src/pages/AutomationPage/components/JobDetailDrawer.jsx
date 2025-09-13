import React from "react";
import {
	Drawer,
	Box,
	IconButton,
	Typography,
	Divider,
	Stack,
	Button,
	Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlashOnIcon from "@mui/icons-material/FlashOn";

const JobDetailDrawer = ({ job, open, onClose, onAskgllama }) => {
	if (!job) return null;

	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Box
				sx={{
					width: { xs: "100vw", sm: 500, md: 600 },
					p: 5,
					pt: 15,
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
					{job.company.name} &middot; {(job.details && (job.details.location || job.details.position))}
				</Typography>
				{/* Company tags */}
				{Array.isArray(job.company.tags) && job.company.tags.length > 0 && (
					<Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
						{job.company.tags.map(t => (
							<Chip key={t} label={t} size="small" variant="outlined" />
						))}
					</Stack>
				)}
				<Divider sx={{ my: 2 }} />

				<Box sx={{ overflowY: "auto", height: "calc(100% - 150px)" }}>
					{typeof job.description === 'string' && /<\w+.*?>/.test(job.description) ? (
						// If description contains HTML tags, render as HTML
						<Box dangerouslySetInnerHTML={{ __html: job.description }} />
					) : (
						// Plain text - preserve newlines
						<Box sx={{ whiteSpace: 'pre-line' }}>{job.description}</Box>
					)}
				</Box>

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
							onClick={onAskgllama}
							size="small"
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

export default JobDetailDrawer;

/** 
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