import React from "react";

const TrendsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen w-full bg-trends-gradient text-neutral-100 pt-16">
      {children}
    </div>
  );
};

export default TrendsLayout;