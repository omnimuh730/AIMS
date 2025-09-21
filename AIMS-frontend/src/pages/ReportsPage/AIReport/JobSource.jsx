import React, { useEffect, useState, useMemo } from "react";
import useApi from "../../../api/useApi";
import { Box, CircularProgress, Typography } from "@mui/material";
import { RadarChart } from '@mui/x-charts/RadarChart'; // Changed import
import { JobSource as JobSourceList } from '../../../../../configs/pub';

const JobSource = () => {
	const { get } = useApi();
	const [rawData, setRawData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await get("/reports/job-sources");
				console.log("Job Sources Response:", response);
				if (response.success) {
					setRawData(response.data || []);
				} else {
					setError(response.error || "Failed to fetch data");
				}
			} catch (err) {
				setError(err.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [get]);

	// Reworked data processing for MUI X Charts
	const chartData = useMemo(() => {
		if (!rawData) return { data: [], labels: [] };

		const sourceMap = new Map(JobSourceList.map(source => [source, 0]));

		rawData.forEach(item => {
			if (sourceMap.has(item.source)) {
				sourceMap.set(item.source, item.value);
			}
		});

		const labels = JobSourceList;
		const data = JobSourceList.map(source => sourceMap.get(source) || 0);

		return { data, labels };
	}, [rawData]);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	if (chartData.data.length === 0) {
		return (
			<Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Typography>No job source data available.</Typography>
			</Box>
		);
	}

	// Calculate a dynamic max value for the chart's scale
	const maxValue = Math.max(...chartData.data);

	return (
		<Box sx={{ height: '400px', width: '100%', maxWidth: '900px', margin: 'auto', mt: 4 }}>
			<Typography variant="h6" gutterBottom>
				Job Postings by Source
			</Typography>
			{/* Replaced Nivo chart with MUI X RadarChart */}
			<RadarChart
				height={400}
				series={[
					{
						name: 'Applications',
						data: chartData.data
					}
				]}
				radar={{
					// Add a small buffer to the max value for better visuals, or set a default
					max: maxValue > 0 ? Math.ceil(maxValue * 1.1) : 10,
					metrics: chartData.labels,
				}}
			/>
		</Box>
	);
};

export default JobSource;