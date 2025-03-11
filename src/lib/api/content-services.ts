import { Content, ContentResponse } from "@/types/content-types"
import { ApiService } from "./api-service"



// Create a base content service
const contentService = new ApiService<ContentResponse>("/content")
const contentServiceUpdate = new ApiService<Content>("/content/photo")



export default {contentService, contentServiceUpdate}

