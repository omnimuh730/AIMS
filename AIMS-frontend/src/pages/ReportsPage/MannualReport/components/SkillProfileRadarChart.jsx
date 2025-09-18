import { ResponsiveRadar } from '@nivo/radar';
import { Paper, Typography } from '@mui/material';

const SkillProfileRadarChart = ({ data }) => {
	// Data format for Nivo Radar:
	// [
	//   { "skillCategory": "Programming Languages", "applied": 80, "interviewed": 90 },
	//   ...
	// ]

	// If data is []
	if (!data || !data.keys || data.keys.length === 0) {
		return (
			<Paper elevation={3} sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Typography variant="h6">Skill Profile Alignment</Typography>
				<Typography variant="body1" sx={{ mt: 2 }}>No data available</Typography>
			</Paper>
		);
	}

	const chartData = data.keys.map(key => ({
		skillCategory: key,
		applied: data.applied[key],
		interviewed: data.interviewed[key],
	}));

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">Skill Profile Alignment</Typography>
			<ResponsiveRadar
				data={chartData}
				keys={['applied', 'interviewed']}
				indexBy="skillCategory"
				valueFormat=">-.0f"
				margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
				borderColor={{ from: 'color' }}
				gridLabelOffset={36}
				dotSize={10}
				dotColor={{ theme: 'background' }}
				dotBorderWidth={2}
				colors={{ scheme: 'nivo' }}
				blendMode="multiply"
				enableDotLabel={true}
				dotLabelYOffset={-12}
				legends={[
					{
						anchor: 'top-left',
						direction: 'column',
						translateX: -50,
						translateY: -40,
						itemWidth: 80,
						itemHeight: 20,
						itemTextColor: '#999',
						symbolSize: 12,
						symbolShape: 'circle',
						effects: [
							{
								on: 'hover',
								style: {
									itemTextColor: '#000',
								},
							},
						],
					},
				]}
			/>
		</Paper>
	);
};

export default SkillProfileRadarChart;
