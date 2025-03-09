import { Category } from "@/types/category-types"
import { ApiService } from "./api-service"

// Create a category service instance
const categoryService = new ApiService<Category>("/categories")

export default categoryService