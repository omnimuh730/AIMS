import React, { useState } from "react";
import { Container, Stack, Typography } from "@mui/material";

// Data Import
import { mockJobs } from "./data/mockJobs";

// Component Imports
import JobCard from "./components/JobCard";
import JobDetailDrawer from "./components/JobDetailDrawer";
import AskOrionModal from "./components/AskOrionModal";

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
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<Container
			maxWidth="xl"
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

export default JobListingsPage;
