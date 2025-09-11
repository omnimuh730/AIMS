import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SocketProvider } from './api/socket.jsx'
import { NotificationProvider } from './api/notification.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<SocketProvider url="http://localhost:3000">
			<NotificationProvider>
				<App />
			</NotificationProvider>
		</SocketProvider>
	</StrictMode>,
)
