import type { WebhookUrlCardProps } from '../types'

export default function WebhookUrlCard({apiKey}: WebhookUrlCardProps) {
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhook/${apiKey}`;

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Your Webhook URL</h2>
            <p className="text-gray-300 text-sm mb-2">Send webhooks to this URL to receive and deliver them:</p>
            <div className="bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm text-blue-400 break-all">
                {webhookUrl}
            </div>
        </div>
    )
}