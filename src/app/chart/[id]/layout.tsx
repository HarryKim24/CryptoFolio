import React from 'react';

const ChartLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen h-screen bg-chart-gradient text-white flex flex-col">
      {children}
    </div>
  );
};

export default ChartLayout;
