import React, { useEffect, useState, useMemo } from "react";
import useApi from "../../../api/useApi";
import { Box, CircularProgress, Typography } from "@mui/material";
import { RadarChart } from '@mui/x-charts/RadarChart';
import { JobSource as JobSourceList } from '../../../../../configs/pub';

// Define the power for scaling. 0.5 is a square root scale.
// A smaller number (e.g., 0.3) will compress the range even more.
const SCALING_POWER = 0.3;

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

	// Prepare original, scaled, and label data
	const chartData = useMemo(() => {
		if (!rawData) return { labels: [], originalData: [], scaledData: [] };

		const sourceMap = new Map(JobSourceList.map(source => [source, 0]));

		rawData.forEach(item => {
			if (sourceMap.has(item.source)) {
				sourceMap.set(item.source, item.value);
			}
		});

		const labels = JobSourceList;
		const originalData = JobSourceList.map(source => sourceMap.get(source) || 0);

		// Apply the power scale transformation for the visual chart line
		const scaledData = originalData.map(value => Math.pow(value, SCALING_POWER));

		return { labels, originalData, scaledData };
	}, [rawData]);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	if (chartData.originalData.length === 0) {
		return (
			<Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Typography>No job source data available.</Typography>
			</Box>
		);
	}

	// Calculate the max value based on the SCALED data
	const maxScaledValue = Math.max(...chartData.scaledData);

	return (
		<Box sx={{ height: '400px', width: '100%', maxWidth: '900px', margin: 'auto', mt: 4 }}>
			<Typography variant="h6" gutterBottom>
				Job Postings by Source
			</Typography>
			<RadarChart
				height={400}
				series={[
					{
						name: 'Applications',
						data: chartData.scaledData, // Use scaled data for rendering
						// --- Tooltip Customization ---
						// Show the original value on hover
						valueFormatter: (value, { dataIndex }) => `${chartData.originalData[dataIndex]} applications`,
					}
				]}
				radar={{
					max: maxScaledValue > 0 ? Math.ceil(maxScaledValue * 1.1) : 10,
					metrics: chartData.labels,
					// --- Axis Label Customization ---
					// Show the original scale on the grid lines
					scale: {
						valueFormatter: (value) => Math.round(Math.pow(value, 1 / SCALING_POWER)).toString(),
					},
				}}
			/>
		</Box>
	);
};

export default JobSource;