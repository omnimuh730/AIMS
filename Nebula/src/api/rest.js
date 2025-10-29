
const endpoint = 'http://localhost:4000/generate';

export const generateContent = async ({
	prompt,
	systemInstruction,
	temperature,
	jsonOutput,
	modelName,
	responseSchema,
}) => {
	const res = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			prompt,
			systemInstruction,
			temperature,
			jsonOutput,
			modelName,
			responseSchema,
		}),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`HTTP ${res.status}: ${text}`);
	}

	// Backend returns raw text/plain or application/json as text
	const text = await res.text();
	return text;
};
