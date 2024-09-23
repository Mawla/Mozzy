import React from "react";
import { ChevronDown } from "lucide-react";
import { TAB_NAMES, TabName } from "@/app/constants/editorConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "@/app/hooks/useCreatePost";

interface TabDropdownProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

export const TabDropdown = ({ activeTab, setActiveTab }: TabDropdownProps) => {
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
          <DropdownMenuItem
            key={tab}
            onClick={() => setActiveTab(tab as TabName)}
          >
            {tab}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
