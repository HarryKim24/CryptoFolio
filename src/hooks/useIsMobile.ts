import { useState, useEffect } from "react";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = `(max-width: ${breakpoint}px)`;
    const media = window.matchMedia(query);

    const updateState = () => {
      const matched = media.matches;
      setIsMobile(matched);
    };

    updateState();
    media.addEventListener("change", updateState);

    return () => {
      media.removeEventListener("change", updateState);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;