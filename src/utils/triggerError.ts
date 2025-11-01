export const triggerError = (
  setError: (v: string) => void,
  setShake: (v: boolean) => void,
  message: string
) => {
  setError("");
  setShake(false);
  requestAnimationFrame(() => {
    setError(message);
    setShake(true);
  });
};