import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import useApi from '../api/useApi'; // Import useApi

export default function NameCombobox() {
    const [names, setNames] = React.useState([]);
    const [selectedValue, setSelectedValue] = React.useState(null);

    const { get, post, request, loading, error } = useApi(); // Initialize useApi without arguments

    // Fetch initial names from backend
    React.useEffect(() => {
        const fetchNames = async () => {
            try {
                const data = await get('account_info'); // Use get from useApi
                setNames(data.map(item => item.name));
            } catch (err) {
                console.error('Error fetching account info:', err);
            }
        };
        fetchNames();
    }, [get]); // Add 'get' to dependency array

    const handleAddName = async (name) => {
        try {
            const result = await post('account_info', { name }); // Use post from useApi
            if (result) { // Assuming post returns a truthy value on success
                setNames((prevNames) => [...prevNames, name]);
                return true; // Indicate success
            } else {
                console.error('Failed to add name to backend via useApi');
                return false;
            }
        } catch (err) {
            console.error('Error adding name:', err);
            return false;
        }
    };

    // handleRemoveName is no longer directly used by Autocomplete, but might be useful for future
    // const handleRemoveName = async (nameToRemove) => {
    //     try {
    //         const response = await request(`account_info/${nameToRemove}`, { method: 'DELETE' }); // Use request for DELETE
    //         if (response) {
    //             setNames((prevNames) => prevNames.filter((name) => name !== nameToRemove));
    //         } else {
    //             console.error('Failed to remove name from backend via useApi');
    //         }
    //     } catch (err) {
    //         console.error('Error removing name:', err);
    //     }
    // };

    return (
        <Autocomplete
            freeSolo
            value={selectedValue}
            onChange={async (event, newValue) => {
                if (typeof newValue === 'string') {
                    // User typed a new value and pressed Enter
                    if (!names.includes(newValue)) {
                        const added = await handleAddName(newValue);
                        if (added) {
                            setSelectedValue(newValue);
                        }
                    } else {
                        setSelectedValue(newValue);
                    }
                } else if (newValue && newValue.inputValue) {
                    // User selected the "Add..." option
                    const newName = newValue.inputValue;
                    const added = await handleAddName(newName);
                    if (added) {
                        setSelectedValue(newName);
                    }
                } else {
                    // User selected an existing option
                    setSelectedValue(newValue);
                }
            }}
            filterOptions={(options, params) => {
                const filtered = options.filter((option) =>
                    option.toLowerCase().includes(params.inputValue.toLowerCase())
                );

                // Suggest the creation of a new value if it doesn't exist
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
                if (typeof option === 'string') {
                    return option;
                }
                if (option.inputValue) {
                    return option.title;
                }
                return option;
            }}
            renderOption={(props, option) => {
                const { key, ...rest } = props; // Extract key
                return <li key={key} {...rest}>{option.title || option}</li>; // Use key directly
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Find or Add User"
                    placeholder="Select a user"
                />
            )}
            sx={{ width: 300, ml: 2 }}
        />
    );
}