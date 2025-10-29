import * as React from "react";
import { animated, useSpring } from "@react-spring/web";
import { styled, alpha } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import FolderRounded from "@mui/icons-material/FolderRounded";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import {
	useTreeItem,
	UseTreeItemParameters,
} from "@mui/x-tree-view/useTreeItem";
import {
	TreeItemCheckbox,
	TreeItemIconContainer,
	TreeItemLabel,
} from "@mui/x-tree-view/TreeItem";
import { TreeItemIcon } from "@mui/x-tree-view/TreeItemIcon";
import { TreeItemProvider } from "@mui/x-tree-view/TreeItemProvider";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { v4 as uuidv4 } from "uuid";

const jsonToTreeItems = (json) => {
	if (typeof json !== "object" || json === null) {
		return [];
	}

	return Object.entries(json).map(([key, value]) => {
		const id = uuidv4();
		const item = {
			id,
			label: key,
		};

		if (typeof value === "object" && value !== null) {
			item.children = jsonToTreeItems(value);
			item.dataType = Array.isArray(value) ? "array" : "object";
		} else {
			item.dataType = typeof value;
			item.value = value;
		}

		return item;
	});
};

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
	marginBottom: theme.spacing(0.5),
	marginTop: theme.spacing(0.5),
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
	fontFamily: "General Sans",
	fontWeight: 500,
});

function CustomLabel({
	icon: Icon,
	expandable,
	children,
	value,
	...other
}) {
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
					sx={{ mr: 1, fontSize: "1.2rem" }}
				/>
			)}

			<TreeItemLabelText variant="body2">
				{children}
				{value !== undefined && `: ${JSON.stringify(value)}`}
			</TreeItemLabelText>
			{expandable && <DotIcon />}
		</TreeItemLabel>
	);
}

const getIconFromDataType = (dataType) => {
	switch (dataType) {
		case "object":
		case "array":
			return FolderRounded;
		default:
			return ArticleIcon;
	}
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
	props,
	ref
) {
	const { id, itemId, label, disabled, children, ...other } = props;

	const {
		getContextProviderProps,
		getRootProps,
		getContentProps,
		getIconContainerProps,
		getCheckboxProps,
		getLabelProps,
		getGroupTransitionProps,
		status,
	} = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

	const item = useTreeItemModel(itemId);

	const icon = getIconFromDataType(item?.dataType);

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
							value: item?.value,
						})}
					/>
				</TreeItemContent>
				{children && (
					<TransitionComponent {...getGroupTransitionProps()} />
				)}
			</TreeItemRoot>
		</TreeItemProvider>
	);
});

export function JsonTreeView({ data }) {
	const items = React.useMemo(() => jsonToTreeItems(data), [data]);
	return (
		<RichTreeView
			items={items}
			sx={{
				height: "fit-content",
				flexGrow: 1,
				maxWidth: 400,
				overflowY: "auto",
			}}
			slots={{ item: CustomTreeItem }}
			itemChildrenIndentation={24}
		/>
	);
}
