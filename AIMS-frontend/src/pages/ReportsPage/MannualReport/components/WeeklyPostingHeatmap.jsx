import { ResponsiveHeatMap } from '@nivo/heatmap';
import { Paper, Typography } from '@mui/material';

const WeeklyPostingHeatmap = ({ data }) => {
	// Data format for Nivo Heatmap:
	// [{
	//   "id": "Day of Week",
	//   "data": [
	//     { "x": "Hour", "y": "Count" },
	//     ...
	//   ]
	// }, ...]

	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const hoursOfDay = Array.from({ length: 24 }, (_, i) => i.toString());

	const transformedData = daysOfWeek.map((day, dayIndex) => {
		const dayData = {
			id: day,
			data: hoursOfDay.map(hour => {
				const item = data.find(d => d._id.dayOfWeek === dayIndex + 1 && d._id.hourOfDay === parseInt(hour));
				return {
					x: hour,
					y: item ? item.count : 0,
				};
			}),
		};
		return dayData;
	});

	const allValues = data.map(d => d.count);
	const minValue = data.length > 0 ? Math.min(...allValues) : 0;
	const maxValue = data.length > 0 ? Math.max(...allValues) : 0;

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">Weekly Posting Cadence</Typography>
			<ResponsiveHeatMap
				data={transformedData}
				indexBy="id"
				margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
				forceSquare={true}
				minValue={minValue}
				maxValue={maxValue}
				axisTop={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: -90,
					legend: 'Hour of Day',
					legendOffset: -40,
				}}
				axisRight={null}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Day of Week',
					legendOffset: 40,
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Day',
					legendOffset: -70,
				}}
				colors="YlGn"
				emptyColor="#eeeeee"
				nodeOpacity={1}
				borderWidth={0}
				borderColor={{ from: 'inherit', modifiers: ['darker', 0.4] }}
				labelTextColor={{ from: 'inherit', modifiers: ['darker', 1.8] }}
				legends={[
					{
						anchor: 'bottom-right',
						direction: 'column',
						translateX: 120,
						itemCount: 4,
						itemWidth: 100,
						itemHeight: 20,
						itemDirection: 'left-to-right',
						itemsSpacing: 2,
						textOffset: 10,
						symbolSize: 12,
						symbolShape: 'circle',
						// effects: [
						// 	{
						// 		on: 'hover',
						// 		style: {
						// 			itemOpacity: 1,
						// 		},
						// 	},
						// ],
					},
				]}
				tooltip={({ xKey, yKey, value }) => (
					<div style={{
						background: 'white',
						padding: '9px 12px',
						border: '1px solid #ccc',
					}}>
						<strong>{yKey}</strong>, Hour <strong>{xKey}</strong>: <strong>{value}</strong> postings
					</div>
				)}
			/>
		</Paper>
	);
};

export default WeeklyPostingHeatmap;
