"use client";

const ErrorMessage = ({
  message,
  shake,
}: {
  message: string;
  shake: boolean;
}) => (
  <div className="h-5 mb-4 text-center">
    <p
      className={`text-warning text-sm transition-all duration-300 ease-out ${
        message ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      } ${shake ? "shake" : ""}`}
    >
      {message || "‎"}
    </p>
  </div>
);

export default ErrorMessage;