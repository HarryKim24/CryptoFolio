"use client";

import React from "react";

type Props = {
  id?: string;
  label?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

const TextInput = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  disabled = false,
}: Props) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-100 mb-1">
          {label}
        </label>
      )}
      <div className="rounded bg-second-gradient p-[1px]">
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded bg-primary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-third ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </div>
      {error && <p className="text-sm text-warning mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;