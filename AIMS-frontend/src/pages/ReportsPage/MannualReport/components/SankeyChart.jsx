// frontend/components/SankeyChart.js

import React from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';

const SankeyChart = ({ data }) => {
	// Check if data is available and has the expected structure
	if (!data || !data.nodes || !data.links || data.nodes.length === 0) {
		return <p>No Sankey data available.</p>;
	}

	return (
		<ResponsiveContainer width="100%" height={500}>
			<Sankey
				data={data}
				// The node prop is a function that returns the element to render.
				// The key must be on the top-level element returned by this function.
				node={({ x, y, width, height, payload }) => {
					// Heuristic to position the text to the left or right of the node
					// Adjust the value (e.g., 300) based on your chart's typical layout
					const isRightSide = x > 300;
					return (
						// Use a group <g> element as the parent, and give it the stable key.
						<g key={payload.name}>
							<Rectangle
								x={x}
								y={y}
								width={width}
								height={height}
								fill="#8884d8"
								fillOpacity="1"
							/>
							{/* Add a text label for the node */}
							<text
								textAnchor={isRightSide ? 'end' : 'start'}
								x={isRightSide ? x - 6 : x + width + 6}
								y={y + height / 2}
								dy="0.35em"
								fill="#333"
								fontSize={12}
							>
								{payload.name}
							</text>
						</g>
					);
				}}
				link={{ stroke: '#777', strokeOpacity: 0.5 }}
				nodeWidth={15}
				nodePadding={50}
				iterations={32}
				// Add margins to ensure the labels are not cut off at the edges
				margin={{ top: 20, right: 150, bottom: 20, left: 150 }}
			>
				<Tooltip />
			</Sankey>
		</ResponsiveContainer>
	);
};

export default SankeyChart;