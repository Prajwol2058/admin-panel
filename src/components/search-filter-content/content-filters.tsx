"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { Category } from "@/types/category-types";
import { toast } from "sonner";

interface ContentFiltersProps {
  currentSearchParams: any;
  handleInputChange: (key: string, value: any) => void;
  resetFilters: () => void;
  applySearch: () => void;
  categories: Category[];
}

export default function ContentFilters({
  currentSearchParams,
  handleInputChange,
  resetFilters,
  applySearch,
  categories,
}: ContentFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Advanced Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Title and Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Search by title"
              value={currentSearchParams.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              placeholder="Search by subtitle"
              value={currentSearchParams.subtitle || ""}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={currentSearchParams.category?.toString() || ""}
              onValueChange={(value) =>
                handleInputChange(
                  "category",
                  value === "all" ? undefined : Number.parseInt(value)
                )
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Author ID */}
          <div className="space-y-2">
            <Label htmlFor="author_id">Author ID</Label>
            <Input
              id="author_id"
              type="number"
              placeholder="Filter by author ID"
              value={currentSearchParams.author_id || ""}
              onChange={(e) =>
                handleInputChange(
                  "author_id",
                  e.target.value ? Number.parseInt(e.target.value) : undefined
                )
              }
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="created_at_from">From Date</Label>
            <Input
              id="created_at_from"
              type="date"
              value={currentSearchParams.created_at_from || ""}
              onChange={(e) =>
                handleInputChange("created_at_from", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="created_at_to">To Date</Label>
            <Input
              id="created_at_to"
              type="date"
              value={currentSearchParams.created_at_to || ""}
              onChange={(e) =>
                handleInputChange("created_at_to", e.target.value)
              }
            />
          </div>
          {/* Size Range */}
          <div className="space-y-2">
            <Label>Size Range (KB)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={currentSearchParams.size_from || ""}
                onChange={(e) =>
                  handleInputChange(
                    "size_from",
                    e.target.value ? Number.parseInt(e.target.value) : undefined
                  )
                }
                className="w-full"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                value={currentSearchParams.size_to || ""}
                onChange={(e) =>
                  handleInputChange(
                    "size_to",
                    e.target.value ? Number.parseInt(e.target.value) : undefined
                  )
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
        <Button
          onClick={() => {
            // Prevent submitting if one of the date or size ranges is incomplete
            if (
              (currentSearchParams.size_from && !currentSearchParams.size_to) ||
              (!currentSearchParams.size_from && currentSearchParams.size_to) ||
              (currentSearchParams.created_at_from &&
                !currentSearchParams.created_at_to) ||
              (!currentSearchParams.created_at_from &&
                currentSearchParams.created_at_to)
            ) {
              toast("Please complete both range fields for size or date.");
              return;
            }
            applySearch();
          }}
        >
          <Search className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
}
