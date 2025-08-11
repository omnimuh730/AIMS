import useSocket from "../../api/useSocket";
import useNotification from "../../api/useNotification";
import { useState, useCallback, useEffect } from "react";

import { Box, Button, Input, Typography } from "@mui/material";

import * as React from "react";
import { animated, useSpring } from "@react-spring/web";
import { styled, alpha } from "@mui/material/styles";

import Collapse from "@mui/material/Collapse";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderRounded from "@mui/icons-material/FolderRounded";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useTreeItem } from "@mui/x-tree-view/useTreeItem";
import {
	TreeItemCheckbox,
	TreeItemIconContainer,
	TreeItemLabel,
} from "@mui/x-tree-view/TreeItem";
import { TreeItemIcon } from "@mui/x-tree-view/TreeItemIcon";
import { TreeItemProvider } from "@mui/x-tree-view/TreeItemProvider";
import { TreeItemDragAndDropOverlay } from "@mui/x-tree-view/TreeItemDragAndDropOverlay";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";

const ITEMS = [
	{
		id: "1",
		label: "Documents",
		children: [
			{
				id: "1.1",
				label: "Company",
				children: [
					{ id: "1.1.1", label: "Invoice", fileType: "pdf" },
					{ id: "1.1.2", label: "Meeting notes", fileType: "doc" },
					{ id: "1.1.3", label: "Tasks list", fileType: "doc" },
					{ id: "1.1.4", label: "Equipment", fileType: "pdf" },
					{
						id: "1.1.5",
						label: "Video conference",
						fileType: "video",
					},
				],
			},
			{ id: "1.2", label: "Personal", fileType: "folder" },
			{ id: "1.3", label: "Group photo", fileType: "image" },
		],
	},
	{
		id: "2",
		label: "Bookmarked",
		fileType: "pinned",
		children: [
			{ id: "2.1", label: "Learning materials", fileType: "folder" },
			{ id: "2.2", label: "News", fileType: "folder" },
			{ id: "2.3", label: "Forums", fileType: "folder" },
			{ id: "2.4", label: "Travel documents", fileType: "pdf" },
		],
	},
	{ id: "3", label: "History", fileType: "folder" },
	{ id: "4", label: "Trash", fileType: "trash" },
];

