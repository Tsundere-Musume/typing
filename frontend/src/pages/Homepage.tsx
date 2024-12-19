import { useContext } from "react";
import { SessionContext } from "../components/SessionContext";

const HomePage: React.FC = () => {
  const { sessionData, setSessionData } = useContext(SessionContext);

  return <>
    <h1>Welcome, {sessionData?.username} </h1>
    <h2> UserID: {sessionData?.user_id} </h2>
  </>
}

export default HomePage;
