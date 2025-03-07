import axios, { type AxiosError, type AxiosRequestConfig } from "axios"
import { toast } from "sonner"
import authService from "./api/auth-service"

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Create axios instance
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
// Queue of requests to retry after token refresh
let refreshQueue: Array<(token: string) => void> = []

// Process the queue of requests that were waiting for a token refresh
const processQueue = (error: Error | null, token = "") => {
    refreshQueue.forEach((callback) => {
        if (error) {
            // If refresh failed, reject all queued requests
            callback("")
        } else {
            // If refresh succeeded, retry all queued requests with new token
            callback(token)
        }
    })

    // Reset the queue
    refreshQueue = []
}

// Request interceptor for adding auth token
axiosClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = authService.getAccessToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Response interceptor for handling token refresh
axiosClient.interceptors.response.use(
    (response) => {
        return response
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // If error is not 401 or request has already been retried, reject
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error)
        }

        // Don't retry auth endpoints
        const url = originalRequest.url || ""
        if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
            if (typeof window !== "undefined") {
                authService.logout()
                window.location.href = "/login"
            }
            return Promise.reject(error)
        }

        // Mark this request as retried
        originalRequest._retry = true

        // If not refreshing yet, start refresh process
        if (!isRefreshing) {
            isRefreshing = true

            try {
                // Try to refresh the token
                const response = await authService.refreshToken()
                const newToken = response.accessToken

                isRefreshing = false
                processQueue(null, newToken)

                // Retry the original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                }
                return axiosClient(originalRequest)
            } catch (refreshError) {
                isRefreshing = false
                processQueue(refreshError as Error)

                // Redirect to login if refresh fails
                if (typeof window !== "undefined") {
                    authService.logout()
                    window.location.href = "/login"
                    toast.error("Session expired", {
                        description: "Please log in again",
                    })
                }
                return Promise.reject(refreshError)
            }
        }

        // If already refreshing, add to queue
        return new Promise((resolve) => {
            refreshQueue.push((token: string) => {
                if (token) {
                    // Retry with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                    }
                    resolve(axiosClient(originalRequest))
                } else {
                    // If no token (refresh failed), reject
                    resolve(Promise.reject(error))
                }
            })
        })
    },
)

export default axiosClient

