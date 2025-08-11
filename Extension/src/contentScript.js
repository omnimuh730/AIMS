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

function isInteractive(el) {
	const tag = el.tagName.toLowerCase();
	const interactiveTags = [
		"button",
		"a",
		"input",
		"select",
		"textarea",
		"option",
	];
	const role = el.getAttribute("role");

	return (
		interactiveTags.includes(tag) ||
		el.tabIndex >= 0 ||
		(role &&
			[
				"button",
				"link",
				"checkbox",
				"textbox",
				"radio",
				"combobox",
				"switch",
			].includes(role))
	);
}

function addLabel(el, id) {
	const rect = el.getBoundingClientRect();
	const label = document.createElement("div");
	label.textContent = id;
	label.style.position = "fixed";
	label.style.left = `${rect.left + window.scrollX}px`;
	label.style.top = `${rect.top + window.scrollY - 14}px`;
	label.style.background = "yellow";
	label.style.color = "black";
	label.style.fontSize = "12px";
	label.style.fontWeight = "bold";
	label.style.padding = "0 3px";
	label.style.border = "1px solid black";
	label.style.zIndex = 999999;
	label.style.pointerEvents = "none";

	document.body.appendChild(label);
	highlightLabels.push(label);
}

function highlightAllElements() {
	clearHighlights();
	const elements = document.body.querySelectorAll("*");
	elements.forEach((el) => {
		if (el === document.body || el === document.documentElement) return;
		if (
			!el.getBoundingClientRect().width ||
			!el.getBoundingClientRect().height
		)
			return; // skip invisible

		const originalOutline = el.style.outline;
		el.setAttribute(
			"data-highlighter-original-outline",
			originalOutline || ""
		);
		el.setAttribute("data-highlighter-id", highlightCounter);

		if (isInteractive(el)) {
			el.style.outline = "1px solid blue";
		} else {
			el.style.outline = "1px solid red";
		}
		el.setAttribute("data-highlighter-outline", "true");

		addLabel(el, highlightCounter);
		highlightCounter++;
	});

	// Build DOM JSON and log once
	const tree = buildDOMTree(document.body);
	console.log("DOM Tree Hierarchy JSON:", tree);
}

function buildDOMTree(node) {
	if (node.nodeType !== Node.ELEMENT_NODE) {
		return null;
	}

	const obj = {};
	const tagName = node.tagName.toLowerCase();
	obj.tag = tagName;

	// Assigned highlight ID (if exists)
	const highlighterId = node.getAttribute("data-highlighter-id");
	if (highlighterId) {
		obj.highlightId = parseInt(highlighterId, 10);
	}

	// Attributes
	if (node.attributes.length > 0) {
		obj.attributes = {};
		for (let attr of node.attributes) {
			obj.attributes[attr.name] = attr.value;
		}
	}

	// Text content (trimmed, if any)
	const text = node.textContent.trim();
	if (text && text.length > 0 && node.children.length === 0) {
		obj.text = text;
	}

	// Children
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
chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "highlight") {
		highlightAllElements();
	} else if (message.action === "clearHighlight") {
		clearHighlights();
	}
});
