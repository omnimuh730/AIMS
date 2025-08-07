import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	List,
	ListItemButton,
	Typography,
	Chip,
	Box,
	Grid,
} from "@mui/material";

// --- UPDATED IMPORTS ---
// 1. TreeView is now imported from @mui/x-tree-view
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import { animated, useSpring } from "@react-spring/web";
import { useTreeItem } from "@mui/x-tree-view/useTreeItem";
import { TreeItemLabel } from "@mui/x-tree-view/TreeItem";
import { TreeItemIcon } from "@mui/x-tree-view/TreeItemIcon";
import { TreeItemProvider } from "@mui/x-tree-view/TreeItemProvider";
import { TreeItemDragAndDropOverlay } from "@mui/x-tree-view/TreeItemDragAndDropOverlay";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";

const BACKEND_URL = "http://localhost:3000";

const MailPage = () => {
	const [emails, setEmails] = useState([]);
	const [labels, setLabels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [labelsLoading, setLabelsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`${BACKEND_URL}/emails`)
			.then((res) => res.json())
			.then((data) => {
				setEmails(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetch(`${BACKEND_URL}/labels`)
			.then((res) => res.json())
			.then((data) => {
				setLabels(data);
				setLabelsLoading(false);
			})
			.catch(() => setLabelsLoading(false));
	}, []);

	// Transform Gmail labels to tree structure for RichTreeView
	const { labelTreeItems, labelMap } = useMemo(() => {
		const filteredUserLabels = labels.filter(
			(label) => label.type === "user"
		);
		const labelMap = new Map();
		// Build a map of label id to label object
		filteredUserLabels.forEach((label) => {
			labelMap.set(label.id, { ...label, children: [] });
		});
		// Build tree structure
		const tree = [];
		labelMap.forEach((label) => {
			const lastSlashIndex = label.name.lastIndexOf("/");
			if (lastSlashIndex > -1) {
				// Find parent by name
				const parentName = label.name.substring(0, lastSlashIndex);
				const parent = Array.from(labelMap.values()).find(
					(l) => l.name === parentName
				);
				if (parent) {
					parent.children.push(label);
				} else {
					tree.push(label);
				}
			} else {
				tree.push(label);
			}
		});
		// Recursively convert to RichTreeView format
		function toTreeItems(nodes) {
			return nodes.map((node) => ({
				id: node.id,
				label: node.name.split("/").pop(),
				color: node.color,
				children:
					node.children && node.children.length > 0
						? toTreeItems(node.children)
						: undefined,
			}));
		}
		return {
			userLabels: filteredUserLabels,
			labelTreeItems: toTreeItems(tree),
			labelMap,
		};
	}, [labels]);

	// --- Custom Tree Item for RichTreeView ---
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
		boxSizing: "border-box",
		position: "relative",
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(1),
		cursor: "pointer",
		WebkitTapHighlightColor: "transparent",
		flexDirection: "row",
		borderRadius: theme.spacing(0.7),
		marginBottom: theme.spacing(0.5),
		marginTop: theme.spacing(0.5),
		fontWeight: 500,
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
	}));
	const CustomCollapse = styled(Collapse)({ padding: 0 });
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
	function CustomLabel({ color, children, ...other }) {
		return (
			<TreeItemLabel
				{...other}
				sx={{ display: "flex", alignItems: "center", minHeight: 32 }}
			>
				<Chip
					label={children}
					size="small"
					sx={{
						fontWeight: 500,
						fontSize: "0.95em",
						height: 24,
						borderRadius: 1,
						px: 1,
						...(color && color.backgroundColor
							? {
									bgcolor: color.backgroundColor,
									color: color.textColor || "#000",
									".MuiChip-label": {
										color: color.textColor || "#000",
									},
								}
							: {}),
					}}
				/>
			</TreeItemLabel>
		);
	}
	const CustomTreeItem = React.forwardRef(
		function CustomTreeItem(props, ref) {
			const { id, itemId, label, color, disabled, children, ...other } =
				props;
			const {
				getContextProviderProps,
				getRootProps,
				getContentProps,
				getLabelProps,
				getGroupTransitionProps,
				getDragAndDropOverlayProps,
				status,
			} = useTreeItem({
				id,
				itemId,
				children,
				label,
				disabled,
				rootRef: ref,
			});
			useTreeItemModel(itemId); // for completeness, not used here
			return (
				<TreeItemProvider {...getContextProviderProps()}>
					<TreeItemRoot {...getRootProps(other)}>
						<TreeItemContent {...getContentProps()}>
							<TreeItemIcon status={status} />
							<CustomLabel {...getLabelProps()} color={color} />
							<TreeItemDragAndDropOverlay
								{...getDragAndDropOverlayProps()}
							/>
						</TreeItemContent>
					</TreeItemRoot>
					{children && (
						<TransitionComponent {...getGroupTransitionProps()} />
					)}
				</TreeItemProvider>
			);
		}
	);

	if (loading || labelsLoading) return <Typography>Loading...</Typography>;
	if (!emails.length) return <Typography>No emails found.</Typography>;

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Grid container spacing={2}>
				<Grid size={2}>
					<Typography variant="h6" mb={2}>
						Labels
					</Typography>
					<Box
						sx={{
							bgcolor: "#fff",
							borderRadius: 2,
							p: 2,
							boxShadow: 1,
						}}
					>
						<RichTreeView
							items={labelTreeItems}
							defaultExpandedItems={labelTreeItems.map(
								(item) => item.id
							)}
							slots={{ item: CustomTreeItem }}
							itemChildrenIndentation={24}
							sx={{
								height: "fit-content",
								flexGrow: 1,
								maxWidth: 400,
								overflowY: "auto",
							}}
						/>
					</Box>
				</Grid>
				<Grid size={10}>
					<Typography variant="h5" mb={2}>
						Inbox
					</Typography>
					<List>
						{emails.map((email) => (
							<ListItemButton
								key={email.id}
								onClick={() => navigate(`/mail/${email.id}`)}
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									overflow: "hidden",
									minHeight: 48,
									px: 2,
									py: 0,
									borderRadius: 0,
									boxShadow: "none",
									bgcolor: "transparent",
									"&:hover": { bgcolor: "#f5f5f5" },
								}}
							>
								<Typography
									fontWeight="bold"
									component="span"
									noWrap
									sx={{
										minWidth: 180,
										maxWidth: 220,
										flexShrink: 0,
									}}
								>
									{email.from}
								</Typography>
								{email.labelIds &&
									email.labelIds.map((labelId) => {
										const labelObj = labelMap.get(labelId);
										return labelObj ? (
											<Chip
												key={labelId}
												label={labelObj.name}
												size="small"
												sx={{
													maxWidth: 100,
													mr: 0.5,
													...(labelObj.color &&
													labelObj.color
														.backgroundColor
														? {
																bgcolor:
																	labelObj
																		.color
																		.backgroundColor,
																color:
																	labelObj
																		.color
																		.textColor ||
																	"#000",
															}
														: {}),
												}}
											/>
										) : null;
									})}
								<Typography
									variant="subtitle1"
									fontWeight="bold"
									component="span"
									noWrap
									sx={{ flex: 1, minWidth: 0, mx: 1 }}
								>
									{email.subject}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									component="span"
									noWrap
									sx={{ flex: 2, minWidth: 0, mx: 1 }}
								>
									{email.body
										?.replace(/<[^>]+>/g, "")
										.slice(0, 80) || email.snippet}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									component="span"
									noWrap
									sx={{
										minWidth: 120,
										textAlign: "right",
										flexShrink: 0,
									}}
								>
									{email.date
										? new Date(email.date).toLocaleString()
										: ""}
								</Typography>
							</ListItemButton>
						))}
					</List>
				</Grid>
			</Grid>
		</Box>
	);
};

export default MailPage;
