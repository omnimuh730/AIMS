import React from 'react';

import {
	Box,
	Container,
	Typography,
} from '@mui/material';

import {

} from '@mui/icons-material';

import DailyApplication from './DailyApplication';


const AIReportPage = () => {
	return (
		<Container maxWidth="xl">
			<Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mt: 4 }}>
				AI Report Page
			</Typography>
			<Box sx={{ mt: 4 }}>
				<Typography variant="body1">
					Daily Applicants
				</Typography>
				<DailyApplication />
			</Box>
		</Container>
	)
}

export default AIReportPage;