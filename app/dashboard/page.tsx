'use client'

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import Navbar from './components/Navbar'
import WebhookUrlCard from './components/WebhookUrlCard'
import EndpointConfig from './components/EndpointConfig'
import EventsTable from './components/EventsTable'
import {Endpoint, DeliveryAttempt, WebhookEvent} from './types';

export default function DashboardPage() {
    const {data: session, status} = useSession()
    const router = useRouter()
    const [endpoint, setEndpoint] = useState<Endpoint | null>(null)
    const [endpointUrl, setEndpointUrl] = useState('')
    const [saving, setSaving] = useState(false)
    const [events, setEvents] = useState<WebhookEvent[]>([])
    const [loading, setLoading] = useState(false)


    async function fetchData (){
        const [eventsRes, endpointRes] = await Promise.all([
            fetch('/api/events'),
            fetch('/api/endpoint')
        ])
        const eventsData: WebhookEvent[] = await eventsRes.json()
        const endpointData: Endpoint = await endpointRes.json()
        setEvents(eventsData)
        setEndpoint(endpointData)
        if(endpointData?.url) setEndpointUrl(endpointData.url)
        setLoading(false)
    }

    useEffect(() => {
        if(status == 'unauthenticated') return router.push('/login')
    }, [status, router]);

    useEffect(() => {
        if(status === 'authenticated') fetchData()
    }, [status]);


    async function saveEndpoint() {
        setSaving(true)
        const res = await fetch('/api/endpoint', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: endpointUrl})
        })
        const data: Endpoint = await res.json()
        setEndpoint(data)
        setSaving(false)

    }

    if(status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className='text-gray-400'>Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar email={session?.user?.email ?? ''} />
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                <WebhookUrlCard apiKey={session?.user?.apiKey ?? ''} />
                <EndpointConfig
                    endpoint={endpoint}
                    endpointUrl={endpointUrl}
                    saving={saving}
                    onChange={setEndpointUrl}
                    onSave={saveEndpoint}
                />
                <EventsTable events={events} />
            </div>
        </div>
    )
}
