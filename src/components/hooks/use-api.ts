"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import axiosClient from "@/lib/axios-client"
import { AxiosError } from "axios"

export function useApi<T>() {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchData = useCallback(async (endpoint: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axiosClient.get<T>(endpoint)
            setData(response.data)
            return response.data
        } catch (err) {
            const error = err instanceof Error ? err : new Error("An unknown error occurred")
            setError(error)

            // Extract error message from axios error
            let message = "Error fetching data"
            if (err instanceof AxiosError && err.response?.data) {
                message = err.response.data.error || err.response.data.message || message
            }

            toast.error("Error fetching data", {
                description: message,
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const postData = useCallback(async (endpoint: string, payload: any) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axiosClient.post<T>(endpoint, payload)
            setData(response.data)
            return response.data
        } catch (err) {
            const error = err instanceof Error ? err : new Error("An unknown error occurred")
            setError(error)

            // Extract error message from axios error
            let message = "Error saving data"
            if (err instanceof AxiosError && err.response?.data) {
                message = err.response.data.error || err.response.data.message || message
            }

            toast.error("Error saving data", {
                description: message,
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateData = useCallback(async (endpoint: string, payload: any) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axiosClient.put<T>(endpoint, payload)
            setData(response.data)
            return response.data
        } catch (err) {
            const error = err instanceof Error ? err : new Error("An unknown error occurred")
            setError(error)

            // Extract error message from axios error
            let message = "Error updating data"
            if (err instanceof AxiosError && err.response?.data) {
                message = err.response.data.error || err.response.data.message || message
            }

            toast.error("Error updating data", {
                description: message,
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const deleteData = useCallback(async (endpoint: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axiosClient.delete(endpoint)
            setData(null)
            return response.data
        } catch (err) {
            const error = err instanceof Error ? err : new Error("An unknown error occurred")
            setError(error)

            // Extract error message from axios error
            let message = "Error deleting data"
            if (err instanceof AxiosError && err.response?.data) {
                message = err.response.data.error || err.response.data.message || message
            }

            toast.error("Error deleting data", {
                description: message,
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        data,
        isLoading,
        error,
        fetchData,
        postData,
        updateData,
        deleteData,
    }
}

