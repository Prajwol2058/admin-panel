import { z } from "zod"

// Content schema
export const contentSchema = z.object({
  author_id: z.number().int("Author ID must be an integer").positive("Author ID must be a positive number"),
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title cannot exceed 200 characters"),
  subtitle: z
    .string()
    .min(5, "Subtitle must be at least 5 characters")
    .max(300, "Subtitle cannot exceed 300 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.number().min(1, "Please select a category"),
  photo: z.instanceof(File, { message: "Photo must be a file" }),
})

export type ContentFormValues = z.infer<typeof contentSchema>



// Content schema
export const contentUpdateSchema = z.object({
  author_id: z.number().int("Author ID must be an integer").positive("Author ID must be a positive number"),
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title cannot exceed 200 characters"),
  subtitle: z
    .string()
    .min(5, "Subtitle must be at least 5 characters")
    .max(300, "Subtitle cannot exceed 300 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.number().min(1, "Please select a category"),
})

export type ContentUpdateFormValues = z.infer<typeof contentSchema>

