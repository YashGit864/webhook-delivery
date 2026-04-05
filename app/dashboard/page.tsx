'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from './components/Navbar'
import WebhookUrlCard from './components/WebhookUrlCard'
import EndpointConfig from './components/EndpointConfig'
import EventsTable from './components/EventsTable'
import { Endpoint, WebhookEvent } from './types';
import TestWebhook from './components/TestWebhook'
import WorkerNotice from './components/WorkerNotice'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [endpoint, setEndpoint] = useState<Endpoint | null>(null)
    const [endpointUrl, setEndpointUrl] = useState('')
    const [saving, setSaving] = useState(false)
    const [events, setEvents] = useState<WebhookEvent[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchEvents() {
        const res = await fetch('/api/events')
        const data: WebhookEvent[] = await res.json()
        setEvents(data)
    }

    async function fetchData() {
        const [eventsRes, endpointRes] = await Promise.all([
            fetch('/api/events'),
            fetch('/api/endpoint')
        ])
        const eventsData: WebhookEvent[] = await eventsRes.json()
        const endpointData: Endpoint = await endpointRes.json()
        setEvents(eventsData)
        setEndpoint(endpointData)
        if (endpointData?.url) {
            setEndpointUrl(endpointData.url)
        } else {
            setEndpointUrl(`${process.env.NEXT_PUBLIC_APP_URL}/api/test-receiver`)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
    }, [status, router])

    // initial load
    useEffect(() => {
        if (status === 'authenticated') fetchData()
    }, [status])

    // auto refresh events every 5 seconds
    useEffect(() => {
        if (status !== 'authenticated') return
        const interval = setInterval(fetchEvents, 5000)
        return () => clearInterval(interval)
    }, [status])

    async function saveEndpoint() {
        setSaving(true)
        const res = await fetch('/api/endpoint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: endpointUrl })
        })
        const data: Endpoint = await res.json()
        setEndpoint(data)
        setSaving(false)
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className='text-gray-400'>Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar email={session?.user?.email ?? ''} />
            <WorkerNotice />
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                <WebhookUrlCard apiKey={session?.user?.apiKey ?? ''} />
                <EndpointConfig
                    endpoint={endpoint}
                    endpointUrl={endpointUrl}
                    saving={saving}
                    onChange={setEndpointUrl}
                    onSave={saveEndpoint}
                />
                <TestWebhook apiKey={session?.user?.apiKey ?? ''} />
                <EventsTable events={events} />
            </div>
        </div>
    )
}