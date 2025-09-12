import React, { useState, useEffect } from "react";
import { Container, Stack, Typography } from "@mui/material";

// Data Import
import { mockJobs } from "./data/mockJobs";
import useApi from "../../api/useApi";

// Component Imports
import JobCard from "./components/JobCard";
import JobDetailDrawer from "./components/JobDetailDrawer";
import AskgllamaModal from "./components/AskgllamaModal";

function JobListingsPage() {
	const [jobs, setJobs] = useState(mockJobs);
	const api = useApi();

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				// call backend to get saved jobs
				const res = await api.get('http://localhost:3000/api/jobs');
				if (!mounted) return;
				if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
					setJobs(res.data);
				}
			} catch (err) {
				// keep mock jobs as fallback
				console.warn('Failed to fetch jobs from backend, using mock data', err);
			}
		})();
		return () => { mounted = false; };
	}, [api]);
	const [selectedJob, setSelectedJob] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleViewDetails = (job) => {
		setSelectedJob(job);
	};

	const handleCloseDrawer = () => {
		setSelectedJob(null);
	};

	const handleAskgllama = () => {
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
				{jobs.map((job, idx) => (
					<JobCard
						key={job.id || (job._id ? String(job._id) : idx)}
						job={job}
						onViewDetails={handleViewDetails}
						onAskgllama={handleAskgllama}
					/>
				))}
			</Stack>

			<JobDetailDrawer
				job={selectedJob}
				open={!!selectedJob}
				onClose={handleCloseDrawer}
				onAskgllama={handleAskgllama}
			/>

			<AskgllamaModal open={isModalOpen} onClose={handleCloseModal} />
		</Container>
	);
}

export default JobListingsPage;
