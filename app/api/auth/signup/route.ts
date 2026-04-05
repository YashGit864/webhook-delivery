import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs'

export const POST = async (req: Request) => {
    const { email, password } = await req.json();
    if (!email || !password)
        return NextResponse.json({ error: 'Email and Password required' }, { status: 400 })

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        const passwordMatch = await bcrypt.compare(password, existingUser.password)
        if (!passwordMatch)
            return NextResponse.json({ error: 'An account with this email already exists. Please sign in instead.' }, { status: 400 })

        return NextResponse.json({ message: 'User already exists', shouldLogin: true }, { status: 200 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: { email, password: hashedPassword }
    })

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 })
}