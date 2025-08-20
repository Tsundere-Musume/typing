import { useEffect, useState } from "react"

const Socket: React.FC = () => {
	const [message, setMessage] = useState("");

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:8000/connect");
		socket.addEventListener("open", event => {
			socket.send("establishing connection")
		});

		socket.addEventListener("message", event => {
			console.log(event.data);
			setMessage(event.data);
		});

		() => socket.close()
	}, [])

	return <>
		<h3>{message}</h3>
	</>
}

export default Socket;
