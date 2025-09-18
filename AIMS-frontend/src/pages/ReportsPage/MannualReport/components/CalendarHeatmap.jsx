import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';

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
			{/* Basic styling for heatmap colors - ideally these would be in a CSS file */}
			<style jsx>{`
				.react-calendar-heatmap .color-scale-0 {
					fill: #ebedf0;
				}
				.react-calendar-heatmap .color-scale-1 {
					fill: #9be9a8;
				}
				.react-calendar-heatmap .color-scale-2 {
					fill: #40c463;
				}
				.react-calendar-heatmap .color-scale-3 {
					fill: #30a14e;
				}
				.react-calendar-heatmap .color-scale-4 {
					fill: #216e39;
				}
			`}</style>
		</Paper>
	);
};

export default CalendarHeatmapChart;
