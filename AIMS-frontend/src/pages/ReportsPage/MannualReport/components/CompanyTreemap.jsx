import { ResponsiveTreeMap } from '@nivo/treemap';
import { Paper, Typography } from '@mui/material';

const CompanyTreemap = ({ data }) => {
	// Nivo Treemap expects data in a hierarchical format with 'name' and 'children' or 'value'.
	// Our backend returns an array of { name: "Company Name", size: count }.
	// We need to transform this into a root node with children.

	const transformedData = {
		name: 'Companies',
		children: data.map(item => ({
			name: item.name,
			loc: item.size, // Nivo uses 'loc' for the value in leaf nodes
		})),
	};

	return (
		<Paper elevation={3} sx={{ p: 2, height: 400 }}>
			<Typography variant="h6">My Company Focus</Typography>
			<ResponsiveTreeMap
				data={transformedData}
				identity="name"
				value="loc"
				colors={{ scheme: 'nivo' }}
				margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
				labelSkipSize={12}
				labelTextColor={{
					from: 'colors',
					gamma: 'darker',
					mod: 0.8,
				}}
				parentLabelTextColor={{
					from: 'colors',
					gamma: 'darker',
					mod: 1.5,
				}}
				borderColor={{
					from: 'colors',
					gamma: 'darker',
					mod: 0.1,
				}}
				outerPadding={4}
				innerPadding={1}
				borderWidth={1}
				enableLabel={true}
				tooltip={({ node }) => (
					<div style={{
						background: 'white',
						padding: '9px 12px',
						border: '1px solid #ccc',
						color: node.color,
					}}>
						<strong>{node.id}</strong>: {node.value} applications
					</div>
				)}
			/>
		</Paper>
	);
};

export default CompanyTreemap;
