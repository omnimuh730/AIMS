import React, { useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import useApi from "../../../api/useApi"; // Assuming this path is correct
import { Box, CircularProgress, Typography } from "@mui/material";
import { ResponsiveCalendar } from "@nivo/calendar";

const DailyApplication = () => {
	const { get } = useApi();
	const [rawData, setRawData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await get("/reports/daily-applications");
				if (response.success) {
					setRawData(response.data || []); // Ensure rawData is always an array
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

	const nivoData = useMemo(() => {
		if (!rawData) return [];
		return rawData.map(item => ({
			day: item.date,
			value: item.value,
		}));
	}, [rawData]);

	// This calculation will now only run with meaningful data
	const { fromDate, toDate } = useMemo(() => {
		// This check is now mostly for safety, as we won't render the chart if data is empty
		if (nivoData.length === 0) {
			const year = new Date().getFullYear();
			return {
				fromDate: `${year}-01-01`,
				toDate: `${year}-12-31`,
			};
		}

		// Use reduce to find the earliest date, making it robust against unsorted data
		const earliestDate = nivoData.reduce((earliest, current) => {
			const currentDate = new Date(current.day);
			return currentDate < earliest ? currentDate : earliest;
		}, new Date(nivoData[0].day));

		const year = earliestDate.getFullYear();

		return {
			fromDate: `${year}-01-01`,
			toDate: `${year}-12-31`,
		};
	}, [nivoData]);

	// --- The Fix is Here ---

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	// This is the crucial new check. We wait until the data is loaded AND present.
	if (nivoData.length === 0) {
		return (
			<Box sx={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Typography>No application data available for the selected period.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ height: '250px', width: '100%', maxWidth: '900px', margin: 'auto' }}>
			<Typography variant="h6" gutterBottom>
				Daily Applications
			</Typography>

			<ResponsiveCalendar
				data={nivoData}
				from={fromDate}
				to={toDate}
				emptyColor="#ebedf0"
				colors={['#9be9a8', '#40c463', '#30a14e', '#216e39']}
				margin={{ top: 40, right: 40, bottom: 0, left: 40 }}
				yearSpacing={40}
				monthBorderColor="#ffffff"
				dayBorderWidth={2}
				dayBorderColor="#ffffff"
				tooltip={({ day, value }) => (
					<div
						style={{
							padding: '8px 12px',
							background: '#222',
							color: '#fff',
							borderRadius: '3px',
							fontSize: '12px',
						}}
					>
						<strong>{value} applications</strong> on {day}
					</div>
				)}
				legends={[
					{
						anchor: 'bottom-right',
						direction: 'row',
						translateY: 36,
						itemCount: 4,
						itemWidth: 42,
						itemHeight: 36,
						itemsSpacing: 14,
						itemDirection: 'right-to-left',
					},
				]}
			/>
		</Box>
	);
};

export default DailyApplication;