import './App.css'
import { SessionProvider } from './components/SessionContext'
import { WebsocketProvider } from './components/SocketContext'
import Game from './Game'
import HomePage from './pages/Homepage'

function App() {
	return (
		<WebsocketProvider>
			<SessionProvider>
				<Game />
			</SessionProvider>
			{/* <HomePage /> */}
		</WebsocketProvider>
	)
}

export default App
