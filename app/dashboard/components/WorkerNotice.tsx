'use client'

import { useState } from 'react'

export default function WorkerNotice() {
    const [show, setShow] = useState(true)

    if (!show) return null

    return (
        <div className="bg-yellow-400/10 border-b border-yellow-400/20 px-6 py-3 flex items-center justify-between">
            <p className="text-yellow-400 text-sm">
                ⚠️ Webhook delivery requires the worker process to be running locally —{' '}
                <code className="bg-yellow-400/10 px-1.5 py-0.5 rounded text-xs">npm run worker</code>
                {' '}— Cloud deployment requires a paid persistent process host (Railway/Render).
            </p>
            <button
                onClick={() => setShow(false)}
                className="text-yellow-400 hover:text-yellow-300 ml-4 text-xl leading-none flex-shrink-0 cursor-pointer p-1"
            >
                ×
            </button>
        </div>
    )
}