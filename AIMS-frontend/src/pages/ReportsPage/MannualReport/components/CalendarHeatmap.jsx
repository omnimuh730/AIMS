import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Tooltip } from 'react-tooltip'; // <-- 1. Change to a named import
import './CalendarHeatmap.css';

const CalendarHeatmapChart = ({ data }) => {
	const values = data.map(item => ({
		date: item.day,
		count: item.value,
	}));

	const endDate = dayjs();
	const startDate = endDate.subtract(1, 'year');

	return (
		<Paper elevation={3} sx={{ p: 2, height: 250 }}>
			<Typography variant="h6">My Application Rhythm</Typography>
			<CalendarHeatmap
				startDate={startDate.toDate()}
				endDate={endDate.toDate()}
				values={values}
				classForValue={(value) => {
					if (!value) {
						return 'color-empty';
					}
					return `color-scale-${Math.min(value.count, 4)}`;
				}}
				// 2. Update the attributes to match the new API
				tooltipDataAttrs={(value) => {
					if (!value || !value.date) {
						return { 'data-tooltip-id': null }; // Don't show tooltip for empty cells
					}
					const date = dayjs(value.date).format('MMM D, YYYY');
					const content = `${date}: ${value.count} applications`;
					return {
						'data-tooltip-id': 'heatmap-tooltip', // Link to the Tooltip component
						'data-tooltip-content': content,     // Set the content
					};
				}}
				showWeekdayLabels={true}
			/>
			{/* 3. Render the Tooltip component with a matching id */}
			<Tooltip id="heatmap-tooltip" />
		</Paper>
	);
};

export default CalendarHeatmapChart;