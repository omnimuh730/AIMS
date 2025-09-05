import React, { useState, useEffect } from "react";
import {
	Modal,
	Box,
	CircularProgress,
	Typography,
	Button,
} from "@mui/material";

const AskOrionModal = ({ open, onClose }) => {
	const [isAnalyzing, setIsAnalyzing] = useState(true);

	useEffect(() => {
		if (open) {
			setIsAnalyzing(true);
			const timer = setTimeout(() => setIsAnalyzing(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [open]);

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "1px solid #ddd",
		boxShadow: 24,
		p: 4,
		borderRadius: 2,
		textAlign: "center",
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={style}>
				{isAnalyzing ? (
					<>
						<CircularProgress sx={{ mb: 2 }} />
						<Typography variant="h6">
							Analyzing Job Description...
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Orion is checking your profile against the job
							requirements.
						</Typography>
					</>
				) : (
					<>
						<Typography variant="h6" color="primary">
							Analysis Complete!
						</Typography>
						<Typography variant="body1" sx={{ mt: 2 }}>
							You are a <strong>strong match</strong> for this
							role.
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mt: 1 }}
						>
							Highlight your experience in Java EE and
							microservices.
						</Typography>
						<Button
							variant="contained"
							onClick={onClose}
							sx={{ mt: 3 }}
						>
							Close
						</Button>
					</>
				)}
			</Box>
		</Modal>
	);
};

export default AskOrionModal;
