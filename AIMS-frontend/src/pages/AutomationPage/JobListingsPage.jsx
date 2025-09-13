import React, { useState, useEffect, useCallback } from "react";
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
    const [sortOption, setSortOption] = useState("_createdAt_desc");
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const { loading, error, get } = useApi();

    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchJobs = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                q: searchQuery,
                sort: sortOption,
                page: pagination.page,
                limit: pagination.limit,
            });
            const res = await get(`http://localhost:3000/api/jobs?${params.toString()}`);
            if (res && res.success) {
                setJobs(res.data);
                setPagination(res.pagination);
            }
        } catch (err) {
            console.warn('Failed to fetch jobs from backend', err);
        }
    }, [searchQuery, sortOption, pagination.page, pagination.limit, get]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

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

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
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
                <SmartToolbar 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Alert severity="error">Failed to load jobs. Please try again later.</Alert>
                ) : (
                    jobs.map((job, idx) => (
                        <JobCard
                            key={job.id || (job._id ? String(job._id) : idx)}
                            job={job}
                            onViewDetails={handleViewDetails}
                            onAskgllama={handleAskgllama}
                        />
                    ))
                )}
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
