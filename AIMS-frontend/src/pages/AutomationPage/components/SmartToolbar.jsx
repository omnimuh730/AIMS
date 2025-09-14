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
	InputAdornment,
	Divider,
	useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import useDebouncedValue from './../../../utils/useDebouncedValue';

const SmartToolbar = ({
	searchQuery,
	onSearchChange,
	sortOption,
	onSortChange,
	pagination,
	onPageChange,
	onLimitChange,
	filters = {},
	onFiltersChange = () => { },
	debounceMs = 600,
	selectAllChecked = false,
	onSelectAll,
	onRemoveSelected,
	disableRemove = false,
	showLinkedInOnly = false,
	onShowLinkedInOnlyChange,
}) => {
	const theme = useTheme();
	const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

	// Local state to avoid bubbling every keystroke to parent
	const [localSearch, setLocalSearch] = useState(searchQuery || '');
	const [localCompany, setLocalCompany] = useState(filters['company.name'] || '');
	const [localPosition, setLocalPosition] = useState(filters['details.position'] || '');
	const [localRemote, setLocalRemote] = useState(filters['details.remote'] || '');
	const [localTime, setLocalTime] = useState(filters['details.time'] || '');
	const [localTags, setLocalTags] = useState(
		Array.isArray(filters['company.tags'])
			? filters['company.tags']
			: (filters['company.tags']
				? String(filters['company.tags'])
					.split(',')
					.map(s => s.trim())
					.filter(Boolean)
				: [])
	);

	// Keep local state in sync when parent filters/search change externally
	useEffect(() => setLocalSearch(searchQuery || ''), [searchQuery]);
	useEffect(() => setLocalCompany(filters['company.name'] || ''), [filters]);
	useEffect(() => setLocalPosition(filters['details.position'] || ''), [filters]);
	useEffect(() => setLocalRemote(filters['details.remote'] || ''), [filters]);
	useEffect(() => setLocalTime(filters['details.time'] || ''), [filters]);
	useEffect(() => setLocalTags(
		Array.isArray(filters['company.tags'])
			? filters['company.tags']
			: (filters['company.tags']
				? String(filters['company.tags'])
					.split(',')
					.map(s => s.trim())
					.filter(Boolean)
				: [])
	), [filters]);

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

		try {
			const same = JSON.stringify(next) === JSON.stringify(filters);
			if (!same) onFiltersChange(next);
		} catch (e) {
			onFiltersChange(next);
		}
	}, [debouncedCompany, debouncedPosition, localRemote, localTime, localTags, filters, onFiltersChange]);

	return (
		<Box
			sx={{
				p: { xs: 1.5, sm: 2 },
				bgcolor: 'background.paper',
				borderRadius: 2,
				border: '1px solid',
				borderColor: 'divider',
				backdropFilter: 'blur(6px)',
				mb: 2,
			}}
		>
			<Grid container spacing={2} alignItems="stretch">
				{/* Select All & Remove */}
				<Grid size={{ xs: 12 }}>
					<Stack direction="row" spacing={2} alignItems="center">
						<input
							type="checkbox"
							checked={selectAllChecked}
							onChange={e => onSelectAll && onSelectAll(e.target.checked)}
							style={{ marginRight: 8 }}
						/>
						<Typography variant="body2">Select All</Typography>
						<button
							onClick={onRemoveSelected}
							disabled={disableRemove}
							style={{ marginLeft: 16, padding: '4px 12px', borderRadius: 4, background: disableRemove ? '#eee' : '#d32f2f', color: '#fff', border: 'none', cursor: disableRemove ? 'not-allowed' : 'pointer' }}
						>
							Remove
						</button>
					</Stack>
				</Grid>
				{/* Search */}
				<Grid size={{ xs: 12, md: 4 }}>
					<TextField
						fullWidth
						variant="filled"
						size="small"
						label="Search jobs (title)"
						value={localSearch}
						onChange={(e) => setLocalSearch(e.target.value)}
						placeholder="e.g., Senior Frontend Engineer"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchRoundedIcon color="action" />
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiFilledInput-root': {
								borderRadius: 1.5,
							},
						}}
					/>
				</Grid>


				{/* Sort */}
				<Grid size={{ xs: 12, md: 2 }}>
					<FormControl fullWidth variant="filled" size="small">
						<InputLabel>Sort by</InputLabel>
						<Select
							value={sortOption}
							onChange={(e) => onSortChange(e.target.value)}
							label="Sort by"
							sx={{
								borderRadius: 1.5,
								'& .MuiSelect-filled': { borderRadius: 1.5 },
							}}
						>
							<MenuItem value="_createdAt_desc">Newest</MenuItem>
							<MenuItem value="_createdAt_asc">Oldest</MenuItem>
							<MenuItem value="recommended">Recommended</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				{/* Pagination + Limit */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						spacing={1.5}
						alignItems={{ xs: 'flex-start', md: 'center' }}
						justifyContent="flex-end"
						sx={{
							height: '100%',
							px: { xs: 0.5, md: 0 },
						}}
					>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ minWidth: 120 }}
						>
							Page {pagination.page} of {pagination.totalPages}
						</Typography>
						<Pagination
							count={pagination.totalPages}
							page={pagination.page}
							onChange={(e, value) => onPageChange(value)}
							color="primary"
							variant="outlined"
							shape="rounded"
							size={isSmDown ? 'small' : 'medium'}
							sx={{
								'& .MuiPaginationItem-root': {
									borderRadius: 1.5,
								},
							}}
						/>
						<FormControl
							variant="filled"
							size="small"
							sx={{
								minWidth: 120,
								'& .MuiFilledInput-root': {
									borderRadius: 1.5,
								},
							}}
						>
							<InputLabel>Per page</InputLabel>
							<Select
								value={pagination.limit}
								onChange={(e) => onLimitChange(e.target.value)}
								label="Per page"
							>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={25}>25</MenuItem>
								<MenuItem value={50}>50</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</Grid>

				<Grid size={{ xs: 12 }}>
					<Divider sx={{ my: 0.5 }} />
				</Grid>

				{/* Advanced filters row */}
				<Grid size={{ xs: 12 }}>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						spacing={1.5}
						alignItems={{ xs: 'stretch', md: 'center' }}
						useFlexGap
						flexWrap="wrap"
					>
						<TextField
							label="Company"
							variant="filled"
							size="small"
							value={localCompany}
							onChange={(e) => setLocalCompany(e.target.value)}
							placeholder="e.g., OpenAI"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<BusinessRoundedIcon color="action" />
									</InputAdornment>
								),
							}}
							sx={{
								minWidth: { xs: '100%', sm: 220 },
								'& .MuiFilledInput-root': {
									borderRadius: 1.5,
								},
							}}
						/>
						<TextField
							label="Position / Location"
							variant="filled"
							size="small"
							value={localPosition}
							onChange={(e) => setLocalPosition(e.target.value)}
							placeholder="e.g., Backend • Berlin"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<WorkOutlineRoundedIcon color="action" />
									</InputAdornment>
								),
							}}
							sx={{
								minWidth: { xs: '100%', sm: 240 },
								'& .MuiFilledInput-root': {
									borderRadius: 1.5,
								},
							}}
						/>
						<FormControl
							variant="filled"
							size="small"
							sx={{
								minWidth: { xs: '100%', sm: 160 },
								'& .MuiFilledInput-root': {
									borderRadius: 1.5,
								},
							}}
						>
							<InputLabel>Remote</InputLabel>
							<Select
								value={localRemote || ''}
								onChange={(e) => setLocalRemote(e.target.value)}
								label="Remote"
								displayEmpty
								renderValue={(val) => val || 'Any'}
								startAdornment={
									<InputAdornment position="start" sx={{ pl: 1 }}>
										<PublicRoundedIcon color="action" fontSize="small" />
									</InputAdornment>
								}
							>
								<MenuItem value="">Any</MenuItem>
								<MenuItem value="Remote">Remote</MenuItem>
								<MenuItem value="Onsite">Onsite</MenuItem>
								<MenuItem value="Hybrid">Hybrid</MenuItem>
							</Select>
						</FormControl>
						<FormControl
							variant="filled"
							size="small"
							sx={{
								minWidth: { xs: '100%', sm: 180 },
								'& .MuiFilledInput-root': {
									borderRadius: 1.5,
								},
							}}
						>
							<InputLabel>Time</InputLabel>
							<Select
								value={localTime || ''}
								onChange={(e) => setLocalTime(e.target.value)}
								label="Time"
								displayEmpty
								renderValue={(val) => val || 'Any'}
								startAdornment={
									<InputAdornment position="start" sx={{ pl: 1 }}>
										<AccessTimeRoundedIcon color="action" fontSize="small" />
									</InputAdornment>
								}
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
							clearOnEscape
							size="small"
							renderTags={(value, getTagProps) =>
								value.map((option, index) => (
									<Chip
										variant="filled"
										size="small"
										color="primary"
										label={option}
										{...getTagProps({ index })}
										sx={{ borderRadius: 1, mr: 0.5 }}
									/>
								))
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Tags"
									variant="filled"
									placeholder="Add and press Enter"
									InputProps={{
										...params.InputProps,
										startAdornment: (
											<>
												<InputAdornment position="start" sx={{ pl: 0.5 }}>
													<LocalOfferRoundedIcon color="action" fontSize="small" />
												</InputAdornment>
												{params.InputProps.startAdornment}
											</>
										),
									}}
								/>
							)}
							sx={{
								minWidth: { xs: '100%', sm: 260 },
								'& .MuiFilledInput-root': {
									borderRadius: 1.5,
								},
							}}
						/>
						{/* LinkedIn jobs filter checkbox */}
						<Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
							<input
								type="checkbox"
								checked={showLinkedInOnly}
								onChange={e => onShowLinkedInOnlyChange && onShowLinkedInOnlyChange(e.target.checked)}
								style={{ marginRight: 8 }}
							/>
							<Typography variant="body2">Show LinkedIn jobs only</Typography>
						</Box>
					</Stack>
				</Grid>


			</Grid>
		</Box>
	);
};

export default SmartToolbar;