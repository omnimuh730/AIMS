import React, { createContext, useContext, useEffect, useRef } from 'react';

const RuntimeContext = createContext(null);

export const RuntimeProvider = ({ children }) => {
	const listenersRef = useRef(new Set());

	useEffect(() => {
		if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.onMessage) return;

		const dispatcher = (message, sender, sendResponse) => {
			// Dispatch to all registered listeners safely
			listenersRef.current.forEach((fn) => {
				try {
					fn(message, sender, sendResponse);
				} catch (e) {
					console.error('Runtime listener error:', e);
				}
			});
		};

		chrome.runtime.onMessage.addListener(dispatcher);

		return () => {
			try {
				chrome.runtime.onMessage.removeListener(dispatcher);
			} catch (e) {
				// ignore
			}
			listenersRef.current.clear();
		};
	}, []);

	const sendMessage = (message) => {
		if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
			console.warn('chrome.runtime.sendMessage not available');
			return;
		}
		chrome.runtime.sendMessage(message);
	};

	const addListener = (fn) => {
		listenersRef.current.add(fn);
	};

	const removeListener = (fn) => {
		listenersRef.current.delete(fn);
	};

	return (
		<RuntimeContext.Provider value={{ sendMessage, addListener, removeListener }}>
			{children}
		</RuntimeContext.Provider>
	);
};

export const useRuntime = () => {
	const ctx = useContext(RuntimeContext);
	if (!ctx) throw new Error('useRuntime must be used within RuntimeProvider');
	return ctx;
};

export default useRuntime;
