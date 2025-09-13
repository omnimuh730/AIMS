import React, { useState, useEffect } from 'react';
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
	Autocomplete,
	Chip,
} from '@mui/material';
import useDebouncedValue from '../../../utils/useDebouncedValue';

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
	debounceMs = 600,
}) => {
	// Local state to avoid bubbling every keystroke to parent
	const [localSearch, setLocalSearch] = useState(searchQuery || '');
	const [localCompany, setLocalCompany] = useState(filters['company.name'] || '');
	const [localPosition, setLocalPosition] = useState(filters['details.position'] || '');
	const [localRemote, setLocalRemote] = useState(filters['details.remote'] || '');
	const [localTime, setLocalTime] = useState(filters['details.time'] || '');
	const [localTags, setLocalTags] = useState(Array.isArray(filters['company.tags']) ? filters['company.tags'] : (filters['company.tags'] ? String(filters['company.tags']).split(',').map(s => s.trim()).filter(Boolean) : []));

	// Keep local state in sync when parent filters/search change externally
	useEffect(() => setLocalSearch(searchQuery || ''), [searchQuery]);
	useEffect(() => setLocalCompany(filters['company.name'] || ''), [filters]);
	useEffect(() => setLocalPosition(filters['details.position'] || ''), [filters]);
	useEffect(() => setLocalRemote(filters['details.remote'] || ''), [filters]);
	useEffect(() => setLocalTime(filters['details.time'] || ''), [filters]);
	useEffect(() => setLocalTags(Array.isArray(filters['company.tags']) ? filters['company.tags'] : (filters['company.tags'] ? String(filters['company.tags']).split(',').map(s => s.trim()).filter(Boolean) : [])), [filters]);

	const debouncedSearch = useDebouncedValue(localSearch, debounceMs);
	const debouncedCompany = useDebouncedValue(localCompany, debounceMs);
	const debouncedPosition = useDebouncedValue(localPosition, debounceMs);

	// When debounced values change, notify parent
	useEffect(() => {
		onSearchChange && onSearchChange(debouncedSearch);
	}, [debouncedSearch]);

	useEffect(() => {
		const next = { ...filters };
		if (debouncedCompany && debouncedCompany.trim() !== '') next['company.name'] = debouncedCompany.trim(); else delete next['company.name'];
		if (debouncedPosition && debouncedPosition.trim() !== '') next['details.position'] = debouncedPosition.trim(); else delete next['details.position'];
		if (localRemote && localRemote !== '') next['details.remote'] = localRemote; else delete next['details.remote'];
		if (localTime && localTime !== '') next['details.time'] = localTime; else delete next['details.time'];
		if (Array.isArray(localTags) && localTags.length) next['company.tags'] = localTags; else delete next['company.tags'];

		// call parent only if next differs from current filters
		try {
			const same = JSON.stringify(next) === JSON.stringify(filters);
			if (!same) onFiltersChange(next);
		} catch (e) {
			onFiltersChange(next);
		}
		// include filters so we compare against latest prop
	}, [debouncedCompany, debouncedPosition, localRemote, localTime, localTags, filters, onFiltersChange]);

	return (
		<Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
			<Grid container spacing={2} alignItems="center">
				<Grid item xs={12} md={5}>
					<TextField
						fullWidth
						variant="outlined"
						label="Search Jobs (title only)"
						value={localSearch}
						onChange={(e) => setLocalSearch(e.target.value)}
						placeholder="Search by job title"
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
				<Grid item xs={12} md={5}>
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
							value={localCompany}
							onChange={(e) => setLocalCompany(e.target.value)}
						/>
						<TextField
							label="Position / Location"
							size="small"
							value={localPosition}
							onChange={(e) => setLocalPosition(e.target.value)}
						/>
						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>Remote</InputLabel>
							<Select
								value={localRemote || ''}
								onChange={(e) => setLocalRemote(e.target.value)}
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
								value={localTime || ''}
								onChange={(e) => setLocalTime(e.target.value)}
								label="Time"
							>
								<MenuItem value="">Any</MenuItem>
								<MenuItem value="Full-time">Full-time</MenuItem>
								<MenuItem value="Part-time">Part-time</MenuItem>
								<MenuItem value="Contract">Contract</MenuItem>
							</Select>
						</FormControl>
						<Autocomplete
							multiple
							freeSolo
							options={[]}
							value={localTags}
							onChange={(e, value) => setLocalTags(value)}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => (
									<Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
								))
							}
							renderInput={(params) => (
								<TextField {...params} label="Tags" size="small" />
							)}
						/>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SmartToolbar;
