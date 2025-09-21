import React, { useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import useApi from "../../../api/useApi";
import { Box, CircularProgress, Typography } from "@mui/material";

const ContributionGraph = ({ values }) => {
	const cellSize = 12; // block size
	const padding = 20;

	// Compute current year dates
	const year = new Date().getFullYear();
	const startDate = new Date(year, 0, 1); // Jan 1st
	const endDate = new Date(year, 11, 31); // Dec 31st

	// Color scale (dynamic)
	const color = d3
		.scaleLinear()
		.domain([0, d3.max(values, (d) => d.value) || 1])
		.range(["#e6f4ea", "#216e39"]);

	// Position each day by week + weekday
	const cells = values.map((d) => {
		const weekIndex = d3.timeWeek.count(startDate, d.date);
		const dayIndex = d.date.getDay(); // 0=Sun, … 6=Sat
		return { ...d, week: weekIndex, day: dayIndex };
	});

	const totalWeeks = d3.max(cells, (d) => d.week) + 1;

	return (
		<svg
			width={totalWeeks * (cellSize + 2) + 50}
			height={7 * (cellSize + 2) + padding * 2}
		>
			{d3.timeMonths(startDate, endDate).map((monthDate, i) => {
				const weekIndex = d3.timeWeek.count(startDate, monthDate);
				return (
					<text
						key={i}
						x={weekIndex * (cellSize + 2) + 40}
						y={10}
						fontSize="10"
						fill="#666"
					>
						{d3.timeFormat("%b")(monthDate)}
					</text>
				);
			})}

			{["Mon", "Wed", "Fri"].map((d, i) => (
				<text
					key={d}
					x={0}
					y={(i * 2 + 1) * (cellSize + 2) + 20}
					fontSize="10"
					fill="#666"
				>
					{d}
				</text>
			))}

			{cells.map((d) => (
				<rect
					key={d.date}
					x={d.week * (cellSize + 2) + 40}
					y={d.day * (cellSize + 2) + 15}
					width={cellSize}
					height={cellSize}
					rx={2}
					ry={2}
					fill={color(d.value)}
				>
					<title>
						{d3.timeFormat("%b %d, %Y")(d.date)}: {d.value} applications
					</title>
				</rect>
			))}
		</svg>
	);
};

const DailyApplication = () => {
	const { get } = useApi();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await get("/reports/daily-applications");
				if (response.success) {
					const parsedData = response.data.map(d => ({
						date: d3.timeParse("%Y-%m-%d")(d.date),
						value: d.value
					}));
					setData(parsedData);
				} else {
					setError(response.error || "Failed to fetch data");
				}
			} catch (err) {
				setError(err.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [get]);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	return <ContributionGraph values={data} />;
};

export default DailyApplication;