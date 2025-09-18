import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Typography } from '@mui/material';

const JobTitleStackedBar = ({ data }) => {
	// Data format for BarChart: x-axis data and series data
	// Our data: [{ _id: 'Job Title', total: count, seniorityBreakdown: [{ seniority: 'Senior', count: N }] }]

	const jobTitles = data.map(item => item._id);
	const seniorityLevels = ['Intern', 'Junior/Entry', 'Mid-level', 'Senior/Lead']; // Define a consistent order

	const series = seniorityLevels.map(level => ({
		data: jobTitles.map(title => {
			const jobData = data.find(item => item._id === title);
			const breakdown = jobData?.seniorityBreakdown.find(s => s.seniority === level);
			return breakdown?.count || 0;
		}),
		label: level,
		stack: 'total',
		// You can add color customization here if needed
	}));

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">Job Title & Level Breakdown</Typography>
			<BarChart
				xAxis={[{ scaleType: 'band', data: jobTitles, label: 'Job Title' }]}
				yAxis={[{ label: 'Number of Applications' }]}
				series={series}
				height={300}
				margin={{ left: 80, right: 20, top: 20, bottom: 80 }} // Adjust margins for labels
				layout="vertical"
			/>
		</Paper>
	);
};

export default JobTitleStackedBar;
