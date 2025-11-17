"use client";

type Props = {
  message: string;
  shake: boolean;
};

const ErrorMessage = ({ message, shake }: Props) => (
  <div className="h-5 mb-4 text-center">
    <p
      className={`text-warning text-sm transition-all duration-300 ease-out ${
        message ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      } ${shake ? "shake" : ""}`}
      aria-live="polite"
      role={message ? "alert" : undefined}
    >
      {message || "‎"}
    </p>
  </div>
);

export default ErrorMessage;