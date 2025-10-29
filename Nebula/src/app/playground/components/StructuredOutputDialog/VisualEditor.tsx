import * as React from "react";
import { Paper, Typography, Button } from "@mui/material";
import { PropertyRow } from "./PropertyRow";
import { Property } from "./types";

interface VisualEditorProps {
	properties: Property[];
	onUpdate: (id: string, newValues: Partial<Property>) => void;
	onAdd: (parentId: string | null) => void;
	onDelete: (id: string) => void;
}

export function VisualEditor({
	properties,
	onUpdate,
	onAdd,
	onDelete,
}: VisualEditorProps) {
	return (
		<Paper variant="outlined" sx={{ p: "16px 24px", borderRadius: 2 }}>
			<Typography variant="overline" color="text.secondary">
				Property
			</Typography>
			{properties.map((prop) => (
				<PropertyRow
					key={prop.id}
					property={prop}
					level={0}
					onUpdate={onUpdate}
					onAddNested={onAdd}
					onDelete={onDelete}
				/>
			))}
			<Button
				size="small"
				onClick={() => onAdd(null)}
				sx={{
					mt: 2,
					textTransform: "none",
					fontWeight: "medium",
				}}
			>
				Add property
			</Button>
		</Paper>
	);
}
