import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./api/socket.jsx";
import { NotificationProvider } from "./api/notification.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
	<SocketProvider url="http://localhost:5001">
		<NotificationProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</NotificationProvider>
	</SocketProvider>
);
