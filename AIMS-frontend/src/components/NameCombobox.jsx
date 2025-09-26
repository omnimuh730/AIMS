import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import useApi from '../api/useApi'; // Import useApi
import { useApplier } from '../context/ApplierContext.jsx';

export default function NameCombobox() {
	const [names, setNames] = React.useState([]);
	const [namesItem, setNamesItem] = React.useState([]);
	const { applier, setApplier } = useApplier();

	const { get, post } = useApi(); // Initialize useApi without arguments

	const setMainUser = (mainUserObject) => {
		// Persist for reloads but drive UI via Context
		try { localStorage.setItem('mainUser', JSON.stringify(mainUserObject)); } catch {}
		setApplier(mainUserObject);
	}

	// Fetch initial names from backend
	React.useEffect(() => {
		const fetchNames = async () => {
			try {
				const data = await get('account_info'); // Use get from useApi
				if (data && data.length > 0) {
					if (!applier) {
						// Initialize from localStorage if present, else first entry
						try {
							const saved = localStorage.getItem('mainUser');
							if (saved) {
								const parsed = JSON.parse(saved);
								const foundUser = data.find(user => user._id === parsed._id);
								setMainUser(foundUser || data[0]);
							} else {
								setMainUser(data[0]);
							}
						} catch { setMainUser(data[0]); }
					}
				}
				setNames(data.map(item => item.name));
				setNamesItem(data);
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
				return result.insertId;
			} else {
				console.error('Failed to add name to backend via useApi');
				return -1
			}
		} catch (err) {
			console.error('Error adding name:', err);
			return -1;
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
			value={applier ? applier.name : ''}
			onChange={async (event, newValue) => {
				if (typeof newValue === 'string') {
					// User typed a new value and pressed Enter
					if (!names.includes(newValue)) {
						const added = await handleAddName(newValue);
						if (added !== -1) {
							setMainUser({ _id: added, name: newValue });
						}
					} else {
						setMainUser({ _id: namesItem.find(item => item.name === newValue)._id, name: newValue });
						//						setSelectedValue(newValue);
					}
				} else if (newValue && newValue.inputValue) {
					// User selected the "Add..." option
					const newName = newValue.inputValue;
					const added = await handleAddName(newName);
					if (added !== -1) {
						setMainUser({ _id: added, name: newValue });
					}
				} else {
					const found = namesItem.find(item => item.name === newValue);
					if (found) setMainUser({ _id: found._id, name: found.name });
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
