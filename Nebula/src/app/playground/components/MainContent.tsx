// The file path may be different based on your project structure
import { MdxRuntime } from "./MdxRuntime";
import * as React from "react";
import {
	Box,
	Typography,
	Grid,
	CircularProgress,
	Link,
	Paper,
	Table,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	Divider,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { PromptInput } from "./PromptInput";

// --- Markdown Rendering Imports (only needed for styling components) ---
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MainContentProps {
	prompt: string;
	onPromptChange: (value: string) => void;
	onRun: () => void;
	response: string;
	isLoading: boolean;
}

// --- THIS COMPONENT MAP WORKS FOR MDXProvider TOO! ---
const mdxComponents = {
	h1: ({ ...props }) => (
		<Typography variant="h3" component="h1" gutterBottom {...props} />
	),
	h2: ({ ...props }) => (
		<>
			<Divider sx={{ my: 2 }} />
			<Typography variant="h4" component="h2" gutterBottom {...props} />
		</>
	),
	h3: ({ ...props }) => (
		<Typography variant="h5" component="h3" gutterBottom {...props} />
	),
	h4: ({ ...props }) => (
		<Typography variant="h6" component="h4" gutterBottom {...props} />
	),
	p: ({ ...props }) => <Typography variant="body1" paragraph {...props} />,
	a: ({ ...props }) => <Link {...props} />,
	hr: ({ ...props }) => <Divider sx={{ my: 2 }} {...props} />,
	ul: ({ ...props }) => <List sx={{ pl: 2 }} {...props} />,
	ol: ({ ...props }) => (
		<List
			component="ol"
			sx={{ pl: 2, listStyleType: "decimal" }}
			{...props}
		/>
	),
	li: ({ ...props }) => (
		<ListItem sx={{ display: "list-item", py: 0.5 }}>
			<ListItemText primary={props.children} />
		</ListItem>
	),
	blockquote: ({ ...props }) => (
		<Paper
			elevation={0}
			sx={{
				borderLeft: "4px solid",
				borderColor: "divider",
				pl: 2,
				my: 2,
				fontStyle: "italic",
				color: "text.secondary",
			}}
		>
			<Typography {...props} />
		</Paper>
	),
	table: ({ ...props }) => (
		<TableContainer component={Paper} sx={{ my: 2 }}>
			<Table {...props} />
		</TableContainer>
	),
	thead: ({ ...props }) => (
		<TableHead sx={{ backgroundColor: "action.hover" }} {...props} />
	),
	tr: ({ ...props }) => <TableRow {...props} />,
	th: ({ ...props }) => <TableCell sx={{ fontWeight: "bold" }} {...props} />,
	td: ({ ...props }) => <TableCell {...props} />,
	// MDX uses `pre` and `code` tags. The `pre` gets the className.
	pre: ({ className, ...props }: any) => {
		const match = /language-(\w+)/.exec(className || "");
		return (
			<Paper
				elevation={0}
				sx={{
					my: 2,
					backgroundColor: "#f5f5f5",
					overflow: "auto",
					borderRadius: 1,
				}}
			>
				<SyntaxHighlighter
					style={oneLight}
					language={match ? match[1] : undefined}
					PreTag="div"
				>
					{props.children.props.children}
				</SyntaxHighlighter>
			</Paper>
		);
	},
	code: ({ ...props }) => (
		// This is for INLINE code
		<Box
			component="code"
			sx={{
				bgcolor: "action.hover",
				px: 0.75,
				py: 0.25,
				borderRadius: 1,
				fontFamily: "monospace",
				fontSize: "0.875rem",
			}}
			{...props}
		/>
	),
};

export function MainContent({
	prompt,
	onPromptChange,
	onRun,
	response,
	isLoading,
}: MainContentProps) {
	return (
		<Grid
			container
			direction="column"
			sx={{
				height: "100%",
				p: { xs: 2, md: 3 },
			}}
		>
			{isLoading ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
					}}
				>
					<CircularProgress />
				</Box>
			) : response ? (
				// --- THIS IS THE KEY CHANGE ---
				<MdxRuntime mdxSource={response} components={mdxComponents} />
			) : (
				<Typography
					variant="h2"
					component="h1"
					sx={{
						fontWeight: "400",
						mb: 1,
						color: "text.primary",
					}}
				>
					AI Studio
				</Typography>
			)}

			<Grid>
				<PromptInput
					prompt={prompt}
					onPromptChange={onPromptChange}
					onRun={onRun}
				/>
			</Grid>
		</Grid>
	);
}
