import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const payload = await req.json()
    console.log('Received webhook:', payload)
    return NextResponse.json({ received: true })
}