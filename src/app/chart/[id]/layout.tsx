import React from 'react'

const ChartLayout = ({ 
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) => {
  return (
    <div>
      ChartLayout
      {children}
    </div>
  )
}

export default ChartLayout
