import { ResponsiveBoxPlot } from '@nivo/boxplot';
import { Paper, Typography } from '@mui/material';

const ApplicationResponseLatencyBoxPlot = ({ data }) => {
	// Data format for Nivo Box Plot:
	// [
	//   { "group": "LinkedIn", "value": 10 },
	//   { "group": "LinkedIn", "value": 12 },
	//   ...
	// ]

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">Application Response Latency</Typography>
			<ResponsiveBoxPlot
				data={data}
				groups={['source', 'dayOfWeek']}
				value="latency"
				valueFormat=">-.2f"
				margin={{ top: 40, right: 110, bottom: 60, left: 60 }}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Platform / Day of Week',
					legendPosition: 'middle',
					legendOffset: 32,
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Latency (Days)',
					legendPosition: 'middle',
					legendOffset: -40,
				}}
				colors={{ scheme: 'nivo' }}
				medianColor="#ffffff"
				whiskerColor="#ffffff"
				borderWidth={2}
				borderColor={{ from: 'color', modifiers: ['darker', 0.3] }}
				boxOpacity={0.8}
				boxBorderWidth={1}
				boxBorderColor={{ from: 'color', modifiers: ['darker', 0.3] }}
				tooltip={({ value, group, variable }) => (
					<div style={{
						background: 'white',
						padding: '9px 12px',
						border: '1px solid #ccc',
					}}>
						<strong>{group}</strong> - <strong>{variable}</strong><br/>
						Latency: {value.toFixed(2)} days
					</div>
				)}
			/>
		</Paper>
	);
};

export default ApplicationResponseLatencyBoxPlot;
