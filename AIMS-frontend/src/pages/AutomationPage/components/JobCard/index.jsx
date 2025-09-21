
import React from 'react';
import { Card, CardContent, Divider, Box, Grid } from "@mui/material";
import JobCardHeader from "./JobCardHeader";
import JobCardDetails from "./JobCardDetails";
import JobCardActions from "./JobCardActions";
import MatchPanel from "./MatchPanel";

const JobCard = ({ job, userSkills, onViewDetails, onAskgllama, onApply, onUpdateStatus, onUnapply, checked, onCheck }) => (
	<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
		<input
			type="checkbox"
			checked={checked}
			onChange={e => onCheck && onCheck(e.target.checked)}
			style={{ marginRight: 12, marginLeft: 8 }}
		/>
		<Grid container component={Card} variant="outlined" sx={{ flexGrow: 1, overflow: 'hidden' }}>
			<Grid size={{ xs: 12, sm: true }}>
				<CardContent>
					<JobCardHeader
						company={{
							...job.company,
							title: job.title,
						}}
						postedAgo={job.postedAgo}
						postedAt={job.postedAt}
						applied={!!job.status}
						tags={job.tags}
					/>
					<Divider sx={{ my: 1 }} />
					<JobCardDetails details={job.details} />
					<JobCardActions
						applicants={job.applicants}
						applyLink={job.applyLink}
						onViewDetails={() => onViewDetails(job)}
						onAskgllama={onAskgllama}
						onApply={onApply}
						onUpdateStatus={onUpdateStatus}
						onUnapply={onUnapply}
						job={job}
					/>
				</CardContent>
			</Grid>
			<Grid size={{ xs: 12, sm: 'auto' }}>
				<MatchPanel job={job} userSkills={userSkills} />
			</Grid>
		</Grid>
	</Box>
);

export default JobCard;
