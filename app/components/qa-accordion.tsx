import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface QAItem {
  question: string;
  answer: string;
}

interface QAAccordionProps {
  title: string;
  items: QAItem[];
}

export function QAAccordion({ title, items }: QAAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="qa-section">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          {items.map((item, index) => (
            <Collapsible key={index} className="mb-4">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-secondary p-4 font-medium hover:bg-secondary/80">
                {item.question}
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 rounded-lg bg-secondary/50 p-4">
                {item.answer}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
