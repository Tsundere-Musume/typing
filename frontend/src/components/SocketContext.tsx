import { createContext, ReactNode, useEffect, useRef, useState } from "react"

type WebsocketContextType = [boolean, string | null, ((data: string) => void) | undefined]
export const WebsocketContext = createContext<WebsocketContextType>([false, null, () => { }])

export const WebsocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isReady, setIsReady] = useState(false)
	const [val, setVal] = useState("")

	const ws = useRef<WebSocket | null>(null)

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:8000/connect")

		socket.onopen = () => setIsReady(true)
		socket.onclose = () => setIsReady(false)
		socket.onmessage = (event) => setVal(event.data)

		ws.current = socket

	}, [])

	const send = ws.current?.send.bind(ws.current)
	const contextValues = [isReady, val, send] as WebsocketContextType;

	return (
		<WebsocketContext.Provider value={contextValues}>
			{children}
		</WebsocketContext.Provider>
	)
}
