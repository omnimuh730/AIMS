// The file path may be different based on your project structure
// --- REMOVED MdxRuntime ---
// import { MdxRuntime } from "./MdxRuntime";

// +++ ADDED react-markdown IMPORTS +++
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import * as React from "react";
import {
	Box,
	Typography,
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
import { JsonTreeView } from "./JsonTreeView";

// --- Markdown Rendering Imports (only needed for styling components) ---
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

// --- THIS COMPONENT MAP WORKS GREAT FOR react-markdown TOO! ---
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

	// --- ADJUSTED FOR react-markdown ---
	// `pre` is the container for a code block. We'll use it for styling.
	pre: ({ children }) => (
		<Paper
			elevation={0}
			sx={{
				my: 2,
				backgroundColor: "#f5f5f5",
				overflow: "auto",
				borderRadius: 1,
			}}
		>
			<pre style={{ margin: 0, padding: "16px" }}>{children}</pre>
		</Paper>
	),
	// `code` is the actual code content. react-markdown gives us props to
	// differentiate between inline code and code blocks.
	code: ({ node, inline, className, children, ...props }) => {
		const match = /language-(\w+)/.exec(className || "");
		if (!inline && match) {
			return (
				<SyntaxHighlighter
					style={oneLight}
					language={match[1]}
					PreTag="div"
					{...props}
				>
					{String(children).replace(/\n$/, "")}
				</SyntaxHighlighter>
			);
		}
		// This is for INLINE code
		return (
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
			>
				{children}
			</Box>
		);
	},
};

const isJsonString = (str) => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

export function MainContent({
	prompt,
	onPromptChange,
	onRun,
	response,
	isLoading,
}) {
	const renderResponse = () => {
		if (isLoading) {
			return (
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
			);
		}

		if (!response) {
			return (
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
			);
		}

		if (isJsonString(response)) {
			const jsonData = JSON.parse(response);
			return <JsonTreeView data={jsonData} />;
		}

		return (
			<ReactMarkdown
				components={mdxComponents}
				remarkPlugins={[remarkGfm]}
			>
				{response}
			</ReactMarkdown>
		);
	};

	return (
		<Box
			sx={{
				height: "100%",
				p: { xs: 2, md: 3 },
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box sx={{ flexGrow: 1, mb: 2 }}>
				{renderResponse()}
			</Box>

			<Box>
				<PromptInput
					prompt={prompt}
					onPromptChange={onPromptChange}
					onRun={onRun}
					response={response}
				/>
			</Box>
		</Box>
	);
}
