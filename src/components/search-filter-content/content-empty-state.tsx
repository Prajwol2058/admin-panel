"use client";

import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

interface ContentEmptyStateProps {
  searchParams: any;
  resetFilters: () => void;
}

export default function ContentEmptyState({
  searchParams,
  resetFilters,
}: ContentEmptyStateProps) {
  const hasFilters = Object.values(searchParams).some(
    (value) => value !== undefined && value !== ""
  );

  return (
    <div className="col-span-full text-center py-16 bg-muted/20 rounded-lg">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-lg font-medium">No content found</p>
      <p className="text-muted-foreground">
        Try adjusting your search or filter criteria.
      </p>
      {hasFilters && (
        <Button variant="outline" className="mt-4" onClick={resetFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
