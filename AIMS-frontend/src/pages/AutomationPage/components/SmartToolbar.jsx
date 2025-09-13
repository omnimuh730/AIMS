import React from 'react';
import {
	Box,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Stack,
	Pagination,
	Typography,
	Grid,
} from '@mui/material';

const SmartToolbar = ({
	searchQuery,
	onSearchChange,
	sortOption,
	onSortChange,
	pagination,
	onPageChange,
	onLimitChange,
	// new advanced filters
	filters = {},
	onFiltersChange = () => { },
}) => {
	return (
		<Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
			<Grid container spacing={2} alignItems="center">
				<Grid item xs={12} md={4}>
					<TextField
						fullWidth
						variant="outlined"
						label="Search Jobs"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} md={2}>
					<FormControl fullWidth variant="outlined">
						<InputLabel>Sort By</InputLabel>
						<Select
							value={sortOption}
							onChange={(e) => onSortChange(e.target.value)}
							label="Sort By"
						>
							<MenuItem value="_createdAt_desc">Newest</MenuItem>
							<MenuItem value="_createdAt_asc">Oldest</MenuItem>
							<MenuItem value="title_asc">Title (A-Z)</MenuItem>
							<MenuItem value="title_desc">Title (Z-A)</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} md={6}>
					<Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
						<Typography variant="body2" color="text.secondary">
							Page {pagination.page} of {pagination.totalPages}
						</Typography>
						<Pagination
							count={pagination.totalPages}
							page={pagination.page}
							onChange={(e, value) => onPageChange(value)}
							color="primary"
							size="small"
						/>
						<FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
							<InputLabel>Per Page</InputLabel>
							<Select
								value={pagination.limit}
								onChange={(e) => onLimitChange(e.target.value)}
								label="Per Page"
							>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={25}>25</MenuItem>
								<MenuItem value={50}>50</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</Grid>
				{/* Advanced filters row */}
				<Grid item xs={12}>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
						<TextField
							label="Company"
							size="small"
							value={filters['company.name'] || ''}
							onChange={(e) => onFiltersChange({ ...filters, ['company.name']: e.target.value })}
						/>
						<TextField
							label="Position / Location"
							size="small"
							value={filters['details.position'] || ''}
							onChange={(e) => onFiltersChange({ ...filters, ['details.position']: e.target.value })}
						/>
						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>Remote</InputLabel>
							<Select
								value={filters['details.remote'] || ''}
								onChange={(e) => onFiltersChange({ ...filters, ['details.remote']: e.target.value })}
								label="Remote"
							>
								<MenuItem value="">Any</MenuItem>
								<MenuItem value="Remote">Remote</MenuItem>
								<MenuItem value="Onsite">Onsite</MenuItem>
								<MenuItem value="Hybrid">Hybrid</MenuItem>
							</Select>
						</FormControl>
						<FormControl size="small" sx={{ minWidth: 160 }}>
							<InputLabel>Time</InputLabel>
							<Select
								value={filters['details.time'] || ''}
								onChange={(e) => onFiltersChange({ ...filters, ['details.time']: e.target.value })}
								label="Time"
							>
								<MenuItem value="">Any</MenuItem>
								<MenuItem value="Full-time">Full-time</MenuItem>
								<MenuItem value="Part-time">Part-time</MenuItem>
								<MenuItem value="Contract">Contract</MenuItem>
							</Select>
						</FormControl>
						<TextField
							label="Tags (comma separated)"
							size="small"
							value={filters['company.tags'] || ''}
							onChange={(e) => onFiltersChange({ ...filters, ['company.tags']: e.target.value })}
							helperText="e.g. Health Care,Hospital"
						/>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SmartToolbar;
