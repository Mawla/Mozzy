import React from "react";
import { ChevronDown } from "lucide-react";
import { TAB_NAMES } from "@/app/constants/editorConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TabDropdownProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabDropdown: React.FC<TabDropdownProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {activeTab}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {Object.values(TAB_NAMES).map((tab) => (
          <DropdownMenuItem key={tab} onClick={() => setActiveTab(tab)}>
            {tab}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
