declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email: string
            apiKey: string
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        apiKey: string
    }
}