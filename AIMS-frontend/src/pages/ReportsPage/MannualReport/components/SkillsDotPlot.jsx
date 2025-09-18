import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Paper, Typography } from '@mui/material';

const SkillsDotPlot = ({ data }) => {
	// Data format for ScatterChart: [{ x: value, y: value, id: 'label' }]
	// Our data: [{ name: 'skill', count: number }]

	const chartData = data.map((item, index) => ({
		x: item.count,
		y: index, // Use index for y-axis to create a dot plot effect
		id: item.name,
		label: item.name, // For tooltip
	}));

	const yAxisLabels = data.map(item => item.name);

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">My Targeted Skills</Typography>
			<ScatterChart
				series={[
					{
						data: chartData,
						label: 'Skill Frequency',
						// You can customize marker shape, size, etc.
						markerSize: 8,
					},
				]}
				xAxis={[{ type: 'number', label: 'Frequency' }]}
				yAxis={[
					{
						tickInterval: 1,
						data: yAxisLabels,
						scaleType: 'band',
						label: 'Skill',
					},
				]}
				height={300}
			/>
		</Paper>
	);
};

export default SkillsDotPlot;
