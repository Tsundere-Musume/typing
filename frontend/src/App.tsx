import './App.css'
import { WebsocketProvider } from './components/SocketContext'
import Game from './Game'

function App() {
	return (
		<WebsocketProvider>
			<Game />
		</WebsocketProvider>
	)
}

export default App
