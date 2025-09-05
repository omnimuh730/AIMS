import React from "react";
import {
	Drawer,
	Box,
	IconButton,
	Typography,
	Divider,
	Stack,
	Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlashOnIcon from "@mui/icons-material/FlashOn";

const JobDetailDrawer = ({ job, open, onClose, onAskgllama }) => {
	if (!job) return null;

	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Box
				sx={{
					width: { xs: "100vw", sm: 500, md: 600 },
					p: 5,
					pt: 15,
					position: "relative",
					height: "100%",
				}}
			>
				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", top: 16, right: 16 }}
				>
					<CloseIcon />
				</IconButton>

				<Typography variant="h5" fontWeight="bold">
					{job.title}
				</Typography>
				<Typography variant="body1" color="text.secondary" gutterBottom>
					{job.company.name} &middot; {job.details.location}
				</Typography>
				<Divider sx={{ my: 2 }} />

				<Box
					sx={{ overflowY: "auto", height: "calc(100% - 150px)" }}
					dangerouslySetInnerHTML={{ __html: job.description }}
				/>

				<Box
					sx={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						p: 2,
						bgcolor: "background.paper",
						borderTop: "1px solid",
						borderColor: "divider",
					}}
				>
					<Stack
						direction="row"
						spacing={2}
						justifyContent="flex-end"
					>
						<Button
							variant="outlined"
							startIcon={<FlashOnIcon />}
							onClick={onAskgllama}
							size="small"
							sx={{
								textTransform: "none",
								borderRadius: "20px",
								color: "black",
								borderColor: "grey.400",
							}}
						>
							Ask gllama
						</Button>
						<Button
							variant="contained"
							color="primary"
							size="small"
							sx={{
								textTransform: "none",
								bgcolor: "#00C853",
								"&:hover": { bgcolor: "#00B843" },
								borderRadius: "20px",
							}}
						>
							Apply Now
						</Button>
					</Stack>
				</Box>
			</Box>
		</Drawer>
	);
};

export default JobDetailDrawer;
