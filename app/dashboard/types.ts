export interface DeliveryAttempt {
    id: string
    attemptedAt: string
    responseStatus: number | null
    success: boolean
}

export interface WebhookEvent {
    id: string
    status: string
    createdAt: string
    payload: Record<string, unknown>
    headers: Record<string, string>
    deliveryAttempts: DeliveryAttempt[]
}

export interface Endpoint {
    id: string
    url: string
    secret: string
}

export interface NavbarProps {
    email: string
}

export interface WebhookUrlCardProps {
    apiKey: string
}

export interface EndpointConfigProps {
    endpoint: Endpoint | null
    endpointUrl: string
    saving: boolean
    onChange: (url: string) => void
    onSave: () => void
}

export interface EventRowProps {
    event: WebhookEvent
    isSelected: boolean
    onSelect: () => void
}

export interface EventsTableProps {
    events: WebhookEvent[]
}

export interface TestWebhookProps {
    apiKey: string
}