import React from "react";
import { Badge } from "@/components/ui/badge";
import { Youtube } from "lucide-react";

const YouTubeBadge: React.FC = () => (
  <a
    href="https://www.youtube-transcript.io"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center"
  >
    <Badge variant="secondary" className="py-1 px-2">
      <Youtube className="w-4 h-4 mr-2" />
      Use this service to extract YouTube transcripts
    </Badge>
  </a>
);

export default YouTubeBadge;
