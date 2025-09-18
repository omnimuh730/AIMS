import React from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';

const SankeyChart = ({ data }) => {
	// Recharts Sankey requires nodes to have a 'name' and links to have 'source', 'target', and 'value'.
	// Source and target are indices of the nodes array.

	// Check if data is available and has the expected structure
	if (!data || !data.nodes || !data.links || data.nodes.length === 0) {
		return <p>No Sankey data available.</p>;
	}

	return (
		<ResponsiveContainer width="100%" height={400}>
			<Sankey
				data={data}
				nodeWidth={10}
				nodePadding={60}
				linkCurvature={0.5}
				iterations={32}
			>
				<Tooltip />
			</Sankey>
		</ResponsiveContainer>
	);
};

export default SankeyChart;
