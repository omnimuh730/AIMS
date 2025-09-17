if (typeof window.contentScriptInjected === 'undefined') {
	window.contentScriptInjected = true;

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
		const p = (pattern || '').replace(/"/g, '\\"');
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

	// Wait up to timeoutMs for elements to appear (polling). Returns NodeList or null.
	function waitForElements(componentType, propertyName, pattern, timeoutMs = 2000, intervalMs = 100) {
		const start = Date.now();
		return new Promise((resolve) => {
			const check = () => {
				const els = findElements(componentType, propertyName, pattern);
				if (els && els.length > 0) return resolve(els);
				if (Date.now() - start >= timeoutMs) return resolve(null);
				setTimeout(check, intervalMs);
			};
			check();
		});
	}

	/**
	 * Applies a colored outline and a label to a single DOM element.
	 * @param {HTMLElement} element The element to highlight.
	 * @param {string} color The color of the outline (e.g., 'red', 'blue').
	 */
	function applyHighlight(element, color) {
		if (element.hasAttribute("data-highlighter-outline")) return;
		if (!element.getBoundingClientRect().width || !element.getBoundingClientRect().height) return;
		const originalOutline = element.style.outline;
		element.setAttribute("data-highlighter-original-outline", originalOutline || "");
		element.setAttribute("data-highlighter-id", highlightCounter);
		element.style.outline = `2px solid ${color}`;
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

	/**
	 * Types a string into an input element character by character to simulate smooth typing.
	 * @param {HTMLElement} element The input or textarea element.
	 * @param {string} text The string to type.
	 */
	function typeSmoothly(element, text) {
		let i = 0;
		element.value = ''; // Clear the field first
		const interval = setInterval(() => {
			if (i < text.length) {
				element.value += text.charAt(i);
				// Dispatch an 'input' event to make sure any attached JS listeners fire
				element.dispatchEvent(new Event('input', { bubbles: true }));
				i++;
			} else {
				clearInterval(interval);
				// Dispatch a final 'change' event
				element.dispatchEvent(new Event('change', { bubbles: true }));
			}
		}, 50); // 50ms interval between keystrokes
	}

	/**
	 * Finds a specific element and performs an action on it.
	 * @param {object} payload The details of the action to execute.
	 */
	async function performActionOnElement(payload) {
		const { componentType, propertyName, pattern, order, action, value } = payload;
		let elements = findElements(componentType, propertyName, pattern);

		if (!elements || elements.length === 0) {
			// Try waiting briefly for dynamic content
			console.debug('performAction: no elements found, waiting for DOM updates', { componentType, propertyName, pattern });
			elements = await waitForElements(componentType, propertyName, pattern, 2000, 100);
		}

		if (!elements || elements.length === 0) {
			console.log("Action failed: No elements found matching the criteria.");
			return;
		}

		if (order >= elements.length) {
			console.log(`Action failed: Order is ${order}, but only ${elements.length} elements were found.`);
			return;
		}

		const targetElement = elements[order];
		targetElement.focus(); // Focus the element first for a better user experience

		switch (action) {
			case "click":
				targetElement.click();
				break;
			case "fill":
				targetElement.value = value;
				// Dispatch events to let the page's JS know the value has changed
				targetElement.dispatchEvent(new Event('input', { bubbles: true }));
				targetElement.dispatchEvent(new Event('change', { bubbles: true }));
				break;
			case "typeSmoothly":
				typeSmoothly(targetElement, value);
				break;
			default:
				break;
		}
	}


	/* global chrome */
	// Listener: handle highlight/clear/executeAction. For 'fetch' executeAction, return data back to extension.
	chrome.runtime.onMessage.addListener(async (message) => {
		if (message.action === "highlightByPattern") {
			clearHighlights();
			const { componentType, propertyName, pattern } = message.payload;
			highlightByPattern(componentType, propertyName, pattern, 'red');

		} else if (message.action === "clearHighlight") {
			clearHighlights();

		} else if (message.action === "executeAction") {
			// If action is 'fetch', handle separately and return result to extension via background relay
			if (message.payload && message.payload.action === 'fetch') {
				const { componentType, propertyName, pattern, order = 0, fetchType } = message.payload;
				// Try immediate query first
				let elements = findElements(componentType, propertyName, pattern);
				if (!elements || elements.length === 0) {
					console.debug('fetch: no elements found, waiting briefly for DOM updates', { componentType, propertyName, pattern });
					elements = await waitForElements(componentType, propertyName, pattern, 2000, 100);
				}

				if (!elements || elements.length === 0) {
					chrome.runtime.sendMessage({ action: 'fetchResult', payload: { identifier: message.payload?.identifier || message.payload?.requestId, success: false, data: null, error: 'No elements found' } });
					return;
				}

				if (order >= elements.length) {
					chrome.runtime.sendMessage({ action: 'fetchResult', payload: { identifier: message.payload?.identifier || message.payload?.requestId, success: false, data: null, error: `Order ${order} out of range` } });
					return;
				}

				const target = elements[order];
				try {
					let data = null;
					if (fetchType === 'text') {
						data = target.innerText;
					} else {
						// default to content -> outerHTML
						data = target.outerHTML;
					}
					console.debug('fetch: returning data', { identifier: message.payload?.identifier || message.payload?.requestId, length: data ? data.length : 0 });
					chrome.runtime.sendMessage({ action: 'fetchResult', payload: { identifier: message.payload?.identifier || message.payload?.requestId, success: true, data } });
				} catch (err) {
					console.error('fetch: error while extracting data', err);
					chrome.runtime.sendMessage({ action: 'fetchResult', payload: { identifier: message.payload?.identifier || message.payload?.requestId, success: false, data: null, error: String(err) } });
				}
				return;
			}

			// otherwise, perform the action (click/fill/type)
			await performActionOnElement(message.payload);
		}
	});
}