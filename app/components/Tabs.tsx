import { useState } from "react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  // Use activeTab and setActiveTab directly from props
  // Rest of the component remains the same
};
