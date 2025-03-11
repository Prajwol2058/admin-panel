"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ContentViewModeSelectorProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  contentCount: number;
  totalCount: number;
}

export default function ContentViewModeSelector({
  viewMode,
  setViewMode,
  contentCount,
  totalCount,
}: ContentViewModeSelectorProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {contentCount > 0 ? (
          <span>
            Showing {contentCount} of {totalCount} items
          </span>
        ) : null}
      </div>
      <div>
        <div className="bg-secondary rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="px-3"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="px-3"
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>
    </div>
  );
}
