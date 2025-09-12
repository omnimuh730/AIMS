import {
	Paper,
	Stack
} from '@mui/material';

const AgentPage = () => {
	return (
		<div>
			<Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
				<Stack spacing={3}>
					<h1>Agent</h1>
				</Stack>
			</Paper>
		</div>
	);
};

export default AgentPage;