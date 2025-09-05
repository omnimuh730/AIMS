/* global chrome */
chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

// Listen for messages from the UI and forward them to the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// Actions that need to be sent to the content script
	const actionsToForward = ["highlightByPattern", "clearHighlight"];

	if (actionsToForward.includes(message.action)) {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]?.id) {
				// Forward the entire message object to the active tab
				chrome.tabs.sendMessage(tabs[0].id, message);
			}
		});
	}
});