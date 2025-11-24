import { useState } from "react";

export const useShakeMessage = () => {
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);

  const trigger = (text: string) => {
    setMessage("");
    setShake(false);

    const run = () => {
      setMessage(text);
      setShake(true);
    };

    requestAnimationFrame(run);
  };

  const reset = () => {
    setMessage("");
    setShake(false);
  };

  return {
    message,
    shake,
    trigger,
    reset,
  };
};