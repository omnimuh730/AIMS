import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackbarProvider } from 'notistack'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
	palette: {
		mode: 'light',
	},
});

createRoot(document.getElementById('root')).render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<SnackbarProvider maxSnack={3}>
			<App />
		</SnackbarProvider>
	</ThemeProvider>
)
