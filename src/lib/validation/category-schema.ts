import { z } from "zod"

// Category schema
export const categorySchema = z.object({
    name: z
        .string()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Category name cannot exceed 50 characters"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

