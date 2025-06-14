import React from 'react';

const ChartLayout = ({ 
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) => {
  return (
    <div className="min-h-screen bg-chart-gradient text-white">
      {children}
    </div>
  );
};

export default ChartLayout;