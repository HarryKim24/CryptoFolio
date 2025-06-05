import React from 'react'

const PortfolioLayout = ({ 
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) => {
  return (
    <div>
      PortfolioLayout
      {children}
    </div>
  )
}

export default PortfolioLayout
