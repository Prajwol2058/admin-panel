"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import {
  contentSchema,
  ContentUpdateFormValues,
  contentUpdateSchema,
} from "@/lib/validation/content-shema";
import type { Category } from "@/types/category-types";
import type { Content } from "@/types/content-types";
import { ErrorMessage, Field, type FieldProps, Form, Formik } from "formik";
import { Loader2 } from "lucide-react";
import type React from "react";
import type * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { PhotoUpload } from "../forms";
import contentServices from "@/lib/api/content-services";
import { useEffect } from "react";

type ContentFormValues = z.infer<typeof contentSchema>;

export const ContentModal = ({
  editContent,
  handleUpdateContent,
  handleCreateContent,
  categories,
  setOpenDialog,
  setEditContent,
}: {
  editContent: Content | null;
  handleUpdateContent: (
    values: ContentUpdateFormValues,
    formikHelpers: {
      resetForm: (nextValues?: Partial<ContentUpdateFormValues>) => void;
    }
  ) => void;
  handleCreateContent: (
    values: ContentFormValues,
    formikHelpers: {
      resetForm: (nextValues?: Partial<ContentFormValues>) => void;
    }
  ) => void;
  categories: Category[];
  setOpenDialog: (open: boolean) => void;
  setEditContent: (content: Content | null) => void;
}) => {
  const handleUpdatePhoto = async (photo: File) => {
    if (!editContent?.id) return;
    const formData = new FormData();
    formData.append("photo", photo);

    try {
      await contentServices.contentServiceUpdate.updatePhoto(
        editContent.id,
        formData
      );
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
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
        initialValues={{
          id: editContent?.id,
          author_id: editContent?.author_id || 1,
          title: editContent?.title || "",
          subtitle: editContent?.subtitle || "",
          content: editContent?.content || "",
          category: editContent?.category || 0,
          photo: editContent?.photo || null,
        }}
        // validationSchema={toFormikValidationSchema(contentSchema)}

        validationSchema={toFormikValidationSchema(
          editContent ? contentUpdateSchema : contentSchema
        )}
        onSubmit={editContent ? handleUpdateContent : handleCreateContent}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => {
          useEffect(() => {
            if (values.photo instanceof File) {
              handleUpdatePhoto(values.photo);
            }
          }, [values.photo]);

          return (
            <Form className="space-y-4">
              {/* Photo Upload */}
              <div>
                <PhotoUpload
                  value={values.photo || null}
                  onChange={(value) => setFieldValue("photo", value)}
                />
                {(values.photo || editContent?.photo) && (
                  <div className="flex justify-center items-center mx-auto">
                    <img
                      src={
                        values.photo instanceof File
                          ? URL.createObjectURL(values.photo)
                          : values.photo || editContent?.photo
                      }
                      alt="Preview"
                      className="mt-2 max-h-40 rounded border"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
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
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              {/* Subtitle */}
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

              {/* Author ID and Category */}
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
                    {({ field, form }: FieldProps) => (
                      <Select
                        value={field.value ? String(field.value) : undefined} // Ensure correct type
                        onValueChange={(value) =>
                          form.setFieldValue("category", Number(value))
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
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
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

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Field
                  as={Textarea}
                  id="content"
                  name="content"
                  placeholder="Enter content"
                  className={`min-h-[200px] ${
                    errors.content && touched.content
                      ? "border-destructive"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              {/* Footer Buttons */}
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
          );
        }}
      </Formik>
    </DialogContent>
  );
};
