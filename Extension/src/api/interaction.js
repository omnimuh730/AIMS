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
export const handleAction = (tag, property, pattern, order, action, actionValue) => {
	chrome.runtime.sendMessage({
		action: "executeAction",
		payload: {
			// We send the selector info again to ensure we act on the right elements
			componentType: tag,
			propertyName: property,
			pattern: pattern,
			// Action details
			order: parseInt(order, 10) || 0,
			action: action,
			value: actionValue,
		}
	});
};