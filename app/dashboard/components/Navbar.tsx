'use client'

import { signOut } from 'next-auth/react'
import type { NavbarProps} from '../types'

export default function Navbar({ email }: NavbarProps) {
    return (
        <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">WebhookDelivery</h1>
            <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">{email}</span>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Sign out
                </button>
            </div>
        </nav>
    )
}