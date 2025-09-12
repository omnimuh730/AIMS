// Minimal, self-contained Tracker component used in the Extension sidepanel.
export const commonTags = ["div", "a", "span", "img", "input", "button", "li", "h1", "h2", "p", "form", "section", "header", "footer", "textarea", "label"];
export const commonProperties = ["id", "class", "name", "href", "src", "alt", "for", "type", "role", "aria-label", "data-testid"];

/* global chrome */

export const handleHighlight = (tag, property, pattern) => {
	if (!pattern) return;
	chrome.runtime.sendMessage({
		action: "highlightByPattern",
		payload: {
			componentType: tag,
			propertyName: property,
			pattern: pattern,
		},
	});
};


export const handleClear = () => {
	chrome.runtime.sendMessage({ action: "clearHighlight" });
};

// Function to send the interaction command
export const handleAction = (tag, property, pattern, order, action, actionValue, fetchType) => {
	const payload = {
		// We send the selector info again to ensure we act on the right elements
		componentType: tag,
		propertyName: property,
		pattern: pattern,
		// Action details
		order: parseInt(order, 10) || 0,
		action: action,
	};

	// Only include value when present (fill/type)
	if (actionValue !== undefined && actionValue !== null) payload.value = actionValue;
	// Include fetchType when action === 'fetch'
	if (fetchType) payload.fetchType = fetchType;

	chrome.runtime.sendMessage({
		action: "executeAction",
		payload,
	});
};

// Helper: send an executeAction and wait for a fetchResult with matching requestId.
export const sendActionAndWaitForResult = (tag, property, pattern, order, action, actionValue, fetchType, timeoutMs = 5000) => {
	const requestId = `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
	const payload = {
		componentType: tag,
		propertyName: property,
		pattern,
		order: parseInt(order, 10) || 0,
		action,
	};
	if (actionValue !== undefined && actionValue !== null) payload.value = actionValue;
	if (fetchType) payload.fetchType = fetchType;
	payload.requestId = requestId;

	return new Promise((resolve, reject) => {
		let timer = null;

		function listener(message) {
			if (message?.action === 'fetchResult' && message.payload && message.payload.requestId === requestId) {
				if (timer) clearTimeout(timer);
				try { chrome.runtime.onMessage.removeListener(listener); } catch (e) { }
				resolve(message.payload);
			}
		}

		// register listener
		chrome.runtime.onMessage.addListener(listener);

		// send the action
		chrome.runtime.sendMessage({ action: 'executeAction', payload });

		// timeout
		timer = setTimeout(() => {
			try { chrome.runtime.onMessage.removeListener(listener); } catch (e) { }
			reject(new Error('Timed out waiting for fetchResult'));
		}, timeoutMs);
	});
};
