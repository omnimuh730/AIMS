import { useState, useEffect } from 'react';

export default function useDebouncedValue(value, delay = 2000) {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);

	return debounced;
}
