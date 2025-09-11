/* global chrome */
chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

// Actions that need to be sent to the content script
const actionsToForward = ["highlightByPattern", "clearHighlight", "executeAction"];

// --- Socket.IO client in background script to talk with backend ---
// Note: You must add `socket.io-client` to your extension build (e.g., bundle it with your build tool)
// because Chrome extensions cannot import remote modules at runtime.
let socket;
try {
	// eslint-disable-next-line no-undef
	const { io } = window.io ? window.io : require('socket.io-client');
	const BACKEND_URL = 'http://localhost:3000';
	socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] });

	socket.on('connect', () => {
		console.log('Extension background connected to backend socket, id=', socket.id);
	});

	// Listen for orders forwarded from backend
	socket.on('to-extension', (msg) => {
		console.log('Extension received to-extension message from backend:', msg);

		// Forward this message to any extension UI (panel/sidebar) so its inspector can see it and can react
		try {
			chrome.runtime.sendMessage({ action: 'to-extension', payload: msg });
		} catch (e) {
			// In some contexts chrome.runtime may not be available; ignore silently
			console.error('Error forwarding to-extension message to extension UI:', e);
		}

		// Do NOT auto-ack here. The extension UI should show a notification and then send an 'extension-ack' back to background.
	});

	socket.on('disconnect', () => {
		console.log('Extension background socket disconnected');
	});
} catch (err) {
	console.warn('Could not initialize socket.io-client in extension background. Ensure it is bundled. Error:', err);
}

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

	// UI sends an acknowledgement after showing notification
	if (message?.action === 'extension-ack') {
		try {
			console.log('Background received extension-ack from UI:', message.payload);
			if (socket && socket.connected) {
				// Forward ack to backend
				socket.emit('from-extension', message.payload);
			} else {
				console.warn('Socket not connected; cannot emit from-extension');
			}
		} catch (err) {
			console.error('Error handling extension-ack:', err);
		}
	}
});