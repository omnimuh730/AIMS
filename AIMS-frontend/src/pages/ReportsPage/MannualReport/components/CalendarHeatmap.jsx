import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import './CalendarHeatmap.css'; // Custom CSS for color classes

const CalendarHeatmapChart = ({ data }) => {
	// data format: [{ _id: 'YYYY-MM-DD', count: N }]
	// CalendarHeatmap expects: [{ date: 'YYYY-MM-DD', count: N }]

	const values = data.map(item => ({
		date: item._id,
		count: item.count,
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
				tooltipDataAttrs={(value) => {
					return {
						'data-tip': `${value.date}: ${value.count || 0} applications`,
					};
				}}
				showWeekdayLabels={true}
			/>
		</Paper>
	);
};

export default CalendarHeatmapChart;