const demoResponseData = {
	ActionPlan: {
		goal: "Apply for the Full Stack Engineer job at Goodshuffle Pro",
		element_manifest: [
			{
				id: "input_first_name",
				type: "input",
				description: "First Name input field",
				confidence: 100,
				suggested_selector: "input#first_name",
			},
			{
				id: "input_last_name",
				type: "input",
				description: "Last Name input field",
				confidence: 100,
				suggested_selector: "input#last_name",
			},
			{
				id: "input_email",
				type: "input",
				description: "Email input field",
				confidence: 100,
				suggested_selector: "input#email",
			},
			{
				id: "input_phone",
				type: "input",
				description: "Phone number input field",
				confidence: 100,
				suggested_selector: "input#phone",
			},
			{
				id: "button_attach_resume",
				type: "button",
				description: "Attach Resume/CV file button",
				confidence: 90,
				suggested_selector:
					'button[data-source="attach"][aria-describedby="resume-allowable-file-types"]',
			},
			{
				id: "button_paste_resume",
				type: "button",
				description: "Button to enter resume manually",
				confidence: 90,
				suggested_selector:
					'div.attach-or-paste[data-field="resume"] button[data-source="paste"]',
			},
			{
				id: "textarea_resume_manual",
				type: "textarea",
				description: "Text area to manually enter resume content",
				confidence: 90,
				suggested_selector: "textarea#resume_text",
			},
			{
				id: "button_attach_cover_letter",
				type: "button",
				description: "Attach Cover Letter file button",
				confidence: 90,
				suggested_selector:
					'button[data-source="attach"][aria-describedby="cover_letter-allowable-file-types"]',
			},
			{
				id: "button_paste_cover_letter",
				type: "button",
				description: "Button to enter cover letter manually",
				confidence: 90,
				suggested_selector:
					'div.attach-or-paste[data-field="cover_letter"] button[data-source="paste"]',
			},
			{
				id: "textarea_cover_letter_manual",
				type: "textarea",
				description: "Text area to manually enter cover letter content",
				confidence: 90,
				suggested_selector: "textarea#cover_letter_text",
			},
			{
				id: "input_linkedin_profile",
				type: "input",
				description: "LinkedIn Profile URL input field",
				confidence: 95,
				suggested_selector:
					"input#job_application_answers_attributes_0_text_value",
			},
			{
				id: "input_website",
				type: "input",
				description: "Website URL input field",
				confidence: 95,
				suggested_selector:
					"input#job_application_answers_attributes_1_text_value",
			},
			{
				id: "input_authorized_to_work_us",
				type: "input",
				description:
					"Legally authorized to work in the United States question answer field",
				confidence: 95,
				suggested_selector:
					"input#job_application_answers_attributes_2_text_value",
			},
			{
				id: "input_require_sponsorship",
				type: "input",
				description:
					"Require sponsorship for employment visa status question answer field",
				confidence: 95,
				suggested_selector:
					"input#job_application_answers_attributes_3_text_value",
			},
			{
				id: "select_local_to_dc_dmv",
				type: "select",
				description:
					"Dropdown for 'Are you local to the DC/DMV area as of today?' question",
				confidence: 95,
				suggested_selector:
					"select#job_application_answers_attributes_4_boolean_value",
			},
			{
				id: "select_willing_to_relocate",
				type: "select",
				description:
					"Dropdown for 'If not local presently, are you willing to relocate to the DC/DMC area, understanding this is a hybrid position?' question",
				confidence: 95,
				suggested_selector:
					"select#job_application_answers_attributes_5_boolean_value",
			},
			{
				id: "recaptcha_challenge",
				type: "captcha",
				description: "Google reCAPTCHA challenge",
				confidence: 100,
				suggested_selector: "div.grecaptcha-badge iframe",
			},
			{
				id: "button_submit_application",
				type: "button",
				description: "Submit Application button",
				confidence: 100,
				suggested_selector: "input#submit_app",
			},
		],
		steps: [
			{
				step_id: 1,
				description: "Fill out personal contact information.",
				actions: [
					{
						type: "TYPE",
						target_id: "input_first_name",
						value: "John",
					},
					{
						type: "TYPE",
						target_id: "input_last_name",
						value: "Doe",
					},
					{
						type: "TYPE",
						target_id: "input_email",
						value: "john.doe@example.com",
					},
					{
						type: "TYPE",
						target_id: "input_phone",
						value: "555-123-4567",
					},
				],
			},
			{
				step_id: 2,
				description:
					"Provide Resume/CV. The system can choose to attach a file, use Dropbox, or paste text based on availability. If pasting is chosen, populate the textarea; otherwise, simulate a click on the attach button to prompt for file selection.",
				actions: [
					{
						type: "CLICK",
						target_id: "button_attach_resume",
						value: "",
					},
				],
			},
			{
				step_id: 3,
				description:
					"Provide Cover Letter (Optional). The system can choose to attach a file, use Dropbox, or paste text based on availability. If pasting is chosen, populate the textarea; otherwise, simulate a click on the attach button to prompt for file selection.",
				actions: [
					{
						type: "CLICK",
						target_id: "button_attach_cover_letter",
						value: "",
					},
				],
			},
			{
				step_id: 4,
				description: "Fill out additional application questions.",
				actions: [
					{
						type: "TYPE",
						target_id: "input_linkedin_profile",
						value: "https://www.linkedin.com/in/john-doe",
					},
					{
						type: "TYPE",
						target_id: "input_website",
						value: "https://www.johndoeportfolio.com",
					},
					{
						type: "TYPE",
						target_id: "input_authorized_to_work_us",
						value: "Yes",
					},
					{
						type: "TYPE",
						target_id: "input_require_sponsorship",
						value: "No",
					},
					{
						type: "SELECT",
						target_id: "select_local_to_dc_dmv",
						value: "1",
					},
					{
						type: "SELECT",
						target_id: "select_willing_to_relocate",
						value: "1",
					},
				],
			},
			{
				step_id: 5,
				description: "Complete the reCAPTCHA challenge.",
				actions: [
					{
						type: "PAUSE",
						target_id: "recaptcha_challenge",
						value: "Complete the reCAPTCHA challenge manually.",
					},
				],
			},
			{
				step_id: 6,
				description: "Submit the application.",
				actions: [
					{
						type: "CLICK",
						target_id: "button_submit_application",
						value: "",
					},
				],
			},
		],
	},
};

