// src/components/FullWidthWrapper.tsx
import React from 'react';

export default function FullWidthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {children}
    </div>
  );
}