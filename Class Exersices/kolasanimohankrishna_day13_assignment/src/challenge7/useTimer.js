import { useState, useEffect, useRef } from "react";

const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const start = () => setIsActive(true);
  const stop = () => {
    setIsActive(false);
    clearInterval(intervalRef.current);
  };
  const reset = () => {
    setSeconds(0);
    setIsActive(false);
    clearInterval(intervalRef.current);
  };

  return { seconds, start, stop, reset, isActive };
};

export default useTimer;