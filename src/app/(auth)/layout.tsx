import React from "react";

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a]">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-800">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
