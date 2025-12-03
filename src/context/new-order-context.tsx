
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'all';

interface NewOrderContextType {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
}

const NewOrderContext = createContext<NewOrderContextType | undefined>(undefined);

export function NewOrderProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState<Platform>('all');

  return (
    <NewOrderContext.Provider value={{ platform, setPlatform }}>
      {children}
    </NewOrderContext.Provider>
  );
}

export function useNewOrder() {
  const context = useContext(NewOrderContext);
  if (context === undefined) {
    throw new Error('useNewOrder must be used within a NewOrderProvider');
  }
  return context;
}
