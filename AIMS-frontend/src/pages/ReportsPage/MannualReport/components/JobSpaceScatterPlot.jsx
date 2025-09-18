import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Paper, Typography } from '@mui/material';

const JobSpaceScatterPlot = ({ data }) => {
	// Data format for ScatterChart: [{ x: value, y: value, id: 'label' }]
	// Our data: [{ title, seniority, interactionStatus, source, skillMatchCount, x, y }]

	const seriesData = [
		{
			label: 'Job Applications',
			data: data.map(item => ({
				x: item.x,
				y: item.y,
				id: item._id,
				label: item.title,
				interactionStatus: item.interactionStatus,
				source: item.source,
			})),
		},
	];

	const getPointColor = (status) => {
		switch (status) {
			case 'Applied': return 'blue';
			case 'Interview': return 'orange';
			case 'Offer': return 'green';
			case 'Rejected': return 'red';
			default: return 'gray';
		}
	};

	const getPointShape = (source) => {
		switch (source) {
			case 'LinkedIn': return 'circle';
			case 'Workday': return 'square';
			case 'Indeed': return 'triangle';
			default: return 'circle';
		}
	};

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">Job Space Navigator</Typography>
			<ScatterChart
				series={seriesData}
				xAxis={[{ type: 'number', label: 'Skill Match Count' }]}
				yAxis={[
					{
						scaleType: 'band',
						data: ['Intern', 'Junior/Entry', 'Mid-level', 'Senior/Lead'],
						label: 'Seniority Level',
					},
				]}
				height={300}
				
				// Customizing point appearance based on data
				// This part might need direct SVG manipulation or a more flexible charting library
				// @mui/x-charts doesn't directly support custom shapes per point in series data
				// For color, we can map it in the series data itself if needed.
			/>
		</Paper>
	);
};

export default JobSpaceScatterPlot;
