export interface Category {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface CategoriesResponse {
    success?: boolean;
    message?: string;
    responseObject: {
        page: number;
        limit: number;
        total: number;
        categories: Category[];
    };
    statusCode?: number;
}


export interface CreateCategoryData {
    name: string
}

export interface EditCategoryTypes {
    id: number;
    name: string;
}