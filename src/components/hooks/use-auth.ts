"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import authService from "@/lib/api/auth-service"
import { LoginCredentialsTypes, RegisterDataTypes } from "@/types/auth-types"

interface User {
    id: number
    name: string
    email: string
}

export function useAuth() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load user from localStorage on mount with better error handling
    useEffect(() => {
        const loadUser = () => {
            try {
                if (typeof window !== "undefined") {
                    const user = authService.getCurrentUser()
                    setUser(user)
                }
            } catch (error) {
                console.error("Failed to load user:", error)
                // Clear potentially corrupted data
                if (typeof window !== "undefined") {
                    authService.logout()
                }
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

    const login = useCallback(async (credentials: LoginCredentialsTypes) => {
        setIsLoading(true)
        try {
            // Use the auth service to login
            const response = await authService.login(credentials)

            setUser(response.responseObject.users)

            toast.success("Login successful", {
                description: "Redirecting to dashboard...",
            })

            return response
        } catch (error) {
            toast.error("Login failed", {
                description: error instanceof Error ? error.message : "Please check your credentials and try again.",
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const register = useCallback(async (data: RegisterDataTypes) => {
        setIsLoading(true)
        try {
            // Use the auth service to register
            const response = await authService.register(data)

            toast.success("Registration successful", {
                description: "You can now log in with your credentials.",
            })

            return response
        } catch (error) {
            toast.error("Registration failed", {
                description: error instanceof Error ? error.message : "Please try again with different credentials.",
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        try {
            authService.logout()
            setUser(null)
            router.push("/login")
            toast.success("Logged out successfully")
        } catch (error) {
            console.error("Logout error:", error)
            toast.error("Error logging out")
        }
    }, [router])

    const isAuthenticated = useCallback(() => {
        return authService.isAuthenticated()
    }, [])

    return {
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
    }
}

