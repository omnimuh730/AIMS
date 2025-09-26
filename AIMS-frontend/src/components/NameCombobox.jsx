import * as React from 'react';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import useApi from '../api/useApi';
import { useApplier } from '../context/ApplierContext.jsx';

const filter = createFilterOptions();

export default function NameCombobox() {
  const { applier, setApplier } = useApplier();
  const { get, post } = useApi();
  const [users, setUsers] = React.useState([]); // [{ _id, name }]

  const setMainUser = (user) => setApplier(user);

  // Fetch users once
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await get('account_info');
        const list = Array.isArray(data) ? data : [];
        setUsers(list);
        if (!applier && list.length) setMainUser(list[0]);
      } catch (e) {
        console.error('Error fetching account info:', e);
      }
    };
    fetchUsers();
  }, [get]);

  const ensureUserExists = async (name) => {
    const existing = users.find(u => u.name.toLowerCase() === String(name).toLowerCase());
    if (existing) return existing;
    try {
      const res = await post('account_info', { name });
      const insertedId = res?.insertedId || res?.insertedId?._id || res?.insertedId?.$oid || res?.insertedId;
      if (!insertedId) throw new Error('No insertedId');
      const user = { _id: insertedId, name };
      setUsers(prev => [...prev, user]);
      return user;
    } catch (e) {
      console.error('Error adding name:', e);
      return null;
    }
  };

  return (
    <Autocomplete
      value={applier || null}
      onChange={async (event, newValue) => {
        if (typeof newValue === 'string') {
          const created = await ensureUserExists(newValue.trim());
          if (created) setMainUser(created);
        } else if (newValue && newValue.inputValue) {
          const created = await ensureUserExists(newValue.inputValue.trim());
          if (created) setMainUser(created);
        } else {
          setMainUser(newValue || null);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, { ...params, stringify: (o) => o.name });
        const { inputValue } = params;
        const isExisting = options.some(o => o.name.toLowerCase() === inputValue.toLowerCase());
        if (inputValue !== '' && !isExisting) {
          filtered.push({ inputValue, name: `Add "${inputValue}"` });
        }
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={users}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        if (option.inputValue) return option.name; // Add "..."
        return option?.name || '';
      }}
      isOptionEqualToValue={(opt, val) => (opt?._id && val?._id ? String(opt._id) === String(val._id) : opt?.name === val?.name)}
      renderInput={(params) => (
        <TextField {...params} label="Find or Add User" placeholder="Select a user" />
      )}
      sx={{ width: 300, ml: 2 }}
    />
  );
}

