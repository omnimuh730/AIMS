
import { useEffect, useState } from 'react';
import { useApi } from '../../../api/useApi';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';

const MannualReportPage = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const { get } = useApi();

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const { data } = await get('/jobs/stats');
				setStats(data);
			} catch (error) {
				console.error('Failed to fetch job stats', error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [get]);

	if (loading) {
		return <CircularProgress />;
	}

	if (!stats) {
		return <Typography>No data available</Typography>;
	}

	const { dailyStats, appliedStats } = stats;

	const allDates = [...new Set([
		...dailyStats.map(d => d._id),
		...appliedStats.map(d => d._id)
	])].sort();

	const jobSources = [...new Set(dailyStats.flatMap(d => d.sources.map(s => s.source)))];

	const lineChartData = {
		xAxis: [{ data: allDates, scaleType: 'band' }],
		series: jobSources.map(source => ({
			data: allDates.map(date => {
				const dayData = dailyStats.find(d => d._id === date);
				const sourceData = dayData?.sources.find(s => s.source === source);
				return sourceData?.count || 0;
			}),
			label: source,
		})),
	};

	const appliedChartData = {
		xAxis: [{ data: allDates, scaleType: 'band' }],
		series: [
			{
				data: allDates.map(date => {
					const dayData = appliedStats.find(d => d._id === date);
					return dayData?.count || 0;
				}),
				label: 'Applications',
			},
		],
	};

	const scatterChartData = dailyStats.flatMap(d => d.sources.map(s => ({ x: new Date(d._id).getTime(), y: s.count, source: s.source })));

	const pieChartData = jobSources.map(source => ({
		label: source,
		value: dailyStats.reduce((acc, d) => {
			const sourceData = d.sources.find(s => s.source === source);
			return acc + (sourceData?.count || 0);
		}, 0),
	}));

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
			<Paper elevation={3} sx={{ p: 2 }}>
				<Typography variant="h6">Daily Job Postings</Typography>
				<LineChart
					{...lineChartData}
					height={300}
				/>
			</Paper>
			<Paper elevation={3} sx={{ p: 2 }}>
				<Typography variant="h6">Daily Applications</Typography>
				<BarChart
					{...appliedChartData}
					height={300}
				/>
			</Paper>
			<Paper elevation={3} sx={{ p: 2 }}>
				<Typography variant="h6">Job Posting Distribution</Typography>
				<ScatterChart
					series={[{ data: scatterChartData, label: 'Job Postings' }]}
					height={300}
					xAxis={[{ type: 'time' }]}
				/>
			</Paper>
			<Paper elevation={3} sx={{ p: 2 }}>
				<Typography variant="h6">Job Source Distribution</Typography>
				<PieChart
					series={[{ data: pieChartData }]}
					height={300}
				/>
			</Paper>
		</Box>
	);
};

export default MannualReportPage;
