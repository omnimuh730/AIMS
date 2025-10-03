import * as React from "react";
import {
	Box,
	TextField,
	Select,
	MenuItem,
	IconButton,
	Button,
} from "@mui/material";
import {
	Star as StarIcon,
	StarBorder as StarBorderIcon,
	DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { Property } from "./types";

// --- RECURSIVE COMPONENT for rendering property rows ---
interface PropertyRowProps {
	property: Property;
	level: number;
	onUpdate: (id: string, newValues: Partial<Property>) => void;
	onAddNested: (parentId: string) => void;
	onDelete: (id: string) => void;
}

export function PropertyRow({
	property,
	level,
	onUpdate,
	onAddNested,
	onDelete,
}: PropertyRowProps) {
	return (
		<Box sx={{ ml: level * 4, pt: level > 0 ? 2 : 0 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
				<TextField
					placeholder="Enter property name"
					value={property.name}
					onChange={(e) =>
						onUpdate(property.id, { name: e.target.value })
					}
					size="small"
					sx={{ flexGrow: 1 }}
				/>
				<Select
					value={property.type}
					onChange={(e) =>
						onUpdate(property.id, {
							type: e.target.value as Property["type"],
						})
					}
					size="small"
				>
					<MenuItem value="string">string</MenuItem>
					<MenuItem value="number">number</MenuItem>
					<MenuItem value="integer">integer</MenuItem>
					<MenuItem value="boolean">boolean</MenuItem>
					<MenuItem value="object">object</MenuItem>
					<MenuItem value="enum">enum</MenuItem>
				</Select>
				<IconButton
					onClick={() =>
						onUpdate(property.id, { isArray: !property.isArray })
					}
					title="Make property an array"
					sx={{
						color: property.isArray
							? "primary.main"
							: "text.secondary",
					}}
				>
					<span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
						[ ]
					</span>
				</IconButton>
				<IconButton
					onClick={() =>
						onUpdate(property.id, {
							isRequired: !property.isRequired,
						})
					}
					title="Make property required"
				>
					{property.isRequired ? (
						<StarIcon sx={{ color: "#E67E22" }} />
					) : (
						<StarBorderIcon />
					)}
				</IconButton>
				<IconButton
					onClick={() => onDelete(property.id)}
					title="Delete property"
				>
					<DeleteIcon />
				</IconButton>
			</Box>
			{property.type === "object" && (
				<Button
					size="small"
					onClick={() => onAddNested(property.id)}
					sx={{ mt: 1, textTransform: "none", fontWeight: "medium" }}
				>
					Add nested property
				</Button>
			)}
			{property.children.map((child) => (
				<PropertyRow
					key={child.id}
					property={child}
					level={level + 1}
					onUpdate={onUpdate}
					onAddNested={onAddNested}
					onDelete={onDelete}
				/>
			))}
		</Box>
	);
}
