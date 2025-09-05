let highlightCounter = 1;
let highlightLabels = [];

function clearHighlights() {
	highlightLabels.forEach((label) => label.remove());
	highlightLabels = [];
	document.querySelectorAll("[data-highlighter-outline]").forEach((el) => {
		el.style.outline =
			el.getAttribute("data-highlighter-original-outline") || "";
		el.removeAttribute("data-highlighter-outline");
		el.removeAttribute("data-highlighter-original-outline");
		el.removeAttribute("data-highlighter-id");
	});
	highlightCounter = 1;
}

/**
 * Finds elements based on component type, a specific property, and a pattern.
 * @param {string} componentType The tag name of the element (e.g., 'div', 'input').
 * @param {string} propertyName The attribute to search against (e.g., 'id', 'class', 'name', 'href').
 * @param {string} pattern The pattern to match against the property's value.
 *   - 'text?' -> starts with 'text'
 *   - '?text?' -> contains 'text'
 *   - '?text' -> ends with 'text'
 *   - 'text' -> exact match
 * @returns {NodeListOf<HTMLElement>} A collection of matching elements.
 */
function findElements(componentType, propertyName, pattern) {
	let selector;
    // Escape double quotes in the pattern to prevent breaking the selector
    const p = pattern.replace(/"/g, '\\"');

	if (pattern.startsWith("?") && pattern.endsWith("?")) {
		selector = `${componentType}[${propertyName}*="${p.slice(1, -1)}"]`;
	} else if (pattern.endsWith("?")) {
		selector = `${componentType}[${propertyName}^="${p.slice(0, -1)}"]`;
	} else if (pattern.startsWith("?")) {
		selector = `${componentType}[${propertyName}$="${p.slice(1)}"]`;
	} else {
		selector = `${componentType}[${propertyName}="${p}"]`;
	}

	return document.querySelectorAll(selector);
}


/**
 * Applies a colored outline and a label to a single DOM element.
 * @param {HTMLElement} element The element to highlight.
 * @param {string} color The color of the outline (e.g., 'red', 'blue').
 */
function applyHighlight(element, color) {
	// Skip elements that are already highlighted or not visible
	if (element.hasAttribute("data-highlighter-outline")) return;
	if (!element.getBoundingClientRect().width || !element.getBoundingClientRect().height) return;

	const originalOutline = element.style.outline;
	element.setAttribute(
		"data-highlighter-original-outline",
		originalOutline || ""
	);
	element.setAttribute("data-highlighter-id", highlightCounter);
	element.style.outline = `2px solid ${color}`; // Made the line thicker for better visibility
	element.setAttribute("data-highlighter-outline", "true");

	addLabel(element, highlightCounter);
	highlightCounter++;
}

/**
 * A helper function that finds and highlights elements matching a pattern.
 * @param {string} componentType The tag name (e.g., 'div').
 * @param {string} propertyName The attribute to search against.
 * @param {string} pattern The pattern for the property's value.
 * @param {string} color The highlight color.
 */
function highlightByPattern(componentType, propertyName, pattern, color) {
    const elementsToHighlight = findElements(componentType, propertyName, pattern);
    elementsToHighlight.forEach(el => applyHighlight(el, color));
    console.log(`Found and highlighted ${elementsToHighlight.length} elements.`);
}


function addLabel(el, id) {
	const rect = el.getBoundingClientRect();
	const label = document.createElement("div");
	label.textContent = id;
	label.style.position = "fixed";
	label.style.left = `${rect.left + window.scrollX}px`;
	label.style.top = `${rect.top + window.scrollY - 14}px`;
	label.style.background = "red";
	label.style.color = "white";
	label.style.fontSize = "12px";
	label.style.fontWeight = "bold";
	label.style.padding = "0 3px";
	label.style.border = "1px solid black";
	label.style.zIndex = 999999;
	label.style.pointerEvents = "none";

	document.body.appendChild(label);
	highlightLabels.push(label);
}

// buildDOMTree function remains the same...
function buildDOMTree(node) {
	if (node.nodeType !== Node.ELEMENT_NODE) {
		return null;
	}
	const obj = {};
	const tagName = node.tagName.toLowerCase();
	obj.tag = tagName;
	const highlighterId = node.getAttribute("data-highlighter-id");
	if (highlighterId) {
		obj.highlightId = parseInt(highlighterId, 10);
	}
	if (node.attributes.length > 0) {
		obj.attributes = {};
		for (let attr of node.attributes) {
			obj.attributes[attr.name] = attr.value;
		}
	}
	const text = node.textContent.trim();
	if (text && text.length > 0 && node.children.length === 0) {
		obj.text = text;
	}
	if (node.children.length > 0) {
		obj.children = [];
		for (let child of node.children) {
			const childObj = buildDOMTree(child);
			if (childObj) obj.children.push(childObj);
		}
	}
	return obj;
}


/* global chrome */
// Updated listener to handle the new detailed message
chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "highlightByPattern") {
		clearHighlights(); // Clear previous highlights first
		const { componentType, propertyName, pattern } = message.payload;
		highlightByPattern(componentType, propertyName, pattern, 'red');

        // Optional: Build and log the DOM tree after highlighting
        const tree = buildDOMTree(document.body);
	    console.log("DOM Tree Hierarchy JSON:", tree);

	} else if (message.action === "clearHighlight") {
		clearHighlights();
	}
});