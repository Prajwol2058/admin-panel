import { z } from "zod"

// Content schema
export const contentSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  author_id: z.number().int("Author ID must be an integer").positive("Author ID must be a positive number"),
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title cannot exceed 200 characters"),
  subtitle: z
    .string()
    .min(5, "Subtitle must be at least 5 characters")
    .max(300, "Subtitle cannot exceed 300 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
})

export type ContentFormValues = z.infer<typeof contentSchema>

