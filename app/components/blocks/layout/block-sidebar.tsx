"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface BlockSidebarProps {
  title?: string;
  sections: {
    id: string;
    title: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

export const BlockSidebar = ({
  title = "Block Panel",
  sections,
  className,
}: BlockSidebarProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <h3 className="font-medium text-sm">{section.title}</h3>
          </CardHeader>
          <CardContent>{section.content}</CardContent>
        </Card>
      ))}
    </div>
  );
};
