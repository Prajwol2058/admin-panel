/**
 * Centralized API client for making HTTP requests
 */

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

/**
 * Generic request function for making HTTP requests
 * @param endpoint - API endpoint to call
 * @param method - HTTP method to use
 * @param data - Optional data to send with the request
 * @returns Promise with the response data
 */
async function request<T>(endpoint: string, method: HttpMethod = "GET", data?: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }

    // Add authorization header if token exists
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token")
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }
    }

    const config: RequestInit = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    }

    try {
        const response = await fetch(url, config)

        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth_token")
                window.location.href = "/login"
            }
            throw new ApiError("Unauthorized", 401)
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

