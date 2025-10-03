import * as React from "react";
import { TextField } from "@mui/material";

interface CodeEditorProps {
	jsonSchema: string;
}

export function CodeEditor({ jsonSchema }: CodeEditorProps) {
	return (
		<TextField
			multiline
			fullWidth
			rows={15}
			value={jsonSchema}
			InputProps={{ readOnly: true }}
			variant="outlined"
			sx={{
				"& .MuiOutlinedInput-root": {
					fontFamily: "monospace",
				},
			}}
		/>
	);
}
