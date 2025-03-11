import { CategoriesResponse } from "@/types/category-types"
import { ApiService } from "./api-service"

// Create a category service instance
const categoryService = new ApiService<CategoriesResponse>("/categories")

export default categoryService