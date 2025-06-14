import React from 'react'

const PortfolioLayout = ({ 
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) => {
  return (
    <div className="min-h-screen bg-portfolio-gradient text-white">
      PortfolioLayout
      {children}
    </div>
  )
}

export default PortfolioLayout
