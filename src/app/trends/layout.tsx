import React from 'react';

const TrendsLayout = ({ 
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) => {
  return (
    <div className="min-h-screen bg-trends-gradient text-white">
      {children}
    </div>
  );
};

export default TrendsLayout;
