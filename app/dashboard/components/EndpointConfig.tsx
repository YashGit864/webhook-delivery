'use client'

interface Endpoint {
    id: string
    url: string
    secret: string
}

interface EndpointConfigProps {
    endpoint: Endpoint | null
    endpointUrl: string
    saving: boolean
    onChange: (url: string) => void
    onSave: () => void
}

export default function EndpointConfig({endpoint, endpointUrl, saving, onChange, onSave}: EndpointConfigProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Delivery Endpoint</h2>
            <p className="text-gray-300 text-sm mb-4">Where should we forward received webhooks?</p>

            {/*endpointUrl*/}
            <div className="flex gap-3">
                <input
                    type="url"
                    value={endpointUrl}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://your-server.com/webhooks"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            {/*secret*/}
            {endpoint?.secret && (
                <div className="mt-4">
                    <p className="text-gray-400 text-xs mb-1">Signing Secret</p>
                    <div className="bg-gray-800 rounded-lg px-4 py-2 font-mono text-xs text-gray-300 break-all">
                        {endpoint.secret}
                    </div>
                </div>
            )}
        </div>
    )
}