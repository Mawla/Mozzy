"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentTab } from "./ContentTab";
import { TemplateTab } from "./TemplateTab";
import { MergeTab } from "./MergeTab";
import { TAB_NAMES, TabName } from "@/app/constants/editorConfig";
import { TabDropdown } from "./TabDropdown";

export const PostContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>(TAB_NAMES.CONTENT);

  return (
    <div className="space-y-4">
      {/* Mobile Dropdown */}
      <div className="sm:hidden">
        <TabDropdown activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="relative">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabName)}
          className="w-full mt-10"
        >
          <TabsList className="hidden sm:flex">
            {Object.values(TAB_NAMES).map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={TAB_NAMES.CONTENT}>
            <ContentTab />
          </TabsContent>
          <TabsContent value={TAB_NAMES.TEMPLATE}>
            <TemplateTab />
          </TabsContent>
          <TabsContent value={TAB_NAMES.MERGE}>
            <MergeTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
