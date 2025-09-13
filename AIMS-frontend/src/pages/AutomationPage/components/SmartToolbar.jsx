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
            </Grid>
        </Box>
    );
};

export default SmartToolbar;
