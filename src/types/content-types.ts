export interface Content {
  id: number;
  slug?: string;
  author: {
    id: number;
    name: string;
  };
  title: string;
  photo: string | null; 
  subtitle: string;
  content: string;
  category: {
    id: number;
    name: string;
  }; 
  size: number;
  width: number;
  height: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export interface ContentResponse {
  success: boolean;
  message: string;
  responseObject: {
    page: number;
    limit: number;
    total: number;
    content: Content[];
  };
  statusCode: number;
}
