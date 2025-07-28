"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type Props = {
  id?: string;
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
}: Props) => {
  const [show, setShow] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-100 mb-1">
          {label}
        </label>
      )}
      <div className="rounded bg-second-gradient p-[1px] relative">
        <input
          id={inputId}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 pr-10 rounded bg-primary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-third ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          tabIndex={-1}
        >
          {show ? (
            <EyeSlashIcon className="h-5 w-5 text-third" />
          ) : (
            <EyeIcon className="h-5 w-5 text-third" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-warning mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;