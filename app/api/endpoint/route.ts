import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth/auth";
import crypto from "crypto";

export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({error: 'Unauthorised'}, {status: 401})

    const {url} = await req.json()

    const endpoint = await prisma.endpoint.upsert({
        where: {userId: session.user.id},
        update: {url},
        create: {
            userId: session.user.id,
            url,
            secret: crypto.randomBytes(32).toString('hex')
        }
    })
    return NextResponse.json(endpoint)
}

export const GET = async () => {
    const session = await getServerSession(authOptions)
    if(!session)
        return NextResponse.json({error: 'Unauthorised'}, {status: 401})

    const endpoint = await prisma.endpoint.findUnique({
        where: {userId: session.user.id}
    })

    return NextResponse.json(endpoint)
}