"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentTab } from "./ContentTab";
import { TemplateTab } from "./TemplateTab";
import { MergeTab } from "./MergeTab";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { TAB_NAMES } from "@/app/constants/editorConfig";
import { Post } from "@/app/types/post"; // Adjust the import path as needed
import { TabDropdown } from "./TabDropdown";

interface PostContentProps {
  post: Post | null;
  updatePost: (updatedPost: Post) => void;
}

export const PostContent: React.FC<PostContentProps> = ({
  post,
  updatePost,
}) => {
  const { activeTab, setActiveTab } = useCreatePost();

  return (
    <div className="space-y-4">
      {/* Mobile Dropdown */}
      <div className="sm:hidden">
        <TabDropdown activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="relative">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as keyof typeof TAB_NAMES)
          }
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
