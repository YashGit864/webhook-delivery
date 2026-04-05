'use client'

import { useState } from 'react'
import {TestWebhookProps} from "@/app/dashboard/types";

export default function TestWebhook({ apiKey }: TestWebhookProps) {
    const [payload, setPayload] = useState(JSON.stringify({ event: 'payment.success', amount: 100 }, null, 2))
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    async function sendWebhook() {
        setLoading(true)
        setResult(null)

        try {
            const parsed = JSON.parse(payload)
            const res = await fetch(`/api/webhook/${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed)
            })
            const data = await res.json()

            if (res.ok) {
                setResult({ success: true, message: `Webhook queued successfully — Event ID: ${data.eventId}` })
            } else {
                setResult({ success: false, message: data.error || 'Something went wrong' })
            }
        } catch {
            setResult({ success: false, message: 'Invalid JSON payload' })
        }

        setLoading(false)
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Test Webhook</h2>
            <p className="text-gray-300 text-sm mb-4">Send a test webhook to see the delivery pipeline in action.</p>

            <div className="space-y-3">

                {/*Payload*/}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Payload (JSON)</label>
                    <textarea
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                        rows={5}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono focus:outline-none focus:border-blue-500 resize-none"
                    />
                </div>

                {/*Send button*/}
                <button
                    onClick={sendWebhook}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                    {loading ? 'Sending...' : 'Send Webhook'}
                </button>

                {/*Result*/}
                {result && (
                    <div className={`rounded-lg px-4 py-3 text-sm ${result.success ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                        {result.message}
                    </div>
                )}
            </div>
        </div>
    )
}