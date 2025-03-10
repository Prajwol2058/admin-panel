import { QueryParamsTypes } from "@/types/query-params"
import { toast } from "sonner"
import axiosClient from "../axios-client"

/**
 * Generic API service for making HTTP requests
 */
export class ApiService<T> {
    private endpoint: string

    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    /**
     * Get all items
     */
    async getAll(params?: QueryParamsTypes): Promise<T[]> {
        try {
            const queryParams = {
                ...params,
            }


            const response = await axiosClient.get<T[]>(this.endpoint, { params: queryParams })
            return response.data
        } catch (error) {
            this.handleError(error, "fetching")
            throw error
        }
    }

    /**
     * Get item by ID
     */
    async getById(id: number | string): Promise<T> {
        try {
            const response = await axiosClient.get<T>(`${this.endpoint}/${id}`)
            return response.data
        } catch (error) {
            this.handleError(error, "fetching")
            throw error
        }
    }

    /**
     * Create new item
     */
    async create(data: Partial<T>): Promise<T> {
        try {
            const response = await axiosClient.post<T>(this.endpoint, data)
            toast.success("Created successfully")
            return response.data
        } catch (error) {
            this.handleError(error, "creating")
            throw error
        }
    }

    /**
     * Update existing item
     */
    async update(id: number | string, data: Partial<T>): Promise<T> {
        try {
            const response = await axiosClient.put<T>(`${this.endpoint}/${id}`, data)
            toast.success("Updated successfully")
            return response.data
        } catch (error) {
            this.handleError(error, "updating")
            throw error
        }
    }

    /**
     * Delete item
     */
    async delete(id: number | string): Promise<void> {
        try {
            await axiosClient.delete(`${this.endpoint}/${id}`)
            toast.success("Deleted successfully")
        } catch (error) {
            this.handleError(error, "deleting")
            throw error
        }
    }

    /**
     * Handle API errors
     */
    private handleError(error: any, action: string): void {
        console.error(`Error ${action}:`, error)

        let message = `Error ${action} data`

        if (error.response) {
            // The request was made and the server responded with an error status
            const serverError = error.response.data?.error || error.response.data?.message
            if (serverError) {
                message = serverError
            } else {
                message = `Error ${action} data (${error.response.status})`
            }
        } else if (error.request) {
            // The request was made but no response was received
            message = "No response from server"
        } else {
            // Something happened in setting up the request
            message = error.message || `Error ${action} data`
        }

        toast.error(`Error ${action}`, {
            description: message,
        })
    }
}

