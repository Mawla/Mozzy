import { useState } from "react";
import { Tabs } from "./Tabs";

export const ParentComponent = () => {
  const [activeTab, setActiveTab] = useState<string>("tab1");

  return (
    <div>
      <h1>Parent Component</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
