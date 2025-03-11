"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import categoryService from "@/lib/api/category-service";
import contentService from "@/lib/api/content-service";
import { CategoriesResponse, Category } from "@/types/category-types";
import { Content } from "@/types/content-types";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  Filter,
  LayoutGrid,
  List,
  Loader2,
  Maximize2,
  Search,
  Share2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ContentViewPage = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
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
        const cleanParams = Object.entries(searchParams).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== "") {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );

        // Add pagination parameters
        cleanParams.page = page;
        cleanParams.limit = limit;

        // Fetch content with search parameters
        const response = await contentService.getAll(cleanParams);

        // Set content and totalCount from the API response
        setContent(response.responseObject.content);
        setTotalCount(response.length);
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
  const handleInputChange = (key, value) => {
    setCurrentSearchParams((prev) => ({ ...prev, [key]: value }));
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

  // Get category name by ID
  const getCategoryName = (categoryId: number | string) => {
    if (!categories || categories.length === 0) return `Category ${categoryId}`;

    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Handle back from detail view
  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedContent(null);
  };

  // Render content cards in grid view
  const renderGridView = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {content.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          {item?.photo && (
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={item.photo}
                alt={item.title}
                className="h-full w-full object-cover transition-all hover:scale-105 duration-300"
              />
            </div>
          )}
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {item.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
              <Badge variant="secondary" className="font-normal">
                {typeof item.category === "number"
                  ? getCategoryName(item.category)
                  : item.category}
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
            <p className="line-clamp-3 text-sm">
              {truncateText(item.content, 120)}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleViewContent(item.id)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Read More
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Render content in list view
  const renderListView = () => (
    <div className="space-y-4">
      {content.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:bg-accent/10 transition-colors"
        >
          <div className="flex flex-col sm:flex-row">
            {item?.photo && (
              <div className="w-full sm:w-48 h-48 overflow-hidden bg-gray-100">
                <img
                  src={item.photo}
                  alt={item.title}
                  className="h-full w-full object-cover transition-all hover:scale-105 duration-300"
                />
              </div>
            )}
            <div className="flex flex-col flex-1 p-4">
              <div className="mb-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground my-2">
                <Badge variant="secondary" className="font-normal">
                  {typeof item.category === "number"
                    ? getCategoryName(item.category)
                    : item.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.created_at)}</span>
                </div>
                {item.author_id && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>ID: {item.author_id}</span>
                  </div>
                )}
                {item.size && (
                  <div className="flex items-center gap-1">
                    <File className="h-3 w-3" />
                    <span>{item.size} KB</span>
                  </div>
                )}
              </div>

              <p className="text-sm line-clamp-2 flex-grow">
                {truncateText(item.content, 180)}
              </p>

              <div className="mt-3 self-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewContent(item.id)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Read More
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // Render content detail view
  const renderDetailView = () => {
    if (!selectedContent) return null;

    return (
      <div className="space-y-6">
        {/* Back button and metadata bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBackToList}
            className="self-start"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Title and subtitle */}
          <div className="border-b pb-6">
            <h1 className="text-3xl font-bold mb-3">{selectedContent.title}</h1>
            <p className="text-xl text-muted-foreground">
              {selectedContent.subtitle}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
              <Badge variant="secondary" className="font-normal">
                {typeof selectedContent.category === "number"
                  ? getCategoryName(selectedContent.category)
                  : selectedContent.category}
              </Badge>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedContent.created_at)}</span>
              </div>

              {selectedContent.author_id && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Author ID: {selectedContent.author_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Feature image */}
          {selectedContent.photo && (
            <div className="max-h-96 overflow-hidden rounded-lg border shadow-sm">
              <img
                src={selectedContent.photo}
                alt={selectedContent.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main article content */}
          <article className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {selectedContent.content}
            </div>
          </article>

          {/* Additional metadata */}
          <div className="bg-muted/20 rounded-lg p-4 mt-8">
            <h3 className="text-lg font-medium mb-3">Content Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedContent.width && selectedContent.height && (
                <div className="flex items-center gap-2 text-sm">
                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Dimensions: </span>
                    <span>
                      {`${selectedContent.width}`.split(".")[0]}x
                      {`${selectedContent.height}`.split(".")[0]}
                    </span>
                  </div>
                </div>
              )}

              {selectedContent.size && (
                <div className="flex items-center gap-2 text-sm">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Size: </span>
                    <span>{selectedContent.size} KB</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Content List
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div className="space-y-6">
      {isDetailView ? (
        // Render detail view
        renderDetailView()
      ) : (
        // Render list view
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
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        placeholder="Search by subtitle"
                        value={currentSearchParams.subtitle || ""}
                        onChange={(e) =>
                          handleInputChange("subtitle", e.target.value)
                        }
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
                            e.target.value
                              ? Number.parseInt(e.target.value)
                              : undefined
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
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined
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
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined
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
                  <Button onClick={applySearch}>
                    <Search className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </CardFooter>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* View Mode Selector */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {content.length > 0 ? (
                <span>
                  Showing {content.length} of {totalCount} items
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

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {!content || content.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-muted/20 rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-lg font-medium">No content found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                  {Object.values(searchParams).some(
                    (value) => value !== undefined && value !== ""
                  ) && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={resetFilters}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : viewMode === "grid" ? (
                renderGridView()
              ) : (
                renderListView()
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4 border-t">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="limit">Items per page:</Label>
                    <Select
                      value={limit.toString()}
                      onValueChange={(value) => {
                        setLimit(Number.parseInt(value));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger id="limit" className="w-16">
                        <SelectValue placeholder={limit.toString()} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="9">9</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm">
                      Page {page} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ContentViewPage;
