import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SocketProvider } from './api/socket.jsx'
import { NotificationProvider } from './api/notification.jsx'
import { RuntimeProvider } from './api/runtime.jsx'

createRoot(document.getElementById('root')).render(
	<SocketProvider url="http://192.168.9.110:5001">
		<NotificationProvider>
			<RuntimeProvider>
				<App />
			</RuntimeProvider>
		</NotificationProvider>
	</SocketProvider>
)
