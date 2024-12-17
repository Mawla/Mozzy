"use client";

import React, { createContext, useContext, useState } from "react";

interface WikiConfig {
  navigationWidth: number;
  sidebarWidth: number;
  stickyNavigation: boolean;
  stickySidebar: boolean;
  setNavigationWidth: (width: number) => void;
  setSidebarWidth: (width: number) => void;
  setStickyNavigation: (sticky: boolean) => void;
  setStickySidebar: (sticky: boolean) => void;
}

const WikiConfigContext = createContext<WikiConfig | null>(null);

export const useWikiConfig = () => {
  const context = useContext(WikiConfigContext);
  if (!context) {
    throw new Error("useWikiConfig must be used within a WikiConfigProvider");
  }
  return context;
};

interface WikiConfigProviderProps {
  children: React.ReactNode;
  defaultNavigationWidth?: number;
  defaultSidebarWidth?: number;
  defaultStickyNavigation?: boolean;
  defaultStickySidebar?: boolean;
}

export const WikiConfigProvider = ({
  children,
  defaultNavigationWidth = 280,
  defaultSidebarWidth = 320,
  defaultStickyNavigation = true,
  defaultStickySidebar = true,
}: WikiConfigProviderProps) => {
  const [navigationWidth, setNavigationWidth] = useState(
    defaultNavigationWidth
  );
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const [stickyNavigation, setStickyNavigation] = useState(
    defaultStickyNavigation
  );
  const [stickySidebar, setStickySidebar] = useState(defaultStickySidebar);

  return (
    <WikiConfigContext.Provider
      value={{
        navigationWidth,
        sidebarWidth,
        stickyNavigation,
        stickySidebar,
        setNavigationWidth,
        setSidebarWidth,
        setStickyNavigation,
        setStickySidebar,
      }}
    >
      {children}
    </WikiConfigContext.Provider>
  );
};
