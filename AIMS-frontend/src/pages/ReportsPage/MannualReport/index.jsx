import { useEffect, useState } from 'react';
import useApi from '../../../api/useApi';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, CircularProgress, Paper, Typography, Grid } from '@mui/material';
import KpiCard from './components/KpiCard';

const MannualReportPage = () => {
	const [stats, setStats] = useState(null);
	const [kpis, setKpis] = useState(null);
	const [loading, setLoading] = useState(true);
	const { get } = useApi();

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				const [statsData, kpisData] = await Promise.all([
					get('/api/jobs/stats'),
					get('/api/jobs/kpis'),
				]);
				setStats(statsData);
				setKpis(kpisData.kpis);
			} catch (error) {
				console.error('Failed to fetch report data', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAllData();
	}, [get]);

	if (loading) {
		return <CircularProgress />;
	}

	if (!stats || !kpis) {
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
			<Typography variant="h4">Command Center Overview</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Total Applications" value={kpis.totalApplications} />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Active Applications" value={kpis.activeApplications} />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Interview Rate" value={kpis.interviewRate.toFixed(2)} unit="%" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Application Velocity" value={kpis.applicationVelocity.toFixed(2)} unit="/ week" />
				</Grid>
			</Grid>

			<Typography variant="h4" sx={{ mt: 4 }}>Legacy Reports</Typography>
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
