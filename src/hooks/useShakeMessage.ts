import { useState } from "react";

export const useShakeMessage = () => {
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);

  const trigger = (msg: string) => {
    setMessage("");
    setShake(false);

    requestAnimationFrame(() => {
      setMessage(msg);
      setShake(true);
    });
  };

  const reset = () => {
    setMessage("");
    setShake(false);
  };

  return { message, shake, trigger, reset };
};