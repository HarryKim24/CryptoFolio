import React from 'react'

const HomeLayout = ({ 
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) => {
  return (
    <div>
      HomeLayout
      {children}
    </div>
  )
}

export default HomeLayout
