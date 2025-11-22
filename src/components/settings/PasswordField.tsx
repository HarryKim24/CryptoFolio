"use client";

import React from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  isVisible,
  onToggleVisibility,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-third font-semibold pb-1">{label}</label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 pr-10 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {isVisible ? (
            <EyeSlashIcon className="h-5 w-5 text-neutral-400 hover:text-white" />
          ) : (
            <EyeIcon className="h-5 w-5 text-neutral-400 hover:text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;