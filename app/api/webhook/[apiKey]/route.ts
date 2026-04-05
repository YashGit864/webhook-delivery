import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {Queue} from "bullmq";

const webhookQueue = new Queue('webhook-delivery', {
    connection: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!)
    }})

export const POST = async (req: Request, {params}: {params: Promise<{apiKey: string}>}) => {
    const {apiKey} = await params;

    const user = await prisma.user.findUnique({
        where: {apiKey},
        include: {endpoint: true}
    })

    if (!user)
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })

    if (!user.endpoint)
        return NextResponse.json({ error: 'No endpoint registered' }, { status: 400 })

    const payload = await req.json()
    const headers = Object.fromEntries(req.headers.entries())

    const event = await prisma.webhookEvent.create({
        data: {
            userId: user.id,
            payload,
            headers,
            status: 'pending'
        }
    })

    await webhookQueue.add('deliver', {
        eventId: event.id,
        targetUrl: user.endpoint.url,
        payload,
        headers
    }, {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    })

    return NextResponse.json({received: true, eventId: event.id})
}