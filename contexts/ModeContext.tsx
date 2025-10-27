import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppMode } from '../types/mode';

interface ModeContextType {
  mode: AppMode | null;
  setMode: (mode: AppMode) => Promise<void>;
  clearMode: () => Promise<void>;
  isLoading: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode | null>(null);
  const [isLoading] = useState(false); // 常にfalse

  const setMode = async (newMode: AppMode) => {
    try {
      //!ストレージへの保存をスキップ
      setModeState(newMode);
    } catch (error) {
      console.error('Failed to set mode:', error);
      throw error;
    }
  };

  const clearMode = async () => {
    try {
      //!ストレージのクリアをスキップ
      setModeState(null);
    } catch (error) {
      console.error('Failed to clear mode:', error);
      throw error;
    }
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, clearMode, isLoading }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
