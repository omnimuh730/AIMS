import React, { useState, useEffect } from "react";
import {
	Paper,
	TextField,
	Button,
	Stack,
	Select,
	Typography,
	FormControl,
	InputLabel,
	MenuItem,
	Tooltip,
	Divider,
} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Minimal, self-contained Tracker component used in the Extension sidepanel.
const commonTags = ["div", "a", "span", "img", "input", "button", "li", "h1", "h2", "p", "form", "section", "header", "footer", "textarea"];
const commonProperties = ["id", "class", "name", "href", "src", "alt", "for", "type", "role", "aria-label", "data-testid"];

const ComponentTracker = () => {
	// State for highlighting
	const [tag, setTag] = useState("div");
	const [property, setProperty] = useState("class");
	const [pattern, setPattern] = useState("");
	const [order, setOrder] = useState(0);
	const [action, setAction] = useState("click");
	const [actionValue, setActionValue] = useState(""); // For fill/type actions

	/* global chrome */
	const handleHighlight = () => {
		if (!pattern) return;
		chrome.runtime.sendMessage({
			action: "highlightByPattern",
			payload: {
				componentType: tag,
				propertyName: property,
				pattern: pattern,
			},
		});
	};

	const handleClear = () => {
		chrome.runtime.sendMessage({ action: "clearHighlight" });
	};

	// Function to send the interaction command
	const handleAction = () => {
		chrome.runtime.sendMessage({
			action: "executeAction",
			payload: {
				// We send the selector info again to ensure we act on the right elements
				componentType: tag,
				propertyName: property,
				pattern: pattern,
				// Action details
				order: parseInt(order, 10) || 0,
				action: action,
				value: actionValue,
			}
		});
	};



	// Listen for messages forwarded from the background script (e.g., 'to-extension')
	useEffect(() => {
		if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
			const listener = (message) => {
				if (message?.action === 'to-extension') {
					// placeholder for future UI notifications
					// console.log('Panel received to-extension message:', message.payload);
				}
			};

			chrome.runtime.onMessage.addListener(listener);
			return () => {
				try { chrome.runtime.onMessage.removeListener(listener); } catch (e) {
					console.error('Error removing listener:', e);
				}
			};
		}
	}, []);

	const isActionWithValue = action === "fill" || action === "typeSmoothly";

	return (
		<div>
			<Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
				<Stack spacing={3}>
					<Typography variant="h6">1. Find Elements</Typography>
					<FormControl fullWidth>
						<InputLabel>Tag Name</InputLabel>
						<Select value={tag} label="Tag Name" onChange={(e) => setTag(e.target.value)}>
							{commonTags.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
						</Select>
					</FormControl>
					<FormControl fullWidth>
						<InputLabel>Attribute</InputLabel>
						<Select value={property} label="Attribute" onChange={(e) => setProperty(e.target.value)}>
							{commonProperties.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
						</Select>
					</FormControl>
					<Tooltip title="Use '?' for wildcards. `?text?` contains, `text?` starts-with." arrow>
						<TextField
							fullWidth
							label="Pattern"
							variant="outlined"
							value={pattern}
							onChange={(e) => setPattern(e.target.value)}
							placeholder="e.g., ?user-profile?"
						/>
					</Tooltip>
					<Stack direction="row" spacing={2}>
						<Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={handleHighlight} disabled={!pattern}>
							Highlight
						</Button>
						<Button fullWidth variant="outlined" color="secondary" startIcon={<ClearIcon />} onClick={handleClear}>
							Clear
						</Button>
					</Stack>

					<Divider sx={{ my: 2 }} />

					<Typography variant="h6">2. Interact with Element</Typography>

					<Stack direction="row" spacing={2}>
						<TextField
							type="number"
							label="Order"
							value={order}
							onChange={(e) => setOrder(Math.max(0, parseInt(e.target.value, 10)))}
							inputProps={{ min: 0 }}
							sx={{ width: '100px' }}
							disabled={!pattern}
						/>
						<FormControl fullWidth disabled={!pattern}>
							<InputLabel>Action</InputLabel>
							<Select value={action} label="Action" onChange={(e) => setAction(e.target.value)}>
								<MenuItem value="click">Click</MenuItem>
								<MenuItem value="fill">Fill</MenuItem>
								<MenuItem value="typeSmoothly">Type Smoothly</MenuItem>
							</Select>
						</FormControl>
					</Stack>

					{isActionWithValue && (
						<TextField
							fullWidth
							label="Value to Fill/Type"
							variant="outlined"
							value={actionValue}
							onChange={(e) => setActionValue(e.target.value)}
							disabled={!pattern}
						/>
					)}

					<Button
						variant="contained"
						color="success"
						startIcon={<PlayArrowIcon />}
						onClick={handleAction}
						disabled={!pattern || (isActionWithValue && !actionValue)}
					>
						Execute Action
					</Button>
				</Stack>
			</Paper>
		</div>
	);
}

export default ComponentTracker;