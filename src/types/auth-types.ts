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

export interface AuthResponseTypes {
    responseObject: {
        users: {
            id: number
            name: string
            email: string
            gender: string
            photo: string
            role: string
            created_at: string
            updated_at: string
        }
        token: string
        refreshToken: string
    }
}


export interface RefreshTokenResponseTypes {
    accessToken: string
    refreshToken?: string
}