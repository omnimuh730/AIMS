import { useEffect, useState } from 'react';
import useApi from '../../../api/useApi';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, CircularProgress, Paper, Typography, Grid } from '@mui/material';
import KpiCard from './components/KpiCard';
import SankeyChart from './components/SankeyChart';
import CompanyTreemap from './components/CompanyTreemap';
import SkillsDotPlot from './components/SkillsDotPlot';
import JobTitleStackedBar from './components/JobTitleStackedBar';
import CalendarHeatmapChart from './components/CalendarHeatmap';
import JobPostingStreamgraph from './components/JobPostingStreamgraph';
import WeeklyPostingHeatmap from './components/WeeklyPostingHeatmap';
import JobSpaceScatterPlot from './components/JobSpaceScatterPlot';
import SkillProfileRadarChart from './components/SkillProfileRadarChart';
import SkillSynergyHeatmap from './components/SkillSynergyHeatmap';
import ApplicationResponseLatencyBoxPlot from './components/ApplicationResponseLatencyBoxPlot';

const MannualReportPage = () => {
	const [stats, setStats] = useState(null);
	const [kpis, setKpis] = useState(null);
	const [sankeyData, setSankeyData] = useState(null);
	const [companyFocus, setCompanyFocus] = useState(null);
	const [targetedSkills, setTargetedSkills] = useState(null);
	const [jobTitleBreakdown, setJobTitleBreakdown] = useState(null);
	const [applicationRhythm, setApplicationRhythm] = useState(null);
	const [jobPostingVelocity, setJobPostingVelocity] = useState(null);
	const [weeklyPostingCadence, setWeeklyPostingCadence] = useState(null);
	const [jobSpaceData, setJobSpaceData] = useState(null);
	const [skillProfileAlignment, setSkillProfileAlignment] = useState(null);
	const [skillSynergy, setSkillSynergy] = useState(null);
	const [applicationResponseLatency, setApplicationResponseLatency] = useState(null);
	const [loading, setLoading] = useState(true);
	const { get } = useApi();

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				const [statsData, kpisData, sankeyResponse, companyFocusData, targetedSkillsData, jobTitleBreakdownData, applicationRhythmData, jobPostingVelocityData, weeklyPostingCadenceData, jobSpaceDataResponse, skillProfileAlignmentData, skillSynergyData, applicationResponseLatencyData] = await Promise.all([
					get('/api/jobs/stats'),
					get('/api/jobs/kpis'),
					get('/api/jobs/sankey'),
					get('/api/jobs/company-focus'),
					get('/api/jobs/targeted-skills'),
					get('/api/jobs/job-title-breakdown'),
					get('/api/jobs/application-rhythm'),
					get('/api/jobs/posting-velocity'),
					get('/api/jobs/posting-cadence'),
					get('/api/jobs/job-space'),
					get('/api/jobs/skill-profile-alignment'),
					get('/api/jobs/skill-synergy'),
					get('/api/jobs/response-latency'),
				]);
				setStats(statsData);
				setKpis(kpisData.kpis);
				setSankeyData(sankeyResponse.data);
				setCompanyFocus(companyFocusData.data);
				setTargetedSkills(targetedSkillsData.data);
				setJobTitleBreakdown(jobTitleBreakdownData.data);
				setApplicationRhythm(applicationRhythmData.data);
				setJobPostingVelocity(jobPostingVelocityData.data);
				setWeeklyPostingCadence(weeklyPostingCadenceData.data);
				setJobSpaceData(jobSpaceDataResponse.data);
				setSkillProfileAlignment(skillProfileAlignmentData.data);
				setSkillSynergy(skillSynergyData);
				setApplicationResponseLatency(applicationResponseLatencyData.data);
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

	if (!stats || !kpis || !sankeyData || !companyFocus || !targetedSkills || !jobTitleBreakdown || !applicationRhythm || !jobPostingVelocity || !weeklyPostingCadence || !jobSpaceData || !skillProfileAlignment || !skillSynergy || !applicationResponseLatency) {
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
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<KpiCard title="Total Applications" value={kpis.totalApplications} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<KpiCard title="Active Applications" value={kpis.activeApplications} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<KpiCard title="Interview Rate" value={kpis.interviewRate.toFixed(2)} unit="%" />
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<KpiCard title="Application Velocity" value={kpis.applicationVelocity.toFixed(2)} unit="/ week" />
				</Grid>
			</Grid>

			<Paper elevation={3} sx={{ p: 2, mt: 4 }}>
				<Typography variant="h6">Application Flow</Typography>
				<SankeyChart data={sankeyData} />
			</Paper>
			<Typography variant="h4" sx={{ mt: 4 }}>Market Microstructure</Typography>
			<JobPostingStreamgraph data={jobPostingVelocity} />


			<Typography variant="h4" sx={{ mt: 4 }}>The Opportunity Landscape</Typography>
			<JobSpaceScatterPlot data={jobSpaceData} />

			<Typography variant="h4" sx={{ mt: 4 }}>My Application Habits</Typography>
			<CalendarHeatmapChart data={applicationRhythm} />

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
			<Typography variant="h4" sx={{ mt: 4 }}>My Targeting Analysis</Typography>
			<CompanyTreemap data={companyFocus} />
			<SkillsDotPlot data={targetedSkills} />
			<JobTitleStackedBar data={jobTitleBreakdown} />
			<SkillProfileRadarChart data={skillProfileAlignment} />
			<WeeklyPostingHeatmap data={weeklyPostingCadence} />
		</Box>
	);
};

export default MannualReportPage;
/*

			<ApplicationResponseLatencyBoxPlot data={applicationResponseLatency} />
			<SkillSynergyHeatmap data={skillSynergy.data} keys={skillSynergy.keys} />

			*/

/*
	
*/