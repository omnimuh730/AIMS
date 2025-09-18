import { ResponsiveStream } from '@nivo/stream';
import { Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.extend(dayOfYear);

const JobPostingStreamgraph = ({ data }) => {
	// Data format for Nivo Stream:
	// [{
	//   "time": "YYYY-MM-DDTHH:00:00.000Z",
	//   "Senior/Lead": 10,
	//   "Mid-level": 5,
	//   "Junior/Entry": 2,
	//   "Intern": 1
	// }, ...]

	// Transform data from backend: [{ _id: { hour, day }, seniorityBreakdown: [{ seniority, count }], total }] 
	// to Nivo Stream format

	const transformedData = [];

	// Create a map for easier lookup
	const dataMap = new Map();
	data.forEach(item => {
		const date = dayjs().dayOfYear(item._id.day).hour(item._id.hour).startOf('hour');
		const timeKey = date.toISOString();
		if (!dataMap.has(timeKey)) {
			dataMap.set(timeKey, { time: timeKey, 'Senior/Lead': 0, 'Mid-level': 0, 'Junior/Entry': 0, 'Intern': 0 });
		}
		const entry = dataMap.get(timeKey);
		item.seniorityBreakdown.forEach(breakdown => {
			entry[breakdown.seniority] = breakdown.count;
		});
	});

	// Sort by time and convert to array
	Array.from(dataMap.keys()).sort().forEach(key => {
		transformedData.push(dataMap.get(key));
	});

	const keys = ['Senior/Lead', 'Mid-level', 'Junior/Entry', 'Intern'];

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">Job Posting Velocity (Last 48 Hours)</Typography>
			<ResponsiveStream
				data={transformedData}
				keys={keys}
				margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					enable: true,
					orient: 'bottom',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Time',
					legendOffset: 36,
					legendPosition: 'middle',
					format: value => dayjs(value).format('HH:00'),
				}}
				axisLeft={{
					enable: true,
					orient: 'left',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Volume',
					legendOffset: -40,
					legendPosition: 'middle',
				}}
				enableGridX={true}
				enableGridY={false}
				colors={{ scheme: 'nivo' }}
				fillOpacity={0.85}
				borderColor={{ theme: 'background' }}
				defs={[
					{
						id: 'dots',
						type: 'patternDots',
						background: 'inherit',
						color: '#2c998f',
						size: 4,
						padding: 1,
						stagger: true,
					},
					{
						id: 'squares',
						type: 'patternSquares',
						background: 'inherit',
						color: '#e4c512',
						size: 6,
						padding: 1,
						stagger: true,
					},
				]}
				                fill={[
					{ match: "{id: 'Senior/Lead'}", id: 'dots' },
					{ match: "{id: 'Mid-level'}", id: 'squares' },
				]}
				dotSize={10}
				dotBorderWidth={2}
				dotBorderColor={{ from: 'color' }}
				legends={[
					{
						anchor: 'bottom-right',
						direction: 'column',
						translateX: 100,
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 12,
						symbolShape: 'circle',
						effects: [
							{
								on: 'hover',
								style: {
									itemOpacity: 1,
								},
							},
						],
					},
				]}
			/>
		</Paper>
	);
};

export default JobPostingStreamgraph;