// Transform demoResponseData.ActionPlan.element_manifest into tree structure
const buildTreeFromManifest = (manifest) => {
	const typeGroups = {};
	manifest.forEach((el) => {
		if (!typeGroups[el.type]) typeGroups[el.type] = [];
		typeGroups[el.type].push({
			id: el.id,
			label: el.description,
			fileType: el.type,
		});
	});
	return Object.entries(typeGroups).map(([type, children], idx) => ({
		id: `type-${type}-id- ${idx}`,
		label: type.charAt(0).toUpperCase() + type.slice(1) + "s",
		fileType: "folder",
		children,
	}));
};

const treeItemsFromDemo = buildTreeFromManifest(
	demoResponseData.ActionPlan.element_manifest
);

function DotIcon() {
	return (
		<Box
			sx={{
				width: 6,
				height: 6,
				borderRadius: "70%",
				bgcolor: "warning.main",
				display: "inline-block",
				verticalAlign: "middle",
				zIndex: 1,
				mx: 1,
			}}
		/>
	);
}

const TreeItemRoot = styled("li")(({ theme }) => ({
	listStyle: "none",
	margin: 0,
	padding: 0,
	outline: 0,
	color: theme.palette.grey[400],
	...theme.applyStyles("light", {
		color: theme.palette.grey[800],
	}),
}));

const TreeItemContent = styled("div")(({ theme }) => ({
	padding: theme.spacing(0.5),
	paddingRight: theme.spacing(1),
	paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
	width: "100%",
	boxSizing: "border-box", // prevent width + padding to overflow
	position: "relative",
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
	cursor: "pointer",
	WebkitTapHighlightColor: "transparent",
	flexDirection: "row-reverse",
	borderRadius: theme.spacing(0.7),
	marginBottom: theme.spacing(1),
	marginTop: theme.spacing(1),
	fontWeight: 500,
	"&[data-expanded]:not([data-focused], [data-selected]) .labelIcon": {
		color: theme.palette.primary.dark,
		...theme.applyStyles("light", {
			color: theme.palette.primary.main,
		}),
		"&::before": {
			content: '""',
			display: "block",
			position: "absolute",
			left: "16px",
			top: "44px",
			height: "calc(100% - 48px)",
			width: "1.5px",
			backgroundColor: theme.palette.grey[700],
			...theme.applyStyles("light", {
				backgroundColor: theme.palette.grey[300],
			}),
		},
	},
	[`&[data-focused], &[data-selected]`]: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText,
		...theme.applyStyles("light", {
			backgroundColor: theme.palette.primary.main,
		}),
	},
	"&:not([data-focused], [data-selected]):hover": {
		backgroundColor: alpha(theme.palette.primary.main, 0.1),
		color: "white",
		...theme.applyStyles("light", {
			color: theme.palette.primary.main,
		}),
	},
}));

const CustomCollapse = styled(Collapse)({
	padding: 0,
});

const AnimatedCollapse = animated(CustomCollapse);

function TransitionComponent(props) {
	const style = useSpring({
		to: {
			opacity: props.in ? 1 : 0,
			transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
		},
	});

	return <AnimatedCollapse style={style} {...props} />;
}

const TreeItemLabelText = styled(Typography)({
	color: "inherit",
	fontWeight: 500,
});

function CustomLabel({ icon: Icon, expandable, children, ...other }) {
	return (
		<TreeItemLabel
			{...other}
			sx={{
				display: "flex",
				alignItems: "center",
			}}
		>
			{Icon && (
				<Box
					component={Icon}
					className="labelIcon"
					color="inherit"
					sx={{ mr: 1, fontSize: "1.4rem" }}
				/>
			)}

			<TreeItemLabelText variant="body2">{children}</TreeItemLabelText>
			{expandable && <DotIcon />}
		</TreeItemLabel>
	);
}

