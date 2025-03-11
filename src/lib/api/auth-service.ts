import { AuthResponseTypes, LoginCredentialsTypes, RefreshTokenResponseTypes, RegisterDataTypes } from "@/types/auth-types"
import axiosClient from "../axios-client"


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Auth service
const authService = {
    login: async (credentials: LoginCredentialsTypes): Promise<AuthResponseTypes> => {
        try {
            const response = await axiosClient.post<AuthResponseTypes>("/users/auth", credentials)
            const data =response.data.responseObject

            // Store tokens in localStorage (only in browser environment)
            if (typeof window !== "undefined" && data.token && data.refreshToken) {
                // Store tokens
                localStorage.setItem("access_token", data.token)
                localStorage.setItem("refresh_token", data.refreshToken)

                // Store user data
                localStorage.setItem("user", JSON.stringify(data.users))


            }

            return data
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    },

    register: async (data: RegisterDataTypes): Promise<AuthResponseTypes> => {
        try {
           
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                body: data, 
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    },

    refreshToken: async (): Promise<RefreshTokenResponseTypes> => {
        try {
            const refreshToken = localStorage.getItem("refresh_token")

            if (!refreshToken) {
                throw new Error("No refresh token available")
            }

            const response = await axiosClient.post<RefreshTokenResponseTypes>(
                "/login/refresh-token",
                { refreshToken },
                // Skip the auth interceptor for this request to avoid infinite loop
                { headers: { Authorization: "" } },
            )

            const data = response.responseObject

            // Update tokens in localStorage
            if (data.token) {
                localStorage.setItem("access_token", data.token)

                // Update refresh token if a new one is provided
                if (data.refreshToken) {
                    localStorage.setItem("refresh_token", data.refreshToken)
                }


            }

            return data
        } catch (error) {
            console.error("Token refresh error:", error)
            // If refresh fails, clear auth data
            authService.logout()
            throw error
        }
    },

    logout: (): void => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("user")
            localStorage.removeItem("expires_at")
        }
    },

    getCurrentUser: (): { id: number; name: string; email: string } | null => {
        if (typeof window === "undefined") return null

        try {
            const userStr = localStorage.getItem("user")
            if (!userStr) return null

            return JSON.parse(userStr)
        } catch (error) {
            console.error("Error getting current user:", error)
            return null
        }
    },

    isAuthenticated: (): boolean => {
        if (typeof window === "undefined") return false

        try {
            const token = localStorage.getItem("access_token")
            if (!token) return false



            // If no expiration time is stored, just check if token exists
            return !!token
        } catch (error) {
            console.error("Error checking authentication:", error)
            return false
        }
    },

    // isTokenExpired: (): boolean => {
    //     if (typeof window === "undefined") return true

    //     try {
    //         const expiresAt = localStorage.getItem("expires_at")
    //         if (!expiresAt) return false // Can't determine if expired

    //         return Date.now() >= Number.parseInt(expiresAt)
    //     } catch (error) {
    //         console.error("Error checking token expiration:", error)
    //         return true // Assume expired on error
    //     }
    // },

    getAccessToken: (): string | null => {
        if (typeof window === "undefined") return null
        return localStorage.getItem("access_token")
    },

    getRefreshToken: (): string | null => {
        if (typeof window === "undefined") return null
        return localStorage.getItem("refresh_token")
    },
}

export default authService

