import React, { useEffect,  useState } from "react";

type Props = {
  duration?: number;
  delta?: number;
}


const Timer: React.FC<Props> = ({ duration = 30, delta = 1 }) => {
  const [time, setTime] = useState<number>(duration);
  useEffect(() => {
    if(time <=0)
      return

    let timer: ReturnType<typeof setInterval> = setInterval(function() {
      setTime((prev) => prev - delta);
    }, delta * 1000);

    return () => clearInterval(timer);
  }, [time])
  return (
    <div>
      {time}
    </div>
  )
}

export default Timer;
