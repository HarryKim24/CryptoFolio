export const triggerError = (
  setError: (value: string) => void,
  setShake: (value: boolean) => void,
  message: string
) => {
  setError('');
  setShake(false);

  const run = () => {
    setError(message);
    setShake(true);
  };

  requestAnimationFrame(run);
};