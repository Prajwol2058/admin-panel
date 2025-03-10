export interface Content {
  id: number
  slug: string
  author_id: number
  title: string
  photo?: string
  subtitle: string
  content: string
  size?: string
  width?: number
  height?: number
  category: string
  createdAt: string
}

export interface CreateContentData {
  slug: string
  author_id: number
  title: string
  subtitle: string
  content: string
  category: string
}
