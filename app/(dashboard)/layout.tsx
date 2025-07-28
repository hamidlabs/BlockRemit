'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Bell,
	ChevronDown,
	List,
	LogOut,
	Send,
	Settings,
	User,
	Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import { signOut, useSession } from '../../lib/auth-client'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	const navigation = [
		{
			name: 'Transactions',
			href: '/transactions',
			icon: List,
			description: 'View your transaction history',
		},
		{
			name: 'Fund Transfer',
			href: '/fund-transfer',
			icon: Send,
			description: 'Send money globally',
		},
	]

	const { data: session } = useSession()

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
	}

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Top Navigation */}
			<header className="bg-white border-b border-slate-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<Link href="/transactions" className="flex items-center">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
								<Wallet className="h-6 w-6 text-white" />
							</div>
							<div className="ml-3">
								<h1 className="text-xl font-bold text-slate-900">BlockRemit</h1>
								<p className="text-xs text-slate-500">Blockchain Remittance</p>
							</div>
						</Link>

						{/* Navigation */}
						<nav className="hidden lg:flex items-center space-x-1">
							{navigation.map(item => {
								const Icon = item.icon
								const isActive = pathname === item.href

								return (
									<Link key={item.name} href={item.href}>
										<Button
											variant={isActive ? 'default' : 'ghost'}
											className={`h-10 px-4 ${isActive ? 'shadow-sm' : ''}`}
										>
											<Icon className="w-4 h-4 mr-2" />
											{item.name}
										</Button>
									</Link>
								)
							})}
						</nav>

						{/* User Menu */}
						<div className="flex items-center space-x-4">
							<Button variant="ghost" size="sm" className="relative">
								<Bell className="h-4 w-4" />
								<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
									3
								</Badge>
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="flex items-center space-x-2 h-13"
									>
										<Avatar className="h-8 w-8">
											<AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium">
												{session?.user ? getInitials(session.user.name) : 'U'}
											</AvatarFallback>
										</Avatar>
										<div className="hidden sm:block text-left">
											<p className="text-sm font-medium text-slate-900 truncate max-w-32">
												{session?.user?.name}
											</p>
											<p className="text-xs text-slate-500 truncate max-w-32">
												{session?.user?.email}
											</p>
										</div>
										<ChevronDown className="h-4 w-4 text-slate-400" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56 bg-white" align="end">
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium">
												{session?.user?.name}
											</p>
											<p className="text-xs text-slate-500">
												{session?.user?.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<User className="mr-2 h-4 w-4" />
										Profile
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Settings className="mr-2 h-4 w-4" />
										Settings
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => {
											signOut()
											redirect('/')
										}}
										className="text-red-600"
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Navigation */}
			<div className="lg:hidden bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="flex space-x-1 py-3">
						{navigation.map(item => {
							const Icon = item.icon
							const isActive = pathname === item.href

							return (
								<Link key={item.name} href={item.href} className="flex-1">
									<Button
										variant={isActive ? 'default' : 'ghost'}
										className="w-full h-10 text-xs"
										size="sm"
									>
										<Icon className="w-4 h-4 mr-1" />
										{item.name}
									</Button>
								</Link>
							)
						})}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	)
}
