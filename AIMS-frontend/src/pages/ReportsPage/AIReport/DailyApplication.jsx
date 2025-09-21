import React, { useMemo } from "react";
import * as d3 from "d3";

const ContributionGraph = ({ values }) => {
	const cellSize = 12; // block size
	const padding = 20;

	// Compute current year dates
	const year = new Date().getFullYear();
	const startDate = new Date(year, 0, 1); // Jan 1st
	const endDate = new Date(year, 11, 31); // Dec 31st
	const daysInYear = d3.timeDay.count(startDate, d3.timeDay.offset(endDate, 1));

	// Generate daily data
	const data = useMemo(() => {
		if (values) return values;

		const arr = [];
		for (let i = 0; i < daysInYear; i++) {
			const date = d3.timeDay.offset(startDate, i);
			arr.push({
				date,
				value: Math.floor(Math.random() * 200), // commits
			});
		}
		return arr;
	}, [values, daysInYear, startDate]);

	// Color scale (dynamic)
	const color = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.value) || 1])
		.range(["#e6f4ea", "#216e39"]);

	// Position each day by week + weekday
	const cells = data.map((d) => {
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
			{/* Month labels */}
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

			{/* Day labels */}
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

			{/* Heatmap cells */}
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
						{d3.timeFormat("%b %d, %Y")(d.date)}: {d.value} commits
					</title>
				</rect>
			))}
		</svg>
	);
};

export default ContributionGraph;
