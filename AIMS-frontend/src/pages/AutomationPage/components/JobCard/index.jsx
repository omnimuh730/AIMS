
import React from 'react';
import { Card, CardContent, Divider, Box } from "@mui/material";
import JobCardHeader from "./JobCardHeader";
import JobCardDetails from "./JobCardDetails";
import JobCardActions from "./JobCardActions";
import MatchPanel from "./MatchPanel";

const JobCard = ({ job, userSkills, onViewDetails, onAskgllama, onApply, onUpdateStatus, onUnapply, checked, onCheck }) => (
	<Box sx={{ display: 'flex', alignItems: 'center' }}>
		<input
			type="checkbox"
			checked={checked}
			onChange={e => onCheck && onCheck(e.target.checked)}
			style={{ marginRight: 12, marginLeft: 8 }}
		/>
		{/* This is your original Card component, now acting as the left panel */}
		<Card
			variant="outlined"
			sx={{
				flexGrow: 1, // Allow this card to take up the remaining space
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0,
				transition: "box-shadow 0.3s",
				"&:hover": { boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)" },
			}}
		>
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
		</Card>

		{/* This is the new right panel for the percentage UI */}
		<MatchPanel job={job} userSkills={userSkills} />
	</Box>
);

export default JobCard;
