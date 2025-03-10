import { Content } from "@/types/content-types"
import { ApiService } from "./api-service"



// Create a base content service
const contentService = new ApiService<Content>("/content")
const contentServiceUpdate = new ApiService<Content>("/content/photo")



export default {contentService, contentServiceUpdate}

