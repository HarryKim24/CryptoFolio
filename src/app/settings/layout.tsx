import React from 'react'

const SettingsLayout = ({ 
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) => {
  return (
    <div>
      SettingsLayout
      {children}
    </div>
  )
}

export default SettingsLayout
