'use client'

import { registerUser } from '@/app/actions/auth'
import { signUp } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		country: '',
	})
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const countries = [
		'United States',
		'United Kingdom',
		'Canada',
		'Australia',
		'Germany',
		'France',
		'Japan',
		'Singapore',
		'India',
		'Bangladesh',
	]

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			// Register with Better Auth
			const authResult = await signUp.email({
				email: formData.email,
				password: formData.password,
				name: formData.name,
			})

			if (authResult.error) {
				setError(authResult.error.message || 'Registration failed')
				return
			}

			// Create user in our database with wallet
			const result = await registerUser({
				name: formData.name,
				email: formData.email,
				country: formData.country,
				password: formData.password,
			})

			if (result.success) {
				router.push('/transactions')
			} else {
				setError(result.error || 'Failed to create user profile')
			}
		} catch (err) {
			setError('An error occurred during registration')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Join the Blockchain Remittance System
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<input
							type="text"
							required
							className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Full name"
							value={formData.name}
							onChange={e => setFormData({ ...formData, name: e.target.value })}
						/>
						<input
							type="email"
							required
							className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Email address"
							value={formData.email}
							onChange={e =>
								setFormData({ ...formData, email: e.target.value })
							}
						/>
						<select
							required
							className="relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							value={formData.country}
							onChange={e =>
								setFormData({ ...formData, country: e.target.value })
							}
						>
							<option value="">Select your country</option>
							{countries.map(country => (
								<option key={country} value={country}>
									{country}
								</option>
							))}
						</select>
						<input
							type="password"
							required
							className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Password"
							value={formData.password}
							onChange={e =>
								setFormData({ ...formData, password: e.target.value })
							}
						/>
					</div>

					{error && (
						<div className="rounded-md bg-red-50 p-4">
							<div className="text-sm text-red-700">{error}</div>
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
					>
						{isLoading ? 'Creating account...' : 'Create account'}
					</button>

					<div className="text-center">
						<Link href="/login" className="text-blue-600 hover:text-blue-500">
							Already have an account? Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}
