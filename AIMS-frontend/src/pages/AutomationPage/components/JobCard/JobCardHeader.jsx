
import React from 'react';
import { Box, Avatar, Stack, Chip, Typography } from "@mui/material";
import { Check } from '@mui/icons-material';

const formatPostedAt = (postedAt) => {
	if (!postedAt) return null;
	try {
		const date = new Date(postedAt);
		return date.toLocaleString();
	} catch {
		return postedAt;
	}
};

const JobCardHeader = ({ company, postedAgo, postedAt, tags, applied }) => (
	<Box sx={{ display: "flex", alignItems: "start", mb: 1.5 }}>
		<Avatar
			src={company.logo || undefined}
			alt={`${company.name} logo`}
			variant="rounded"
			sx={{ width: 56, height: 56, mr: 2 }}
		>
			{!company.logo && company.name ? String(company.name).charAt(0).toUpperCase() : null}
		</Avatar>
		<Box sx={{ flexGrow: 1 }}>
			<Stack
				direction="row"
				spacing={1}
				sx={{ mb: 0.5, flexWrap: "wrap", gap: 0.5 }}
			>
				<Chip label={postedAgo} size="small" />
				{postedAt && <Chip label={formatPostedAt(postedAt)} size="small" color="success" />}
				{applied ? <Chip label="Applied" size="small" color="success" variant="filled" icon={<Check fontSize="small" />} /> : null}
				{Array.isArray(tags) && tags.map((tag) => (
					<Chip key={tag} label={tag} size="small" color="info" variant="outlined" />
				))}
			</Stack>
			<Typography variant="h6" component="div" fontWeight="bold">
				{company.title}
			</Typography>
			<Typography variant="body1" color="text.secondary">
				{company.name}
			</Typography>

			{/* Company tags (if any) */}
			{Array.isArray(company.tags) && company.tags.length > 0 && (
				<Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
					{company.tags.map(t => (
						<Chip key={t} label={t} size="small" variant="outlined" />
					))}
				</Stack>
			)}
		</Box>
	</Box>
);

export default JobCardHeader;
