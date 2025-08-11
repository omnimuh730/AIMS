// src/contentScript.js
function highlightAllElements() {
	const elements = document.body.querySelectorAll("*");
	elements.forEach((el) => {
		el.style.outline = "1px solid red";
	});
}
/* global chrome */
chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "highlight") {
		highlightAllElements();
	}
});
