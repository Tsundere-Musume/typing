import React, { createContext, ReactNode, useEffect, useState } from "react";


export interface SessionData {
  user_id: string;
  username: string;
}

export type SessionDataContext = {
  sessionData: SessionData | null;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>;
}

export const SessionContext = createContext<SessionDataContext>({ sessionData: null, setSessionData: () => null });

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch("http://localhost:8000/read-session", {
          credentials: "include"
        });

        if (!response.ok) {
          console.warn("Failed to retrieve session data");
        }

        const data = await response.json();

        setSessionData(data);
      } catch (e) {
        console.error(e);
      }

    }
    fetchSessionData();
  }, [])


  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
}

