"use client";

import React, { createContext, useContext, useState } from "react";

interface BlockConfig {
  navigationWidth: number;
  sidebarWidth: number;
  stickyNavigation: boolean;
  stickySidebar: boolean;
  setNavigationWidth: (width: number) => void;
  setSidebarWidth: (width: number) => void;
  setStickyNavigation: (sticky: boolean) => void;
  setStickySidebar: (sticky: boolean) => void;
}

const BlockConfigContext = createContext<BlockConfig | null>(null);

export const useBlockConfig = () => {
  const context = useContext(BlockConfigContext);
  if (!context) {
    throw new Error("useBlockConfig must be used within a BlockConfigProvider");
  }
  return context;
};

interface BlockConfigProviderProps {
  children: React.ReactNode;
  defaultNavigationWidth?: number;
  defaultSidebarWidth?: number;
  defaultStickyNavigation?: boolean;
  defaultStickySidebar?: boolean;
}

export const BlockConfigProvider = ({
  children,
  defaultNavigationWidth = 280,
  defaultSidebarWidth = 320,
  defaultStickyNavigation = true,
  defaultStickySidebar = true,
}: BlockConfigProviderProps) => {
  const [navigationWidth, setNavigationWidth] = useState(
    defaultNavigationWidth
  );
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const [stickyNavigation, setStickyNavigation] = useState(
    defaultStickyNavigation
  );
  const [stickySidebar, setStickySidebar] = useState(defaultStickySidebar);

  return (
    <BlockConfigContext.Provider
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
    </BlockConfigContext.Provider>
  );
};
