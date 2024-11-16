"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface PodcastInputProps {
  onSubmit: (data: {
    type: "url" | "search" | "transcript";
    content: string;
  }) => void;
  isProcessing: boolean;
}

export const PodcastInput = ({ onSubmit, isProcessing }: PodcastInputProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = (type: "url" | "search" | "transcript") => {
    if (!content.trim()) return;
    onSubmit({ type, content: content.trim() });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transcript">Paste Transcript</TabsTrigger>
            <TabsTrigger value="url">Podcast URL</TabsTrigger>
            <TabsTrigger value="search">Search Podcast</TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="space-y-4">
            <Textarea
              placeholder="Paste podcast transcript"
              className="min-h-[128px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={() => handleSubmit("transcript")}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Process Transcript"}
            </Button>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <Input
              type="url"
              placeholder="Enter podcast URL"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={() => handleSubmit("url")}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Process Podcast"}
            </Button>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <Input
              type="search"
              placeholder="Search for a podcast"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={() => handleSubmit("search")}
              disabled={isProcessing}
            >
              {isProcessing ? "Searching..." : "Search"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
