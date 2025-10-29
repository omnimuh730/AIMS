import * as React from "react";
import { Box, TextField, Button, InputAdornment, Paper } from "@mui/material";
import { Assistant, Podcasts } from "@mui/icons-material";
import useSocket from "@/api/useSocket";
import { SOCKET_PROTOCOL } from "../../../api/socket_protocol";
import useNotification from "@/api/useNotification";

interface PromptInputProps {
	prompt: string;
	onPromptChange: (value: string) => void;
	onRun: () => void;
	response: any;
}

export function PromptInput({
	prompt,
	onPromptChange,
	onRun,
	response,
}: PromptInputProps) {
	const socket = useSocket();
	const notification = useNotification();
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		const handleConnection = (data: any) => {
			if (data.from === "extension" && data.status === "received") {
				console.log("Received reply from extension:", data);
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
					timeoutRef.current = null;
				}
				notification.success("Extension received the message.");
			}
		};

		socket.on(SOCKET_PROTOCOL.TYPE.CONNECTION, handleConnection);

		return () => {
			socket.off(SOCKET_PROTOCOL.TYPE.CONNECTION, handleConnection);
		};
	}, [socket, notification]);

	const handleEmitSend = () => {
		if (!response) return;

		const json_response =
			typeof response === "string" ? JSON.parse(response) : null;
		console.log("Emit signal", json_response);

		if (socket && json_response) {
			socket.emit(SOCKET_PROTOCOL.TYPE.CONNECTION, {
				payload: json_response,
			});
			notification.info("Message sent to extension...");

			timeoutRef.current = setTimeout(() => {
				notification.error("Extension did not reply in time.");
			}, 5000);
		}
	};

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
					maxRows={6}
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
									endIcon={<Assistant />}
									sx={{
										borderRadius: "20px",
										mr: 1,
										textTransform: "none",
									}}
									onClick={onRun}
								>
									Run
								</Button>
								<Button
									sx={{
										borderRadius: "20px",
										mr: 1,
										textTransform: "none",
									}}
									onClick={handleEmitSend}
								>
									<Podcasts />
								</Button>
							</InputAdornment>
						),
					}}
				/>
			</Paper>
		</Box>
	);
}
