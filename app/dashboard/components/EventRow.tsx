'use client'
import type { EventRowProps } from '../types'

function statusColor(status: string) {
    if (status === 'delivered') return 'text-green-400 bg-green-400/10'
    if (status === 'failed') return 'text-red-400 bg-red-400/10'
    return 'text-yellow-400 bg-yellow-400/10'
}

export default function EventRow({event, isSelected, onSelect}: EventRowProps) {
    return (
        <div
            onClick={onSelect}
            className='px-6 py-4 hover:bg-gray-800/50 cursor-pointer transition-colors'>

            <div className="flex items-center justify-between">

                {/*eventStatus*/}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(event.status)}`}>
                    {event.status}
                  </span>
                    <span className="text-gray-400 font-mono text-xs">
                        {event.id.slice(0, 8)}...
                    </span>
                </div>
                
                {/*dateCreated*/}
                <span className="text-gray-500 text-xs">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
            </div>

            {isSelected && (
                <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>

                    {/*eventPayload*/}
                    <div>
                        <p className="text-xs text-gray-500 mb-2">Payload</p>
                        <pre className="bg-gray-800 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-48">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                    </div>

                    <p className="text-xs text-gray-500 mb-2">Delivery Attempts ({event.deliveryAttempts.length})</p>
                    {/*deliveryAttempts*/}
                    <div className="space-y-2">
                        {event.deliveryAttempts.map((attempt, i) => (
                            <div key={attempt.id} className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between">
                                <span className="text-xs text-gray-400">Attempt {i + 1}</span>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs ${attempt.success ? 'text-green-400' : 'text-red-400'}`}>
                                      {attempt.responseStatus ?? 'timeout'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(attempt.attemptedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    )
}