import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {prisma} from "@/lib/prisma";
import bcrypt from 'bcryptjs'

interface ExtendedUser {
    id: string
    email: string
    apiKey: string
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: {email: credentials.email}
                })
                if(!user) return null;

                const passwordMatch = await bcrypt.compare(credentials.password, user.password)
                if(!passwordMatch) return null;

                return {
                    id: user.id,
                    email: user.email,
                    apiKey: user.apiKey
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id
                token.apiKey = (user as ExtendedUser).apiKey
            }
            return token
        },
        async session({session, token}) {
            if (token) {
                session.user.id = token.id as string;
                session.user.apiKey = token.apiKey as string;
            }
            return session;
        },
    },
    pages: {
            signIn: '/login',
        },
    session: {
            strategy: 'jwt'
        }
})

export {handler as GET, handler as POST}