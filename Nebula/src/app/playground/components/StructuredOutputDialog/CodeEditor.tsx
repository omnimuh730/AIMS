import * as React from "react";
import { TextField } from "@mui/material";

interface CodeEditorProps {
	jsonSchema: string;
	onJsonSchemaChange: (newSchema: string) => void;
}

export function CodeEditor({
	jsonSchema,
	onJsonSchemaChange,
}: CodeEditorProps) {
	return (
		<TextField
			multiline
			fullWidth
			rows={15}
			value={jsonSchema}
			onChange={(e) => onJsonSchemaChange(e.target.value)}
			variant="outlined"
			sx={{
				"& .MuiOutlinedInput-root": {
					fontFamily: "monospace",
				},
			}}
		/>
	);
}
