"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

import { CategoriesResponse, Category } from "@/types/category-types";
import { Content } from "@/types/content-types";
import ContentDetailView from "@/components/search-filter-content/content-detail-view";
import ContentFilters from "@/components/search-filter-content/content-filters";
import ContentViewModeSelector from "@/components/search-filter-content/content-view-selector";
import LoadingState from "@/components/search-filter-content/lodaing-state";
import ContentEmptyState from "@/components/search-filter-content/content-empty-state";
import ContentList from "@/components/search-filter-content/content-list";
import { Pagination } from "@/components/pagination";
import { QueryParamsTypes } from "@/types/query-params";
import contentService from "@/lib/api/content-services";
import categoryService from "@/lib/api/category-service";
export default function ContentViewPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState("list");
  const [isDetailView, setIsDetailView] = useState(false);

  // Search parameters - these are the applied filters that trigger the API call
  const [searchParams, setSearchParams] = useState({
    title: "",
    subtitle: "",
    category: undefined,
    author_id: undefined,
    size_from: undefined,
    size_to: undefined,
    width_from: undefined,
    width_to: undefined,
    height_from: undefined,
    height_to: undefined,
    created_at_from: undefined,
    created_at_to: undefined,
  });

  // Current search parameters - these are the values in the form that don't trigger API calls
  const [currentSearchParams, setCurrentSearchParams] = useState({
    title: "",
    subtitle: "",
    category: undefined,
    author_id: undefined,
    size_from: undefined,
    size_to: undefined,
    width_from: undefined,
    width_to: undefined,
    height_from: undefined,
    height_to: undefined,
    created_at_from: undefined,
    created_at_to: undefined,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data: CategoriesResponse = await categoryService.getAll();
        setCategories(data.responseObject.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error", {
          description: "Failed to fetch categories",
        });
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch content with search parameters
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);

        // Create a clean params object with only defined values
        const cleanParams: QueryParamsTypes = Object.entries(
          searchParams
        ).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== "") {
            acc[key] = value;
          }
          return acc;
        }, {});

        // Add pagination parameters
        cleanParams.page = page;
        cleanParams.limit = limit;

        // Fetch content with search parameters
        const response = await contentService.contentService.getAll(
          cleanParams
        );

        // Set content and totalCount from the API response
        setContent(response.responseObject.content);
        setTotalCount(response.responseObject.total);
      } catch (error) {
        console.error("Error fetching content:", error);
        toast.error("Error", {
          description: "Failed to fetch content",
        });
        setContent([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [searchParams, page, limit]);

  // Handle input changes without triggering API calls
  const handleInputChange = (key: string, value: string | number) => {
    setCurrentSearchParams((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    const params: QueryParamsTypes = { page: newPage, limit };
    const data = await contentService.contentService.getAll(params);
    console.log(data.responseObject.content, "abc");

    setContent(data.responseObject.content);
    setTotalCount(data.responseObject.total);
  };

  // Apply search - this will trigger the API call
  const applySearch = () => {
    setSearchParams(currentSearchParams);
    setPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    const emptyParams = {
      title: "",
      subtitle: "",
      category: undefined,
      author_id: undefined,
      size_from: undefined,
      size_to: undefined,
      width_from: undefined,
      width_to: undefined,
      height_from: undefined,
      height_to: undefined,
      created_at_from: undefined,
      created_at_to: undefined,
    };

    setCurrentSearchParams(emptyParams);
    setSearchParams(emptyParams);
    setPage(1);
  };

  // Handle view content
  const handleViewContent = async (id: number) => {
    try {
      setIsLoading(true);
      // Find the content item in the current list
      const item = content.find((item) => item.id === id);

      if (item) {
        setSelectedContent(item);
        setIsDetailView(true);
        // Scroll to top of page
        window.scrollTo(0, 0);
      } else {
        toast.error("Error", {
          description: "Content not found",
        });
      }
    } catch (error) {
      console.error("Error viewing content:", error);
      toast.error("Error", {
        description: "Failed to fetch content details",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back from detail view
  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedContent(null);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Get category name by ID
  const getCategoryName = (categoryId: number | string) => {
    if (!categories || categories.length === 0) return `Category ${categoryId}`;

    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  return (
    <div className="space-y-6">
      {isDetailView ? (
        <ContentDetailView
          content={selectedContent}
          onBack={handleBackToList}
          getCategoryName={getCategoryName}
        />
      ) : (
        <>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Browse Content
              </h1>
              <p className="text-muted-foreground">
                Search and read available content.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title..."
                  value={currentSearchParams.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={
                  showFilters ? "bg-primary text-primary-foreground" : ""
                }
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Toggle filters</span>
              </Button>
              <Button onClick={applySearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent>
              <ContentFilters
                currentSearchParams={currentSearchParams}
                handleInputChange={handleInputChange}
                resetFilters={resetFilters}
                applySearch={applySearch}
                categories={categories}
              />
            </CollapsibleContent>
          </Collapsible>

          <ContentViewModeSelector
            viewMode={viewMode}
            setViewMode={setViewMode}
            contentCount={content.length}
            totalCount={totalCount}
          />

          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {!content || content.length === 0 ? (
                <ContentEmptyState
                  searchParams={searchParams}
                  resetFilters={resetFilters}
                />
              ) : (
                <ContentList
                  content={content}
                  viewMode={viewMode}
                  handleViewContent={handleViewContent}
                  getCategoryName={getCategoryName}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  onPageChange={handlePageChange}
                  totalPages={totalPages}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
