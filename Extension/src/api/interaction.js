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
// handleAction: send an executeAction to the content script.
// If `identifier` is provided it will be attached to the payload so
// content script / background can echo it back in `fetchResult`.
export const handleAction = (tag, property, pattern, order, action, actionValue, fetchType, identifier) => {
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
	// Attach identifier (optional) so responses can be correlated
	if (identifier) payload.identifier = identifier;

	chrome.runtime.sendMessage({
		action: "executeAction",
		payload,
	});
};

// Note: the previous helper `sendActionAndWaitForResult` was intentionally removed.
// We now recommend callers use `handleAction(..., identifier)` and listen for
// `fetchResult` messages (which will contain `identifier`) and store/observe
// them in component state.
