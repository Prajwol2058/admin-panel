export interface Content {
  id: number
  slug: string
  author_id: number
  title: string
  photo: File | null
  subtitle: string
  content: string
  category: string
  size: number
  width: number
  height: number
  is_deleted: number
  created_at: string
  updated_at: string
}

export interface CreateContentData {
  slug: string
  author_id: number
  title: string
  photo: File | null
  subtitle: string
  content: string
  category: string
}
