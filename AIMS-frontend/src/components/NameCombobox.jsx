import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';

export default function NameCombobox() {
    const [names, setNames] = React.useState(['James Mint']);
    const [selectedValue, setSelectedValue] = React.useState(null);

    return (
        <Autocomplete
            value={selectedValue}
            onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                    if (!names.includes(newValue)) {
                        setNames((prevNames) => [...prevNames, newValue]);
                    }
                    setSelectedValue(newValue);
                } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    const newName = newValue.inputValue;
                    if (!names.includes(newName)) {
                        setNames((prevNames) => [...prevNames, newName]);
                    }
                    setSelectedValue(newName);
                } else {
                    setSelectedValue(newValue);
                }
            }}
            filterOptions={(options, params) => {
                const filtered = options.filter((option) =>
                    option.toLowerCase().includes(params.inputValue.toLowerCase())
                );

                if (params.inputValue !== '' && !options.some(option => option.toLowerCase() === params.inputValue.toLowerCase())) {
                    filtered.push({
                        inputValue: params.inputValue,
                        title: `Add "${params.inputValue}"`,
                    });
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={names}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.title;
                }
                // Regular option
                return option;
            }}
            renderOption={(props, option) => {
                return <li {...props}>{option.title || option}</li>;
            }}
            sx={{ width: 300, ml: 2 }}
            freeSolo
            renderInput={(params) => (
                <TextField {...params} label="Find or Add User" />
            )}
        />
    );
}
