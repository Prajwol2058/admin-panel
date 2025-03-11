export interface QueryParamsTypes {
    size_from?: number;
    size_to?: number;
    width_from?: number;
    width_to?: number;
    height_from?: number;
    height_to?: number;
    title?: string;
    subtitle?: string;
    keywords?: string[];
    category?: number;
    author_id?: number;
    created_at_from?: string;
    created_at_to?: string;
    page?: number;
    limit?: number;
}