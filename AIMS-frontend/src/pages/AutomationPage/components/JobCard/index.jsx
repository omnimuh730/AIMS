
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
		<Grid container spacing={0} component={Card} variant="outlined" sx={{ flexGrow: 1, overflow: 'hidden' }}>
			<Grid size={{ xs: 12, md: 9 }}
				sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
			>
				<CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
					<Box sx={{ mt: "auto" }}>
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
					</Box>
				</CardContent>
			</Grid>
			<Grid size={{ xs: 12, md: 3 }}>
				<MatchPanel job={job} userSkills={userSkills} />
			</Grid>
		</Grid>
	</Box>
);

export default JobCard;
