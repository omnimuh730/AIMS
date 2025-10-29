import * as React from "react";
import { Box, Typography, Slider } from "@mui/material";
import { SettingsItem } from "./SettingsItem";

interface TemperatureSliderProps {
	value: number;
	onChange: (value: number) => void;
}

export function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
	return (
		<Box>
			<SettingsItem label="Temperature">
				<Typography variant="body2" color="text.secondary">
					{value.toFixed(1)}
				</Typography>
			</SettingsItem>
			<Slider
				value={value}
				onChange={(e, v) => onChange(v as number)}
				aria-labelledby="temperature-slider"
				step={0.1}
				min={0}
				max={2}
			/>
		</Box>
	);
}