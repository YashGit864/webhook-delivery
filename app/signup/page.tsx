'use client'
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {signIn} from "next-auth/react";

export default function SingupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        const data = await res.json()

        if (!res.ok) {
            setError(data.error || 'Something went wrong')
            setLoading(false)
        } else {
            if (data.shouldLogin) {
                // user exists with same password, just sign them in
                await signIn('credentials', { email, password, redirect: false })
            }
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
                <p className="text-gray-400 mb-8">Start delivering webhooks reliably</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/*Email*/}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/*Password*/}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="new-password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">
                            {error}{' '}
                            {error.includes('already exists') && (
                                <Link href="/login" className="text-blue-400 underline">
                                    Sign in instead
                                </Link>
                            )}
                        </p>
                    )}

                    {/*Submit*/}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 transition-colors"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                {/*Sign in*/}
                <p className="text-gray-400 text-sm mt-6 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-400 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}