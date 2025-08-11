/* global chrome */
chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "highlight") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]?.id) {
				chrome.tabs.sendMessage(tabs[0].id, { action: "highlight" });
			}
		});
	}
});
