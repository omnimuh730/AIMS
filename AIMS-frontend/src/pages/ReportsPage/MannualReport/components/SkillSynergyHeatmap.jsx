import { ResponsiveHeatMap } from '@nivo/heatmap';
import { Paper, Typography } from '@mui/material';

const SkillSynergyHeatmap = ({ data, keys }) => {
	// Data format for Nivo Heatmap:
	// [{
	//   "id": "Skill A",
	//   "data": [
	//     { "x": "Skill B", "y": "Count" },
	//     ...
	//   ]
	// }, ...]

	const allValues = data.flatMap(d => keys.map(k => d[k]));
	const minValue = Math.min(...allValues, 0);
	const maxValue = Math.max(...allValues, 1);

	return (
		<Paper elevation={3} sx={{ p: 2, height: 600 }}>
			<Typography variant="h6">In-Demand Skill Synergy</Typography>
			<ResponsiveHeatMap
				data={data}
				keys={keys}
				indexBy="id"
				margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
				forceSquare={true}
				minValue={minValue}
				maxValue={maxValue}
				axisTop={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: -90,
					legend: 'Skill A',
					legendOffset: -40,
				}}
				axisRight={null}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Skill B',
					legendOffset: 40,
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Skill',
					legendOffset: -70,
				}}
				colors={{ type: 'sequential', scheme: 'greens' }}
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
					},
				]}
				tooltip={({ xKey, yKey, value }) => (
					<div style={{
						background: 'white',
						padding: '9px 12px',
						border: '1px solid #ccc',
					}}>
						<strong>{yKey}</strong> and <strong>{xKey}</strong>: <strong>{value}</strong> co-occurrences
					</div>
				)}
			/>
		</Paper>
	);
};

export default SkillSynergyHeatmap;
