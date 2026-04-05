'use client'

import { useState } from 'react'
import EventRow from './EventRow'
import type { EventsTableProps } from '../types'

export default function EventsTable({events}: EventsTableProps) {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/*Table Heading*/}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Webhook Events</h2>
                <span className="text-gray-500 text-sm">{events.length} total</span>
            </div>

            {/*Table Content*/}
            {events.length === 0 ? (
                <div className="px-6 py-16 text-center">
                    <p className="text-gray-500">No webhook events yet.</p>
                    <p className="text-gray-600 text-sm mt-1">Send a POST request to your webhook URL to get started.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-800">
                    {events.map((event) => (
                        <EventRow
                            key={event.id}
                            event={event}
                            isSelected={selectedEventId === event.id}
                            onSelect={() => setSelectedEventId(selectedEventId === event.id ? null : event.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}