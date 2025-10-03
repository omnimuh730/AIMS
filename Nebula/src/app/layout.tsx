"use client";

import * as React from "react";

import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { createTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import ScienceIcon from "@mui/icons-material/Science";
import LinearProgress from "@mui/material/LinearProgress";

import "@/app/globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

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

const CALLS_NAVIGATION = [
	{
		segment: "made",
		title: "Made",
		icon: <CallMadeIcon />,
		action: <Chip label={12} color="success" size="small" />,
	},
	{
		segment: "received",
		title: "Received",
		icon: <CallReceivedIcon />,
		action: <Chip label={4} color="error" size="small" />,
	},
];

function AppRouter({ children }: { children: React.ReactNode }) {
	const [popoverAnchorEl, setPopoverAnchorEl] =
		React.useState<HTMLButtonElement | null>(null);

	const isPopoverOpen = Boolean(popoverAnchorEl);
	const popoverId = isPopoverOpen ? "simple-popover" : undefined;

	const handlePopoverButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.stopPropagation();
		setPopoverAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = (event: React.MouseEvent) => {
		event.stopPropagation();
		setPopoverAnchorEl(null);
	};

	const popoverMenuAction = (
		<React.Fragment>
			<IconButton
				aria-describedby={popoverId}
				onClick={handlePopoverButtonClick}
			>
				<MoreHorizIcon />
			</IconButton>
			<Menu
				id={popoverId}
				open={isPopoverOpen}
				anchorEl={popoverAnchorEl}
				onClose={handlePopoverClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				disableAutoFocus
				disableAutoFocusItem
			>
				<MenuItem onClick={handlePopoverClose}>New call</MenuItem>
				<MenuItem onClick={handlePopoverClose}>
					Mark all as read
				</MenuItem>
			</Menu>
		</React.Fragment>
	);

	const navigation = [
		{
			segment: "/",
			title: "Contacts",
			icon: <PersonIcon />,
			action: <Chip label={7} color="primary" size="small" />,
		},
		{
			segment: "calls",
			title: "Calls",
			icon: <CallIcon />,
			action: popoverMenuAction,
			children: CALLS_NAVIGATION,
		},
		{
			segment: "playground",
			title: "Playground",
			icon: <ScienceIcon />,
		},
	];

	return (
		<React.Suspense fallback={<LinearProgress />}>
			<NextAppProvider
				navigation={navigation}
				branding={{
					title: "Nebula",
					logo: (
						<img
							src="https://www.svgheart.com/wp-content/uploads/2021/11/butterfly-silhouette-decorative-free-svg-file-SvgHeart.Com.png"
							alt="Nebula Logo"
							style={{ width: 36 }}
						/>
					),
				}}
				theme={demoTheme}
			>
				<DashboardLayout>{children}</DashboardLayout>
			</NextAppProvider>
		</React.Suspense>
	);
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AppRouterCacheProvider>
					<AppRouter>{children}</AppRouter>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
