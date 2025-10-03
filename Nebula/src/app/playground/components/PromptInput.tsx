import * as React from "react";
import {
	Box,
	TextField,
	Button,
	InputAdornment,
	Paper,
} from "@mui/material";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";

interface PromptInputProps {
	prompt: string;
	onPromptChange: (value: string) => void;
	onRun: () => void;
}

export function PromptInput({
	prompt,
	onPromptChange,
	onRun,
}: PromptInputProps) {
	return (
		<Box
			sx={{
				width: "100%",
				maxWidth: "900px",
				mx: "auto",
				py: 2,
			}}
		>
			<Paper elevation={2} sx={{ borderRadius: "28px" }}>
				<TextField
					fullWidth
					multiline
					minRows={1}
					variant="outlined"
					value={prompt}
					onChange={(e) => onPromptChange(e.target.value)}
					placeholder="Enter a prompt here"
					sx={{
						"& .MuiOutlinedInput-root": {
							paddingRight: "4px",
							borderRadius: "24px",
							"& fieldset": { border: "none" },
						},
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Button
									variant="contained"
									endIcon={<PlayArrowIcon />}
									sx={{
										borderRadius: "20px",
										mr: 1,
										textTransform: "none",
									}}
									onClick={onRun}
								>
									Run
								</Button>
							</InputAdornment>
						),
					}}
				/>
			</Paper>
		</Box>
	);
}