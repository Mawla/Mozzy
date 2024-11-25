import * as React from "react";
import { ContainerBlock } from "./container-block";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuoteGalleryBlockProps {
  quotes: Array<{
    text: string;
    speaker: string;
    context: string;
    timestamp: string;
    tags: string[];
    importance: "key" | "supporting" | "context";
  }>;
}

export function QuoteGalleryBlock({ quotes }: QuoteGalleryBlockProps) {
  return (
    <ContainerBlock title="Key Quotes">
      <div className="grid gap-4 md:grid-cols-2">
        {quotes.map((quote, i) => (
          <Card key={i} className="p-4">
            <blockquote className="space-y-2">
              <p className="text-sm italic">{quote.text}</p>
              <footer className="text-sm">
                <div className="font-medium">{quote.speaker}</div>
                <div className="text-muted-foreground">{quote.context}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {quote.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </footer>
            </blockquote>
          </Card>
        ))}
      </div>
    </ContainerBlock>
  );
}
