import React, { useEffect, useState, useMemo } from "react";
import useApi from "../../../api/useApi";
import { Box, CircularProgress, Typography, Grid, Paper, Tooltip } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const YearlyHeatmap = ({ data }) => {
    const cellSize = 15;
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const dates = [];
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }

    const dataMap = new Map(data.map(d => [d.date, d.value]));

    const max = Math.max(...data.map(d => d.value), 0);
    const colorScale = (value) => {
        if (value === 0) return '#ebedf0';
        if (value / max > 0.75) return '#216e39';
        if (value / max > 0.5) return '#30a14e';
        if (value / max > 0.25) return '#40c463';
        return '#9be9a8';
    };

    return (
        <svg width={cellSize * 53} height={cellSize * 7}>
            <g>
                {dates.map((date, index) => {
                    const week = Math.floor(index / 7);
                    const dayOfWeek = date.getDay();
                    const dateString = date.toISOString().split('T')[0];
                    const value = dataMap.get(dateString) || 0;
                    return (
                        <Tooltip title={`${value} applications on ${dateString}`} key={index}>
                            <rect
                                x={week * cellSize}
                                y={dayOfWeek * cellSize}
                                width={cellSize - 1}
                                height={cellSize - 1}
                                fill={colorScale(value)}
                            />
                        </Tooltip>
                    );
                })}
            </g>
        </svg>
    );
};

const FrequencyHeatmap = ({ data, title, colorScheme }) => {
    const cellSize = 15;
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dates = [...new Set(data.map(d => d._id))].sort();

    const dataMap = new Map();
    data.forEach(d => {
        d.hourlyData.forEach(h => {
            dataMap.set(`${d._id}-${h.hour}`, h.count);
        });
    });

    const max = Math.max(...Array.from(dataMap.values()), 0);
    const colorScale = (value) => {
        if (value === 0) return '#ebedf0';
        if (colorScheme === 'greens') {
            if (value / max > 0.75) return '#216e39';
            if (value / max > 0.5) return '#30a14e';
            if (value / max > 0.25) return '#40c463';
            return '#9be9a8';
        } else {
            if (value / max > 0.75) return '#0d47a1';
            if (value / max > 0.5) return '#1976d2';
            if (value / max > 0.25) return '#42a5f5';
            return '#90caf9';
        }
    };

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <svg width="100%" height={cellSize * 24}>
                <g>
                    {dates.map((date, dateIndex) => {
                        return hours.map(hour => {
                            const value = dataMap.get(`${date}-${hour}`) || 0;
                            return (
                                <Tooltip title={`${value} events on ${date} at ${hour}:00`} key={`${date}-${hour}`}>
                                    <rect
                                        x={dateIndex * cellSize}
                                        y={hour * cellSize}
                                        width={cellSize - 1}
                                        height={cellSize - 1}
                                        fill={colorScale(value)}
                                    />
                                </Tooltip>
                            );
                        });
                    })}
                </g>
            </svg>
        </Paper>
    );
};

const DailyApplication = () => {
    const { get } = useApi();
    const [yearlyData, setYearlyData] = useState([]);
    const [postingFrequencyData, setPostingFrequencyData] = useState([]);
    const [applicationFrequencyData, setApplicationFrequencyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
    const [endDate, setEndDate] = useState(dayjs());

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [yearlyRes, postingFreqRes, applicationFreqRes] = await Promise.all([
                    get("/reports/daily-applications"),
                    get(`/reports/job-posting-frequency?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
                    get(`/reports/job-application-frequency?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
                ]);

                if (yearlyRes.success) setYearlyData(yearlyRes.data || []);
                else setError(yearlyRes.error || "Failed to fetch yearly data");

                if (postingFreqRes.success) setPostingFrequencyData(postingFreqRes.data || []);
                else setError(postingFreqRes.error || "Failed to fetch posting frequency data");

                if (applicationFreqRes.success) setApplicationFrequencyData(applicationFreqRes.data || []);
                else setError(applicationFreqRes.error || "Failed to fetch application frequency data");

            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [get, startDate, endDate]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ p: 2, mb: 2, overflowX: 'auto' }}>
                <Typography variant="h6" gutterBottom>Yearly Application Insights</Typography>
                {yearlyData.length > 0 ? <YearlyHeatmap data={yearlyData} /> : <Typography>No yearly application data available.</Typography>}
            </Paper>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Weekly Insights</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item>
                                    <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
                                </Grid>
                                <Grid item>
                                    <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{ overflowX: 'auto' }}>
                    <FrequencyHeatmap data={postingFrequencyData} title="Job Posting Frequency" colorScheme="greens" />
                </Grid>
                <Grid item xs={12} sx={{ overflowX: 'auto' }}>
                    <FrequencyHeatmap data={applicationFrequencyData} title="Job Application Frequency" colorScheme="blues" />
                </Grid>
            </Grid>
        </Box>
    );
};

export default DailyApplication;
