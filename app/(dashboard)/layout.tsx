'use client'

import { useSession, signOut } from '@/lib/auth-client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { LogOut, Send, List, Wallet } from 'lucide-react'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { data: session, isPending } = useSession()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		if (!isPending && !session) {
			router.push('/login')
		}
	}, [session, isPending, router])

	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	if (!session) {
		return null
	}

	const navigation = [
		{ name: 'Transactions', href: '/transactions', icon: List },
		{ name: 'Fund Transfer', href: '/fund-transfer', icon: Send },
	]

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<Wallet className="h-8 w-8 text-blue-600" />
								<span className="ml-2 text-xl font-bold text-gray-900">
									Blockchain Remittance
								</span>
							</div>
							<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
								{navigation.map(item => {
									const Icon = item.icon
									return (
										<Link
											key={item.name}
											href={item.href}
											className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
												pathname === item.href
													? 'border-blue-500 text-gray-900'
													: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
											}`}
										>
											<Icon className="w-4 h-4 mr-2" />
											{item.name}
										</Link>
									)
								})}
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-700">
								Welcome, {session.user.name}
							</span>
							<button
								onClick={() => signOut()}
								className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								<LogOut className="w-4 h-4 mr-1" />
								Sign out
							</button>
						</div>
					</div>
				</div>
			</div>
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
		</div>
	)
}
