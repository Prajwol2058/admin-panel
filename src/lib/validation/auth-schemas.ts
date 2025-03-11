import { z } from "zod"

// Login schema
export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// Registration schema
export const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
        username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username cannot exceed 50 characters"),
        email: z.string().email("Please enter a valid email address"),
        photo: z.instanceof(File, { message: "Photo must be a file" }),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(100, "Password cannot exceed 100 characters"),
        confirm_password: z.string().min(6, "Password must be at least 6 characters"),
        gender: z.enum(["MALE", "FEMALE", "PREFERNOTTOSAY"]),
        role: z.enum(["USER", "ADMIN"]),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"],
    })

export type RegisterFormValues = z.infer<typeof registerSchema>


