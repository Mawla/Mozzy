import * as React from "react";
import { ContainerBlock } from "./container-block";

interface MindMapBlockProps {
  nodes: Array<{
    id: string;
    label: string;
    type: "concept" | "person" | "decision" | "outcome";
    connections: Array<{
      to: string;
      relationship: string;
    }>;
  }>;
}

export function MindMapBlock({ nodes }: MindMapBlockProps) {
  return (
    <ContainerBlock title="Concept Map">
      <div className="p-4">
        {nodes.map((node) => (
          <div key={node.id} className="mb-4">
            <h3 className="font-medium">{node.label}</h3>
            <div className="ml-4">
              {node.connections.map((conn, i) => (
                <div key={i} className="text-sm text-muted-foreground">
                  → {conn.relationship} ({conn.to})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ContainerBlock>
  );
}
