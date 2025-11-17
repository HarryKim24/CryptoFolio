"use client";

type Props = {
  loading: boolean;
  idleText: string;
  loadingText: string;
  className?: string;
};

const SubmitButton = ({ loading, idleText, loadingText, className }: Props) => {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className={`w-full py-2 px-4 bg-secondary font-semibold rounded hover:brightness-105 transition focus:outline-none focus:ring-2 focus:ring-third disabled:opacity-60 disabled:cursor-not-allowed ${className ?? ""}`}
    >
      {loading ? loadingText : idleText}
    </button>
  );
};

export default SubmitButton;