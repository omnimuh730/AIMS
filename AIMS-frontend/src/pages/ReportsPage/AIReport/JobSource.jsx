import React, { useEffect, useState, useMemo } from "react";
import useApi from "../../../api/useApi";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ResponsiveRadar } from "@nivo/radar";
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

	const radarData = useMemo(() => {
		if (!rawData) return [];

		// Initialize a map with all possible job sources from pub.js to ensure all are present in the chart
		const sourceMap = new Map(JobSourceList.map(source => [source, 0]));

		// Populate the map with actual counts from the fetched data
		rawData.forEach(item => {
			if (sourceMap.has(item.source)) {
				sourceMap.set(item.source, item.value);
			}
		});

		// Convert the map to the format expected by the radar chart
		return Array.from(sourceMap.entries()).map(([source, value]) => ({
			source,
			applications: value,
		}));
	}, [rawData]);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	if (radarData.length === 0) {
		return (
			<Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Typography>No job source data available.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ height: '400px', width: '100%', maxWidth: '900px', margin: 'auto', mt: 4 }}>
			<Typography variant="h6" gutterBottom>
				Job Postings by Source
			</Typography>
			<ResponsiveRadar
				data={radarData}
				keys={['applications']}
				indexBy="source"
				margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
				borderColor={{ from: 'color' }}
				gridLabelOffset={36}
				dotSize={10}
				dotColor={{ theme: 'background' }}
				dotBorderWidth={2}
				colors={{ scheme: 'nivo' }}
				blendMode="multiply"
				motionConfig="wobbly"
				legends={[
					{
						anchor: 'top-left',
						direction: 'column',
						translateX: -50,
						translateY: -40,
						itemWidth: 80,
						itemHeight: 20,
						itemTextColor: '#999',
						symbolSize: 12,
						symbolShape: 'circle',
						effects: [
							{
								on: 'hover',
								style: {
									itemTextColor: '#000'
								}
							}
						]
					}
				]}
			/>
		</Box>
	);
};

export default JobSource;