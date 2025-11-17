"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type Props = {
  id?: string;
  label?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  showPasswordToggle?: boolean;
};

const AuthInput = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  disabled = false,
  showPasswordToggle = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || undefined;
  const shouldShowToggle = showPasswordToggle && isPasswordType;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-neutral-100"
        >
          {label}
        </label>
      )}
      <div className="relative rounded bg-second-gradient p-[1px]">
        <input
          id={inputId}
          type={shouldShowToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded bg-primary px-4 py-2 pr-10 text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-third disabled:cursor-not-allowed disabled:opacity-50"
        />
        {shouldShowToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-third" />
            ) : (
              <EyeIcon className="h-5 w-5 text-third" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-warning">{error}</p>}
    </div>
  );
};

export default AuthInput;