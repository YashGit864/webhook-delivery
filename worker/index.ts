import 'dotenv/config'
import {Worker, Job} from "bullmq";
import {prisma} from "../lib/prisma";

const connection = {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined
}

const deliverWebhook = async (job: Job) => {
    const {eventId, targetUrl, payload} = job.data

    try{
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000)
            })
        const success = response.ok

        await prisma.deliveryAttempt.create({
            data:{
                eventId,
                responseStatus: response.status,
                success
            }
        })

        await prisma.webhookEvent.update({
            where: {id: eventId},
            data: {status: success ? 'delivered' : 'failed'}
        })
        if(!success)
            throw new Error((`Delivery failed with status ${response.status}`))
        console.log(`Event ${eventId} delivered successfully`)

    }
    catch (error) {
        try {
            await prisma.deliveryAttempt.create({
                data: {
                    eventId,
                    responseStatus: null,
                    success: false
                }
            })

            await prisma.webhookEvent.update({
                where: { id: eventId },
                data: { status: 'failed' }
            })
        } catch (dbError) {
            console.error('Failed to log delivery attempt:', dbError)
        }

        throw error
    }
}

const worker = new Worker('webhook-delivery', deliverWebhook, {connection})

worker.on('completed', (job) => console.log(`Job ${job.id} completed`))
worker.on('failed', (job, err:Error)=> console.log(`Job ${job?.id} failed: ${err.message}`))
worker.on('error', (error) => console.error('Worker error:', error))

console.log('🚀 Webhook delivery worker started')
