import { FormEvent, useContext, useState } from "react";
import { SessionContext } from "../components/SessionContext";

const HomePage: React.FC = () => {
	// const { sessionData, setSessionData } = useContext(SessionContext);
	const [name, setName] = useState("")
	const [roomCode, setRoomCode] = useState("")
	const handleSumbit = (e: FormEvent) => {
		console.log("Sending data ", name, roomCode);
		e.preventDefault()
	}

	return <>
		{/* <h1>Welcome, {sessionData?.username} </h1> */}
		{/* <h2> UserID: {sessionData?.user_id} </h2> */}

		<form onClick={handleSumbit}>
			<label>
				<p>Name:</p>
				<input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
			</label>
			<label>
				<p>Room Code:</p>
				<input type="text" name="name" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
			</label>
			<button > Join </button>
		</form>

	</>
}

export default HomePage;
