
import React, { useRef, useState } from 'react';
import {
	Box,
	Button,
	IconButton,
	Typography,
	Stack,
	ButtonGroup,
	Popper,
	Paper,
	ClickAwayListener,
	MenuList,
	MenuItem,
	Grow,
	Chip
} from "@mui/material";
import {
	LinkedIn,
	ArrowDropDown,
	Visibility,
	FlashOn,
	Cancel
} from '@mui/icons-material';

const JobCardActions = ({ applicants, applyLink, onViewDetails, onAskgllama, onApply, onUpdateStatus, onUnapply, applied, job }) => {
	const options = job.status === undefined ? ['Apply'] : job.status.scheduledDate === undefined && job.status.declinedDate === undefined ? ['Declined', 'Scheduled'] : [];
	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const handleClick = () => {
		if (options[selectedIndex] === 'Apply') {
			ApplyNow();
		} else if (options[selectedIndex] === 'Declined' || options[selectedIndex] === 'Scheduled') {
			if (onUpdateStatus) {
				onUpdateStatus(job, options[selectedIndex]);
			}
		}
		console.info(`You clicked ${options[selectedIndex]}`);
	};

	const handleMenuItemClick = (event, index) => {
		setSelectedIndex(index);
		setOpen(false);
		if (options[index] === 'Declined' || options[index] === 'Scheduled') {
			if (onUpdateStatus) {
				onUpdateStatus(job, options[index]);
			}
		}
	};

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};
	const ApplyNow = async () => {
		try {
			if (onApply && job) {
				await onApply(job);
			}
		} catch (e) {
			// ignore error and still open the tab
		} finally {
			if (applyLink) {
				if (applyLink.includes("linkedin.com")) {
					const searchString = job.title + ' at ' + job.company.name;
					const googlingUrl = `https://www.google.com/search?q=${searchString.replace(/\s+/g, '+')}`;
					window.open(googlingUrl, "_blank", "noopener,noreferrer");
				}
				else
					window.open(applyLink, "_blank", "noopener,noreferrer");
			}
		}
	}
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				mt: 2,
				flexWrap: "wrap",
				gap: 1,
			}}
		>
			<Chip color='success' label={job.postedAt ? `Posted at ${new Date(job.postedAt).toLocaleDateString()} ${new Date(job.postedAt).toLocaleTimeString()}` : ''} />
			<Stack direction="row" spacing={1} alignItems="center">
				<IconButton
					onClick={onViewDetails}
					sx={{ border: "1px solid", borderColor: "grey.300" }}
				>
					<Visibility fontSize="small" />
				</IconButton>
				<Button
					variant="outlined"
					startIcon={<FlashOn />}
					onClick={onAskgllama}
					sx={{
						textTransform: "none",
						borderRadius: "20px",
					}}
				>
					Ask gllama
				</Button>
				{job.status && (job.status.declinedDate || job.status.scheduledDate) ? (
					<IconButton sx={{ borderRadius: "20px" }} size="small" color='error' variant='contained' onClick={() => onUpdateStatus(job, 'Applied')}>
						<Cancel />
					</IconButton>
				) :
					<><ButtonGroup
						variant="contained"
						ref={anchorRef}
						aria-label="Button group with a nested menu"
						sx={{
							borderRadius: "20px", textTransform: "none"
						}}
					>
						<Button onClick={handleClick}
							sx={{
								borderRadius: "20px", textTransform: "none"
							}}
						>
							{applyLink && applyLink.includes("linkedin.com") && (
								<LinkedIn style={{ marginRight: 6 }} /> // 👈 space between
							)}{options[selectedIndex]}</Button>
						{job.status !== undefined && (
							<>
								<Button
									size="small"
									aria-controls={open ? 'split-button-menu' : undefined}
									aria-expanded={open ? 'true' : undefined}
									aria-label="select merge strategy"
									aria-haspopup="menu"
									onClick={handleToggle}
								>
									<ArrowDropDown />
								</Button>
								<Button size='small' color='error' sx={{ borderRadius: "20px", textTransform: "none" }} onClick={() => onUnapply(job)}>
									<Cancel />
								</Button>
							</>
						)}
					</ButtonGroup>
					</>
				}
				<Popper
					sx={{ zIndex: 1 }}
					open={open}
					anchorEl={anchorRef.current}
					role={undefined}
					transition
					disablePortal
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === 'bottom' ? 'center top' : 'center bottom',
							}}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList id="split-button-menu" autoFocusItem>
										{options.map((option, index) => (
											<MenuItem
												key={option}
												selected={index === selectedIndex}
												onClick={(event) => handleMenuItemClick(event, index)}
											>
												{option}
											</MenuItem>
										))}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>

			</Stack>
		</Box>
	);
};

export default JobCardActions;
