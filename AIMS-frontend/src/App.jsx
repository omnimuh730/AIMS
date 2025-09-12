import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider } from "@toolpad/core/internal";

import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import TestPage from "./pages/TestPage";
import AutomationPage from "./pages/AutomationPage";
import { AutoAwesome, Settings, Visibility } from "@mui/icons-material";

import useSocket from "./api/useSocket";
import useNotification from "./api/useNotification";

import { SOCKET_PROTOCOL } from "../../configs/socket_protocol";
import { SOCKET_MESSAGE } from "../../configs/message_template";

const NAVIGATION = [
	{
		kind: "header",
		title: "Main items",
	},
	{
		segment: "dashboard",
		title: "Dashboard",
		icon: <DashboardIcon />,
	},
	{
		segment: "automation",
		title: "Automation",
		icon: <AutoAwesome />,
	},
	{
		kind: "divider",
	},
	{
		kind: "header",
		title: "Analytics",
	},
	{
		segment: "reports",
		title: "Reports",
		icon: <BarChartIcon />,
		children: [
			{
				segment: "sales",
				title: "Sales",
				icon: <DescriptionIcon />,
			},
			{
				segment: "traffic",
				title: "Traffic",
				icon: <DescriptionIcon />,
			},
		],
	},
	{
		segment: "settings",
		title: "Settings",
		icon: <Settings />,
	},
	{
		segment: "logs",
		title: "Logs",
		icon: <Visibility />,
	},
];

const demoTheme = createTheme({
	cssVariables: {
		colorSchemeSelector: "data-toolpad-color-scheme",
	},
	colorSchemes: { light: true, dark: true },
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 600,
			lg: 1200,
			xl: 1536,
		},
	},
});

// Custom router that bridges React Router with Toolpad
function useCustomRouter() {
	const location = useLocation();
	const navigate = useNavigate();

	return {
		pathname: location.pathname,
		push: (path) => navigate(path),
		replace: (path) => navigate(path, { replace: true }),
		navigate: (path) => navigate(path), // Add navigate function that Toolpad expects
	};
}

function AppContent() {
	return (
		<Routes>
			<Route path="/dashboard" element={<DashboardPage />} />
			<Route path="/logs" element={<TestPage />} />
			<Route path="/test" element={<TestPage />} />
			<Route path="/automation" element={<AutomationPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

function App(props) {
	const { window } = props;
	const router = useCustomRouter();
	const demoWindow = window !== undefined ? window() : undefined;

	const socket = useSocket();
	const notification = useNotification();

	useEffect(() => {

		if (socket) {
			socket.on("connect", () => {
				notification.success("Socket connected");
			});

			socket.on(SOCKET_PROTOCOL.TYPE.CONNECTION, (data) => {
				console.log("Received connection event:", data);
				switch (data.payload.purpose) {
					case SOCKET_PROTOCOL.IDENTIFIER.PURPOSE.CHECK_CONNECTIONS:
						if (data.payload.src === SOCKET_PROTOCOL.LOCATION.EXTENSION && data.payload.tgt === SOCKET_PROTOCOL.LOCATION.FRONTEND) {
							//Level 2 Connection check -> Reply to Extension
							socket.emit(SOCKET_PROTOCOL.TYPE.CONNECTION, {
								...data.payload,
								timestamp: new Date().toISOString(),
								src: SOCKET_PROTOCOL.LOCATION.FRONTEND,
								tgt: SOCKET_PROTOCOL.LOCATION.EXTENSION,
							});
						}
				}
			});

			socket.on("disconnect", (reason) => {
				notification.error(`Socket disconnected: ${reason}`);
			});
		}
	}, [socket, notification]);

	return (
		<DemoProvider window={demoWindow}>
			<AppProvider
				navigation={NAVIGATION}
				router={router}
				theme={demoTheme}
				window={demoWindow}
			>
				<DashboardLayout>
					{/* Only the content area is routed */}
					<AppContent />
				</DashboardLayout>
			</AppProvider>
		</DemoProvider>
	);
}

App.propTypes = {
	window: PropTypes.func,
};

export default App;
