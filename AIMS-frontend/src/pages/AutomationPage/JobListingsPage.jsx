import React, { useState, useEffect, useCallback } from "react";
import useNotification from '../../api/useNotification';
import { Container, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import useApi from "../../api/useApi";

// Component Imports
import JobCard from "./components/JobCard";
import JobDetailDrawer from "./components/JobDetailDrawer";
import AskgllamaModal from "./components/AskgllamaModal";
import SmartToolbar from "./components/SmartToolbar";

function JobListingsPage() {
	const [jobs, setJobs] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOption, setSortOption] = useState("postedAt_desc");
    const [filters, setFilters] = useState({ showLinkedInOnly: true, applied: false });
	const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
	const { loading, error, get, post } = useApi();

	const [selectedJob, setSelectedJob] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userSkills, setUserSkills] = useState([]);
	const [selectedIds, setSelectedIds] = useState([]);
	const notification = useNotification();
	const [skillsChanged, setSkillsChanged] = useState(false);

	// Fetch jobs
	const fetchJobs = useCallback(async () => {
		try {
			const params = new URLSearchParams();
			if (searchQuery) params.set('q', searchQuery);
			if (sortOption && sortOption !== 'recommended') params.set('sort', sortOption);
			params.set('page', pagination.page);
			params.set('limit', pagination.limit);

			// Add filters (flattened) only when they have values
			Object.entries(filters).forEach(([k, v]) => {
				if (v === undefined || v === null) return;
				// If tags array, serialize to comma-separated
				if (Array.isArray(v)) {
					const arr = v.map(s => String(s).trim()).filter(Boolean);
					if (arr.length) params.set(k, arr.join(','));
					return;
				}
				// For postedAtFrom/postedAtTo, send as UTC ISO string
				if ((k === 'postedAtFrom' || k === 'postedAtTo') && v) {
					params.set(k, v);
					return;
				}
				if (String(v).trim() !== '') params.set(k, String(v));
			});

			let url = `http://localhost:3000/api/jobs?${params.toString()}`;
			if (sortOption === 'recommended') {
				url += `&sort=recommended`;
			}
			const res = await get(url);
			if (res && res.success) {
				setJobs(res.data);
				setPagination(res.pagination);
			}
		} catch (err) {
			console.warn('Failed to fetch jobs from backend', err);
		}
	}, [searchQuery, sortOption, pagination.page, pagination.limit, get, filters, userSkills]);

	// Fetch user skills
	const fetchUserSkills = useCallback(async () => {
		try {
			const res = await get('http://localhost:3000/api/personal/skills');
			if (res && res.success && Array.isArray(res.skills)) {
				setUserSkills(res.skills);
			}
		} catch (err) {
			console.warn('Failed to fetch user skills', err);
		}
	}, [get]);

	useEffect(() => {
		fetchJobs();
	}, [fetchJobs]);

	useEffect(() => {
		fetchUserSkills();
	}, [fetchUserSkills]);

	const handleViewDetails = (job) => {
		setSelectedJob(job);
	};

	const handleCloseDrawer = () => {
		setSelectedJob(null);
		if (skillsChanged) {
			setSkillsChanged(false); // Reset first to ensure correct rerender
			fetchUserSkills();
			fetchJobs();
		}
	};

    const handleAskgllama = () => {
        setIsModalOpen(true);
    };

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handlePageChange = (newPage) => {
		setPagination(prev => ({ ...prev, page: newPage }));
	};

    const handleLimitChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    // Mark a job as applied before opening Apply link
    const handleApplyJob = async (job) => {
        try {
            const id = job._id || job.id;
            if (!id) return;
            const strId = typeof id === 'object' && id.$oid ? id.$oid : String(id);
            await post(`http://localhost:3000/api/jobs/${strId}/apply`, { applied: true });
            // Refresh list so applied jobs disappear when showing not-applied
            fetchJobs();
        } catch (e) {
            console.warn('Failed to mark job applied', e);
        }
    };

	// Select all jobs on current page
	const handleSelectAll = (checked) => {
		if (checked) {
			setSelectedIds(jobs.map(job => job._id || job.id));
		} else {
			setSelectedIds([]);
		}
	};

	// Toggle single job selection
	const handleSelectJob = (id, checked) => {
		setSelectedIds(prev => checked ? [...prev, id] : prev.filter(_id => _id !== id));
	};

	// Remove selected jobs
	const handleRemoveSelected = async () => {
		if (!selectedIds.length) return;
		try {
			// Send ids as strings for backend compatibility
			const ids = selectedIds.map(id => typeof id === 'object' && id.$oid ? id.$oid : String(id));
			const res = await post('http://localhost:3000/api/jobs/remove', { ids });
			if (res && res.success) {
				notification.success(`Removed ${res.deletedCount || 0} job(s)`);
				setSelectedIds([]);
				fetchJobs();
			} else {
				notification.error('Failed to remove jobs');
			}
		} catch (err) {
			notification.error('Failed to remove jobs');
		}
	};

	const handleApplySelected = () => {
		// Open tabs for each selected job's applyLink
		if (!selectedIds.length) return;
		const jobsToApply = jobs.filter(job => selectedIds.includes(job._id || job.id) && job.applyLink).map(j => j.applyLink);
		if (!jobsToApply.length) return;

		// Send links to backend relay which will forward them to the extension to open tabs
		try {
			post('http://localhost:3000/api/open-tabs', { urls: jobsToApply });
		} catch (err) {
			console.error('Failed to request extension to open tabs', err);
		}
	}
	const handleAnalyzeSelected = async () => {
		console.log('Analyze selected jobs:', selectedIds);
	}

	return (
		<Container
			maxWidth="xl"
			sx={{ py: 4, minHeight: "100vh" }}
		>
			<Stack spacing={2.5}>
				<Typography
					variant="h4"
					component="h1"
					fontWeight="bold"
					gutterBottom
				>
					{`Recommended Jobs (${pagination.total || 0})`}
				</Typography>
				<SmartToolbar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					sortOption={sortOption}
					onSortChange={setSortOption}
					pagination={pagination}
					onPageChange={handlePageChange}
					onLimitChange={handleLimitChange}
					filters={filters}
					onFiltersChange={(next) => { setFilters(next); setPagination(p => ({ ...p, page: 1 })); }}
					selectAllChecked={selectedIds.length === jobs.length && jobs.length > 0}
					onSelectAll={handleSelectAll}
					onRemoveSelected={handleRemoveSelected}
					onApplySelected={handleApplySelected}
					onAnalyzeSelected={handleAnalyzeSelected}
					disableButtons={!selectedIds.length}
					showLinkedInOnly={!!filters.showLinkedInOnly}
					onShowLinkedInOnlyChange={checked => setFilters(f => ({ ...f, showLinkedInOnly: checked }))}
				/>
				{loading ? (
					<CircularProgress />
				) : error ? (
					<Alert severity="error">Failed to load jobs. Please try again later.</Alert>
				) : (
					jobs
						.filter(job => {
							if (filters.showLinkedInOnly) return true;
							return !(job.applyLink && job.applyLink.includes('linkedin.com'));
						})
						.map((job, idx) => (
                        <JobCard
                            key={job._id || job.id || idx}
                            job={job}
                            userSkills={userSkills}
                            onViewDetails={handleViewDetails}
                            onAskgllama={handleAskgllama}
                            onApply={handleApplyJob}
                            checked={selectedIds.includes(job._id || job.id)}
                            onCheck={(checked) => handleSelectJob(job._id || job.id, checked)}
                        />
						))
				)}
			</Stack>

            <JobDetailDrawer
                job={selectedJob}
                open={!!selectedJob}
                onClose={handleCloseDrawer}
                onAskgllama={handleAskgllama}
                onApply={handleApplyJob}
                onSkillsChanged={() => setSkillsChanged(true)}
            />

			<AskgllamaModal open={isModalOpen} onClose={handleCloseModal} />
		</Container>
	);
}

export default JobListingsPage;
