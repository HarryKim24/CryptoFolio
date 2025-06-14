'use client';

import React from 'react';

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-cover">
      {children}
    </div>
  );
};

export default HomeLayout;
