// src/components/MdxRuntime.tsx
import * as React from "react";
import { useEffect, useState } from "react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { CircularProgress, Typography } from "@mui/material";

interface MdxRuntimeProps {
	mdxSource: string;
	// Allow passing custom components, same as before
	components?: React.ComponentProps<typeof MDXProvider>["components"];
}

// This component will do the heavy lifting of compiling the string
const MdxContent = ({ mdxSource }: { mdxSource: string }) => {
	const [mdxModule, setMdxModule] = useState<any>(null);
	const [error, setError] = useState<Error | null>(null);
	const components = useMDXComponents();

	useEffect(() => {
		let isMounted = true;
		const compile = async () => {
			try {
				const mod = await evaluate(mdxSource, {
					...runtime,
					// Add any remark/rehype plugins here if needed
				});
				if (isMounted) {
					setMdxModule(mod);
					setError(null);
				}
			} catch (e: any) {
				if (isMounted) {
					setError(e);
				}
			}
		};
		compile();

		return () => {
			isMounted = false;
		};
	}, [mdxSource]);

	if (error) {
		return (
			<Typography color="error">
				Error compiling MDX: {error.message}
			</Typography>
		);
	}

	if (!mdxModule) {
		return <CircularProgress />;
	}

	// The compiled module has a `default` export which is the component
	const Content = mdxModule.default;
	return <Content components={components} />;
};

// This is the exported component you will use in your app
export function MdxRuntime({ mdxSource, components = {} }: MdxRuntimeProps) {
	return (
		<MDXProvider components={components}>
			<MdxContent mdxSource={mdxSource} />
		</MDXProvider>
	);
}
