"use client";
import type React from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Content } from "@/types/content-types";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { contentSchema } from "@/lib/validation/content-shema";

type ContentFormValues = z.infer<typeof contentSchema>;

export const ContentModal = ({
  editContent,
  handleUpdateContent,
  handleCreateContent,
  generateSlug,
  categories,
  setOpenDialog,
  setEditContent,
}: {
  editContent: Content | null;
  handleUpdateContent: (
    values: ContentFormValues,
    formikHelpers: {
      resetForm: (nextValues?: Partial<ContentFormValues>) => void;
    }
  ) => void;
  handleCreateContent: (
    values: ContentFormValues,
    formikHelpers: {
      resetForm: (nextValues?: Partial<ContentFormValues>) => void;
    }
  ) => void;
  generateSlug: (title: string) => string;
  categories: string[];
  setOpenDialog: (open: boolean) => void;
  setEditContent: (content: Content | null) => void;
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {editContent ? "Edit Content" : "Add Content"}
        </DialogTitle>
        <DialogDescription>
          {editContent
            ? "Update the content details below."
            : "Enter the details for the new content."}
        </DialogDescription>
      </DialogHeader>
      <Formik
        initialValues={
          editContent
            ? {
                slug: editContent.slug,
                author_id: editContent.author_id,
                title: editContent.title,
                subtitle: editContent.subtitle,
                content: editContent.content,
                category: editContent.category,
              }
            : {
                slug: "",
                author_id: 1,
                title: "",
                subtitle: "",
                content: "",
                category: "",
              }
        }
        validationSchema={toFormikValidationSchema(contentSchema)}
        onSubmit={editContent ? handleUpdateContent : handleCreateContent}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Field
                  as={Input}
                  id="title"
                  name="title"
                  placeholder="Enter title"
                  className={
                    errors.title && touched.title ? "border-destructive" : ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("title", e.target.value);
                    // Auto-generate slug if not editing
                    if (!editContent) {
                      setFieldValue("slug", generateSlug(e.target.value));
                    }
                  }}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Field
                  as={Input}
                  id="slug"
                  name="slug"
                  placeholder="Enter slug"
                  className={
                    errors.slug && touched.slug ? "border-destructive" : ""
                  }
                />
                <ErrorMessage
                  name="slug"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Field
                as={Input}
                id="subtitle"
                name="subtitle"
                placeholder="Enter subtitle"
                className={
                  errors.subtitle && touched.subtitle
                    ? "border-destructive"
                    : ""
                }
              />
              <ErrorMessage
                name="subtitle"
                component="div"
                className="text-sm text-destructive"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author_id">Author ID</Label>
                <Field
                  as={Input}
                  id="author_id"
                  name="author_id"
                  type="number"
                  placeholder="Enter author ID"
                  className={
                    errors.author_id && touched.author_id
                      ? "border-destructive"
                      : ""
                  }
                />
                <ErrorMessage
                  name="author_id"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Field name="category">
                  {({ field, form }: any) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        form.setFieldValue("category", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.category && touched.category
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Field
                as={Textarea}
                id="content"
                name="content"
                placeholder="Enter content"
                className={`min-h-[200px] ${
                  errors.content && touched.content ? "border-destructive" : ""
                }`}
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-sm text-destructive"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpenDialog(false);
                  setEditContent(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editContent ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </Form>
        )}
      </Formik>
    </DialogContent>
  );
};
