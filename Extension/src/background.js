/* global chrome */
chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

// Actions that need to be sent to the content script
const actionsToForward = ["highlightByPattern", "clearHighlight", "executeAction"];

// Messages coming from content scripts that should be relayed to the extension UI
const relayToExtension = ["fetchResult"];

// Listen for messages from the UI and forward them to the content script or to backend
chrome.runtime.onMessage.addListener((message/*, sender, sendResponse*/) => {
	if (actionsToForward.includes(message.action)) {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]?.id) {
				// Forward the entire message object to the active tab
				chrome.tabs.sendMessage(tabs[0].id, message);
			}
		});
		return;
	}

	// Relay messages coming from content scripts back to the extension (panel/UI)
	if (relayToExtension.includes(message.action)) {
		// Send a message to any open extension contexts - here we send to the runtime (panel)
		chrome.runtime.sendMessage({ action: message.action, payload: message.payload });
		return;
	}
});