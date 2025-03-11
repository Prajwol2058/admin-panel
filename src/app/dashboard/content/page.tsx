"use client";

import { Edit, Eye, Loader2, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { ContentModal } from "@/components/modal/contentModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";

import categoryService from "@/lib/api/category-service";
import contentService from "@/lib/api/content-services";
import {
  ContentFormValues,
  ContentUpdateFormValues,
} from "@/lib/validation/content-shema";
import { CategoriesResponse, Category } from "@/types/category-types";
import { Content, ContentResponse } from "@/types/content-types";
import { Pagination } from "@/components/pagination";
import { QueryParamsTypes } from "@/types/query-params";

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [viewContent, setViewContent] = useState<Content | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await contentService.contentService.getAll();
      const content = data.responseObject.content;
      setContent(content);
      setTotal(data.responseObject.total);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    setIsLoading(true);
    const params: QueryParamsTypes = { page: newPage, limit };
    const data: ContentResponse = await contentService.contentService.getAll(
      params
    );
    setContent(data.responseObject.content);
    setTotal(data.responseObject.total);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data: CategoriesResponse = await categoryService.getAll();
      setCategories(data.responseObject.categories);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Filter content based on search query
  const filteredContent = content.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateContent = async (
    values: ContentFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      // Create FormData object
      const formdata = new FormData();

      // Append form fields exactly as in your Postman example
      formdata.append("author_id", values.author_id?.toString() || "1");
      formdata.append("title", values.title);
      formdata.append("subtitle", values.subtitle || "");
      formdata.append("content", values.content);
      formdata.append("category", values.category.toString());

      // This is the critical part - append the file directly without a third parameter
      if (values.photo instanceof File) {
        formdata.append("photo", values.photo);
      }
      const response = await contentService.contentService.createFormData(
        formdata
      );
      fetchData();
      resetForm();
      setOpenDialog(false);
    } catch (error) {}
  };

  // Handle update content
  const handleUpdateContent = async (
    values: ContentUpdateFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!editContent) return;

    try {
      const response = await contentService.contentService.update(
        editContent?.id,
        values
      );
      fetchData();
      resetForm();
      setEditContent(null);
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteContent = async () => {
    if (deleteId === null) return;

    try {
      await contentService.contentService.delete(deleteId);
      setOpenDeleteDialog(false);
      fetchData();
      console.log(deleteId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground">
            Manage your content and articles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditContent(null);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </DialogTrigger>
            <ContentModal
              editContent={editContent}
              handleUpdateContent={handleUpdateContent}
              handleCreateContent={handleCreateContent}
              categories={categories}
              setOpenDialog={setOpenDialog}
              setEditContent={setEditContent}
            />
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Content</CardTitle>
          <CardDescription>A list of all content and articles.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[170px]">Title</TableHead>
                  <TableHead className="w-[150px] ">Subtitle</TableHead>
                  <TableHead className="w-[150px] text-center">
                    Category
                  </TableHead>
                  <TableHead className="w-[150px]">Created</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No content found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>{item.subtitle}</TableCell>
                      <TableCell className="text-center">
                        {item.category}
                      </TableCell>
                      <TableCell>{item.created_at}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setViewContent(item);
                                setOpenViewDialog(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditContent(item);
                                setOpenDialog(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setDeleteId(item.id);
                                setOpenDeleteDialog(true);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* View Content Dialog */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{viewContent?.title}</DialogTitle>
            <DialogDescription>{viewContent?.subtitle}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Category:{" "}
                <span className="font-medium">{viewContent?.category}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Author ID:{" "}
                <span className="font-medium">{viewContent?.author_id}</span>
              </div>
            </div>
            <div className="rounded-md border p-4">
              <p className="whitespace-pre-wrap">{viewContent?.content}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContent}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
