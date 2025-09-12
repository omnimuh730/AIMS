import { useState, useCallback } from 'react';

export default function useApi(baseUrl = '') {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const request = useCallback(async (path, options = {}) => {
		setLoading(true);
		setError(null);
		try {
			const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}` : path;
			const res = await fetch(url, {
				headers: { 'Content-Type': 'application/json' },
				...options,
				body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
			});
			const text = await res.text();
			let data = text;
			try { data = text ? JSON.parse(text) : null; } catch (e) { }
			if (!res.ok) {
				const err = new Error('Request failed');
				err.status = res.status;
				err.data = data;
				throw err;
			}
			setLoading(false);
			return data;
		} catch (err) {
			setError(err);
			setLoading(false);
			throw err;
		}
	}, [baseUrl]);

	const get = useCallback((path) => request(path, { method: 'GET' }), [request]);
	const post = useCallback((path, body) => request(path, { method: 'POST', body }), [request]);

	return { loading, error, get, post, request };
}
