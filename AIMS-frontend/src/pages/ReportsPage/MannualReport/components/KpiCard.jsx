import { Card, CardContent, Typography } from '@mui/material';

const KpiCard = ({ title, value, unit }) => {
	return (
		<Card>
			<CardContent>
				<Typography variant="h6" color="text.secondary">
					{title}
				</Typography>
				<Typography variant="h4">
					{value}
					{unit && <Typography variant="h6" component="span"> {unit}</Typography>}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default KpiCard;
