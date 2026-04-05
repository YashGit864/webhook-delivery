import CredentialsProvider from "next-auth/providers/credentials";
import {prisma} from "@/lib/prisma";
import bcrypt from 'bcryptjs'
import { Session } from "next-auth";
import { NextAuthOptions } from 'next-auth'
import {JWT} from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
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

                const passwordMatch = bcrypt.compare(credentials.password, user.password)
                if(!passwordMatch) return null;

                return {id: user.id, email: user.email, apiKey: user.apiKey}
            }
        })
    ],
    callbacks: {
        async jwt({token, user}: { token: JWT; user?: { id: string; email: string; apiKey: string } }) {
            if (user) {
                token.id = user.id,
                    token.apiKey = (user as { id: string; email: string; apiKey: string }).apiKey
            }
            return token;
        },
        async session({session, token}: { session: Session; token: JWT }) {
            if (session) {
                session.user.id = token.id as string,
                    session.user.apiKey = token.apiKey as string
            }
            return session;
        },
    },
    pages: { signIn: '/login' },
    session: { strategy: 'jwt' as const}
}