const getIconFromFileType = (fileType) => {
	switch (fileType) {
		case "image":
			return ImageIcon;
		case "pdf":
			return PictureAsPdfIcon;
		case "doc":
			return ArticleIcon;
		case "video":
			return VideoCameraBackIcon;
		case "folder":
			return FolderRounded;
		case "pinned":
			return FolderOpenIcon;
		case "trash":
			return DeleteIcon;
		default:
			return ArticleIcon;
	}
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
	const { id, itemId, label, disabled, children, ...other } = props;

	const {
		getContextProviderProps,
		getRootProps,
		getContentProps,
		getIconContainerProps,
		getCheckboxProps,
		getLabelProps,
		getGroupTransitionProps,
		getDragAndDropOverlayProps,
		status,
	} = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

	const item = useTreeItemModel(itemId);

	let icon;
	if (status.expandable) {
		icon = FolderRounded;
	} else if (item.fileType) {
		icon = getIconFromFileType(item.fileType);
	}

	return (
		<TreeItemProvider {...getContextProviderProps()}>
			<TreeItemRoot {...getRootProps(other)}>
				<TreeItemContent {...getContentProps()}>
					<TreeItemIconContainer {...getIconContainerProps()}>
						<TreeItemIcon status={status} />
					</TreeItemIconContainer>
					<TreeItemCheckbox {...getCheckboxProps()} />
					<CustomLabel
						{...getLabelProps({
							icon,
							expandable: status.expandable && status.expanded,
						})}
					/>
					<TreeItemDragAndDropOverlay
						{...getDragAndDropOverlayProps()}
					/>
				</TreeItemContent>
				{children && (
					<TransitionComponent {...getGroupTransitionProps()} />
				)}
			</TreeItemRoot>
		</TreeItemProvider>
	);
});

const BACKEND_URL = "http://localhost:3000"; // Backend server

const TestPage = () => {
	const socket = useSocket();
	const notification = useNotification();
	// const [gmailAuthUrl, setGmailAuthUrl] = useState(null); // Removed unused state
	const [gmailAuthenticated, setGmailAuthenticated] = useState(false);

	const [systemInstruction, setSystemInstruction] = useState("");
	const [userInput, setUserInput] = useState("");

	// Example: listen for notification event and show snackbar
	useEffect(() => {
		socket.on("notification", (msg) => {
			console.log("Socket notification received:", msg);
			notification.success(`Socket: ${msg}`);
		});
		socket.on("bid-plan", (data) => {
			const parsed_data = JSON.parse(data);

			console.log(parsed_data);
		});
		return () => socket.off("notification");
	}, [socket, notification]);

	// Check for Gmail OAuth2 redirect
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		console.log(params);
		if (params.get("gmail") === "success") {
			console.log("Gmail is already logged in");
			setGmailAuthenticated(true);
		}
	}, []);

	const handleGmailLogin = useCallback(async () => {
		try {
			const res = await fetch(`${BACKEND_URL}/auth-url`);
			const data = await res.json();
			if (data.authUrl) {
				window.location.href = data.authUrl;
			}
		} catch (err) {
			console.error("Failed to get Gmail auth URL", err);
		}
	}, []);

	const handleSubmit = useCallback(() => {
		console.log("System Instruction:", systemInstruction);
		console.log("User Input:", userInput);

		socket.emit(
			"test-event",
			JSON.stringify({
				systemInstruction: systemInstruction,
				userInput: userInput,
			})
		);
		notification.info("Submitted data via socket");
	}, [systemInstruction, userInput, socket, notification]);

	// Fetch emails after successful auth
	useEffect(() => {
		if (gmailAuthenticated) {
			fetch(`${BACKEND_URL}/emails`)
				.then((res) => res.json())
				.then((data) => {
					console.log("Fetched Gmail emails:", data);
				})
				.catch((err) => {
					console.error("Failed to fetch Gmail emails", err);
				});
		}
	}, [gmailAuthenticated]);

	return (
		<Box>
			<Typography>
				Test Page - Socket notifications will appear as snackbars
			</Typography>
			{!gmailAuthenticated && (
				<Box mt={2}>
					<button onClick={handleGmailLogin}>Login with Gmail</button>
				</Box>
			)}
			{gmailAuthenticated && (
				<Typography mt={2}>
					Gmail authenticated! Check console for emails.
				</Typography>
			)}
			<Input
				placeholder="Type your System Instruction..."
				fullWidth
				multiline
				rows={4}
				variant="outlined"
				margin="normal"
				value={systemInstruction}
				onChange={(e) => setSystemInstruction(e.target.value)}
			/>
			<Input
				placeholder="Type your User Input..."
				fullWidth
				multiline
				rows={4}
				variant="outlined"
				margin="normal"
				value={userInput}
				onChange={(e) => setUserInput(e.target.value)}
			/>
			<Button onClick={handleSubmit}>Submit</Button>

			<RichTreeView
				items={treeItemsFromDemo}
				defaultExpandedItems={["type-input", "type-button"]}
				defaultSelectedItems="type-input"
				sx={{
					height: "fit-content",
					flexGrow: 1,
					maxWidth: 400,
					overflowY: "auto",
				}}
				slots={{ item: CustomTreeItem }}
				itemChildrenIndentation={24}
			/>
		</Box>
	);
};

export default TestPage;
