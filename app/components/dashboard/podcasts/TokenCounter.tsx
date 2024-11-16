"use client";

import { Badge } from "@/components/ui/badge";
import { encode } from "gpt-tokenizer";

interface TokenCounterProps {
  text: string;
  className?: string;
}

export const TokenCounter = ({ text, className = "" }: TokenCounterProps) => {
  const tokenCount = encode(text).length;
  const maxTokens = 200000; // Claude's context window
  const tokenPercentage = (tokenCount / maxTokens) * 100;

  const getStatusColor = () => {
    if (tokenPercentage > 90) return "bg-red-100 text-red-800";
    if (tokenPercentage > 70) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <Badge variant="secondary" className={`${getStatusColor()} ${className}`}>
      {tokenCount.toLocaleString()} tokens
      {tokenPercentage > 70 && (
        <span className="ml-1">({Math.round(tokenPercentage)}% of limit)</span>
      )}
    </Badge>
  );
};
