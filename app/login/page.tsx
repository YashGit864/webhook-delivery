'use client'

import {useState} from "react";
import {signIn} from 'next-auth/react'
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false
        })
        if(result?.error){
            setError('Invalid email or password')
            setLoading(false);
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-gray-400 mb-8">Sign in to your account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/*Email*/}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            placeholder="abc@example.com"
                            required
                        />
                    </div>

                    {/*Password*/}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="current-password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/*Error*/}
                    {error && (<p className="text-red-400 text-sm">{error}</p>)}

                    {/*Submit Button*/}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                {/*Sing up*/}
                <p className="text-gray-400 text-sm mt-6 text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-blue-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}