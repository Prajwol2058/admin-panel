export interface LoginCredentialsTypes {
    email: string
    password: string
}

export interface RegisterDataTypes {
    name: string
    username: string
    email: string
    password: string
    confirm_password: string
    photo?: string
    gender: string
}

// The complete API response structure
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    responseObject: T;
    statusCode: number;
}

// Your existing auth response type
export interface AuthResponseTypes {
    users: {
        id: number;
        name: string;
        email: string;
        gender: string;
        photo: string;
        role: string;
        created_at: string;
        updated_at: string;
    };
    token: string;
    refreshToken: string;
}



export interface RefreshTokenResponseTypes {
    responseObject: {
        token: string
        refreshToken?: string
    }

}