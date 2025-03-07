"use client";

import { Edit, Eye, Loader2, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { mockCategories, mockContent } from "@/components/mockdata/mockdata";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentFormValues } from "@/lib/validation/content-shema";
import { Content } from "@/types/content-types";

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [viewContent, setViewContent] = useState<Content | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const contentData = await
        // const categoriesData = await
        // setContent(contentData);
        // setCategories(categoriesData.map(c => c.name));

        // mock data
        setTimeout(() => {
          setContent(mockContent);
          setCategories(mockCategories.map((c) => c.name));
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter content based on search query
  const filteredContent = content.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const handleCreateContent = async (
    values: ContentFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      // Simulate successful creation
      const newId = Math.max(...content.map((c) => c.id), 0) + 1;
      const newContent = {
        id: newId,
        ...values,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setContent([...content, newContent]);
      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle update content
  const handleUpdateContent = async (
    values: ContentFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!editContent) return;

    try {
      // Simulate successful update
      const updatedContent = content.map((item) =>
        item.id === editContent.id ? { ...item, ...values } : item
      );

      setContent(updatedContent);
      resetForm();
      setEditContent(null);
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle delete content
  const handleDeleteContent = async () => {
    if (deleteId === null) return;

    try {
      setContent(content.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      setOpenDeleteDialog(false);
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
              <ContentModal
                editContent={editContent}
                handleUpdateContent={handleUpdateContent}
                handleCreateContent={handleCreateContent}
                generateSlug={generateSlug}
                categories={categories}
                setOpenDialog={setOpenDialog}
                setEditContent={setEditContent}
              />
            </DialogContent>
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
                  <TableHead className="w-[150px]">Slug</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
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
                      <TableCell>{item.slug}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.createdAt}</TableCell>
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
