/**
 * Centralized API client for making HTTP requests
 */
import { toast } from "sonner"
import authService from "./api/auth-service"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// HTTP request methods
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

// API Error class for better error handling
export class ApiError extends Error {
    status: number
    data: any

    constructor(message: string, status: number, data?: any) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.data = data
    }
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
// Queue of requests to retry after token refresh
let refreshQueue: Array<() => void> = []

// Process the queue of requests that were waiting for a token refresh
const processQueue = (error: Error | null) => {
    refreshQueue.forEach((callback) => {
        if (error) {
            // If refresh failed, reject all queued requests
            callback()
        } else {
            // If refresh succeeded, retry all queued requests
            callback()
        }
    })

    // Reset the queue
    refreshQueue = []
}

/**
 * Generic request function for making HTTP requests
 * @param endpoint - API endpoint to call
 * @param method - HTTP method to use
 * @param data - Optional data to send with the request
 * @returns Promise with the response data
 */
async function request<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    data?: any,
    retryWithRefresh = true,
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }

    // Add authorization header if token exists
    if (typeof window !== "undefined") {
        try {
            const token = authService.getAccessToken()
            if (token) {
                headers["Authorization"] = `Bearer ${token}`
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error)
        }
    }

    const config: RequestInit = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    }

    try {
        const response = await fetch(url, config)

        // Handle 403 Forbidden - token expired, need token refresh
        if (response.status === 403 && retryWithRefresh) {
            // Don't try to refresh for auth endpoints
            if (endpoint.includes("/auth/login") || endpoint.includes("/auth/refresh")) {
                if (typeof window !== "undefined") {
                    authService.logout()
                    window.location.href = "/login"
                }
                throw new ApiError("Authentication failed", 403)
            }

            // Try to refresh the token
            return await handleTokenRefresh<T>(endpoint, method, data)
        }

        // Parse response based on content type
        let responseData: any
        const contentType = response.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            // JSON response
            const text = await response.text()
            responseData = text ? JSON.parse(text) : {}
        } else {
            // Non-JSON response
            responseData = await response.text()
        }

        if (!response.ok) {
            throw new ApiError(
                responseData.error || `Request failed with status ${response.status}`,
                response.status,
                responseData,
            )
        }

        return responseData
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }

        console.error(`API Error (${method} ${endpoint}):`, error)
        throw error instanceof Error ? error : new Error("An unknown error occurred")
    }
}

/**
 * Handle token refresh and retry the original request
 */
async function handleTokenRefresh<T>(endpoint: string, method: HttpMethod, data?: any): Promise<T> {
    // Create a promise that will be resolved when the token is refreshed
    return new Promise<T>((resolve, reject) => {
        // Add this request to the queue
        refreshQueue.push(() => {
            // Retry the original request with the new token
            request<T>(endpoint, method, data, false).then(resolve).catch(reject)
        })

        // If a refresh is already in progress, wait for it to complete
        if (isRefreshing) return

        isRefreshing = true

        // Try to refresh the token
        authService
            .refreshToken()
            .then(() => {
                isRefreshing = false
                processQueue(null)
            })
            .catch((error) => {
                isRefreshing = false
                processQueue(error)

                // Redirect to login if refresh fails
                if (typeof window !== "undefined") {
                    authService.logout()
                    window.location.href = "/login"
                    toast.error("Session expired", {
                        description: "Please log in again",
                    })
                }
            })
    })
}

/**
 * API client with methods for different HTTP requests
 */
const apiClient = {
    /**
     * Make a GET request to the API
     * @param endpoint - API endpoint to call
     * @returns Promise with the response data
     */
    get: <T,>(endpoint: string): Promise<T> => request<T>(endpoint, "GET"),

    /**
     * Make a POST request to the API
     * @param endpoint - API endpoint to call
     * @param data - Data to send with the request
     * @returns Promise with the response data
     */
    post: <T,>(endpoint: string, data: any): Promise<T> => request<T>(endpoint, "POST", data),

    /**
     * Make a PUT request to the API
     * @param endpoint - API endpoint to call
     * @param data - Data to send with the request
     * @returns Promise with the response data
     */
    put: <T,>(endpoint: string, data: any): Promise<T> => request<T>(endpoint, "PUT", data),

    /**
     * Make a DELETE request to the API
     * @param endpoint - API endpoint to call
     * @returns Promise with the response data
     */
    delete: <T,>(endpoint: string): Promise<T> => request<T>(endpoint, "DELETE"),
}

export default apiClient

