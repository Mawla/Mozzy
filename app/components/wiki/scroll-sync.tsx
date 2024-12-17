"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ScrollPosition {
  progress: number;
  activeSection?: string;
}

interface ScrollSync {
  scrollPosition: ScrollPosition;
  setScrollPosition: (position: ScrollPosition) => void;
  registerSection: (id: string, element: HTMLElement) => void;
  unregisterSection: (id: string) => void;
}

const ScrollSyncContext = createContext<ScrollSync | null>(null);

export const useScrollSync = () => {
  const context = useContext(ScrollSyncContext);
  if (!context) {
    throw new Error("useScrollSync must be used within a ScrollSyncProvider");
  }
  return context;
};

interface ScrollSyncProviderProps {
  children: React.ReactNode;
}

export const ScrollSyncProvider = ({ children }: ScrollSyncProviderProps) => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    progress: 0,
  });
  const [sections, setSections] = useState<Map<string, HTMLElement>>(new Map());

  const registerSection = useCallback((id: string, element: HTMLElement) => {
    setSections((prev) => {
      const next = new Map(prev);
      next.set(id, element);
      return next;
    });
  }, []);

  const unregisterSection = useCallback((id: string) => {
    setSections((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const updateScrollPosition = useCallback((position: ScrollPosition) => {
    setScrollPosition((prev) => {
      // Only update if the values have changed
      if (
        prev.progress === position.progress &&
        prev.activeSection === position.activeSection
      ) {
        return prev;
      }
      return position;
    });
  }, []);

  return (
    <ScrollSyncContext.Provider
      value={{
        scrollPosition,
        setScrollPosition: updateScrollPosition,
        registerSection,
        unregisterSection,
      }}
    >
      {children}
    </ScrollSyncContext.Provider>
  );
};
