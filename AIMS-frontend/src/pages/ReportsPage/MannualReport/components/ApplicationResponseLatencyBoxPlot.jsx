import { ResponsiveBoxPlot } from '@nivo/boxplot';
import { Paper, Typography, CircularProgress, Box } from '@mui/material';

const ApplicationResponseLatencyBoxPlot = ({ data }) => {
	// --- GUARD CLAUSE ---
	// Handle cases where data might not be ready or is empty.
	if (!data || data.length === 0) {
		return (
			<Paper elevation={3} sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Typography>No latency data available</Typography>
			</Paper>
		);
	}

	// --- DATA TRANSFORMATION ---
	// Convert the backend's grouped format to the flat format Nivo BoxPlot expects.
	const nivoData = data.flatMap(sourceData =>
		sourceData.latencies
			// Filter out any null/undefined values to prevent errors
			.filter(latency => latency !== null && latency !== undefined)
			// Create an object for each individual latency value
			.map(latencyValue => ({
				group: sourceData.source,
				value: latencyValue,
			}))
	);

	// If after transformation there's no data, show a message.
	if (nivoData.length === 0) {
		return (
			<Paper elevation={3} sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Typography>No valid latency data points found</Typography>
			</Paper>
		);
	}

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">Application Response Latency by Source</Typography>
			<ResponsiveBoxPlot
				data={nivoData} // <-- Use the transformed data
				// groupBy="group" is the default, no need to specify.
				// The 'groups' prop is invalid for BoxPlot and has been removed.
				value="value" // <-- Tell Nivo to use the 'value' property for calculations
				margin={{ top: 40, right: 110, bottom: 60, left: 60 }}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Platform', // <-- Corrected legend
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
				medianColor={{ theme: 'background' }} // Use theme for better contrast
				whiskerColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
				borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
				tooltip={({ group, value }) => ( // <-- Simplified tooltip props
					<div style={{
						background: 'white',
						padding: '9px 12px',
						border: '1px solid #ccc',
						color: 'black'
					}}>
						<strong>{group}</strong><br />
						Latency: {value.toFixed(1)} days
					</div>
				)}
			/>
		</Paper>
	);
};

export default ApplicationResponseLatencyBoxPlot;