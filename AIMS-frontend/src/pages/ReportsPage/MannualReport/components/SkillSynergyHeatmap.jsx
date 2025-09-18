import { ResponsiveHeatMap } from '@nivo/heatmap';
import { Paper, Typography, CircularProgress, Box } from '@mui/material';

const SkillSynergyHeatmap = ({ data, keys }) => {
	// --- GUARD CLAUSE ---
	// Prevent rendering if props are not ready. This is the crucial fix.
	if (!data || !keys || data.length === 0 || keys.length === 0) {
		// You can return null or a loading indicator
		return (
			<Paper elevation={3} sx={{ p: 2, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Box textAlign="center">
					<CircularProgress />
					<Typography mt={2}>Loading Synergy Data...</Typography>
				</Box>
			</Paper>
		);
	}

	// This code will now only run when `data` and `keys` are valid arrays.
	const allValues = data.flatMap(d => keys.map(k => d[k] || 0));
	const minValue = Math.min(...allValues);
	const maxValue = Math.max(...allValues);

	return (
		<Paper elevation={3} sx={{ p: 2, height: 600 }}>
			<Typography variant="h6">In-Demand Skill Synergy</Typography>
			<ResponsiveHeatMap
				data={data}
				keys={keys}
				indexBy="id"
				margin={{ top: 80, right: 90, bottom: 60, left: 90 }}
				forceSquare={true}
				minValue={minValue}
				maxValue={maxValue}
				axisTop={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: -45, // Use -45 for better readability than -90
					legend: '',
					legendOffset: -70,
				}}
				axisRight={null}
				axisBottom={null}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Skills',
					legendPosition: 'middle',
					legendOffset: -70,
				}}
				colors={{ type: 'sequential', scheme: 'greens' }}
				emptyColor="#eeeeee"
				nodeOpacity={1}
				borderWidth={1}
				borderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
				labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
				legends={[
					{
						anchor: 'bottom',
						direction: 'row',
						translateY: 50, // Adjusted for more space
						itemCount: 5,
						itemWidth: 80,
						itemHeight: 20,
						symbolSize: 12,
					},
				]}
				tooltip={({ xKey, yKey, value, color }) => (
					<div style={{
						background: 'white',
						padding: '9px 12px',
						border: '1px solid #ccc',
						display: 'flex',
						alignItems: 'center',
					}}>
						<div style={{ width: 12, height: 12, backgroundColor: color, marginRight: 8 }} />
						<strong>{yKey}</strong> + <strong>{xKey}</strong>: <strong>{value}</strong>
					</div>
				)}
			/>
		</Paper>
	);
};

export default SkillSynergyHeatmap;