'use client'

import {
	getUserBalances,
	getUserTransactions,
} from '@/app/actions/transactions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
	Activity,
	ArrowDownLeft,
	ArrowUpRight,
	Eye,
	RefreshCw,
	Search,
	TrendingUp,
	Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Transaction = {
	id: string
	txId: string
	amount: number
	sourceCurrency: string
	targetCurrency: string
	status: string
	exchangeRate: number
	settledAmount: number
	fee: number
	createdAt: Date
	type: 'sent' | 'received'
	sender?: { name: string; email: string }
	receiver?: { name: string; email: string }
}

type Balance = {
	currency: string
	amount: number
}

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [balances, setBalances] = useState<Balance[]>([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const fetchData = async () => {
		try {
			const [transactionsResult, balancesResult] = await Promise.all([
				getUserTransactions(),
				getUserBalances(),
			])

			if (transactionsResult.success) {
				setTransactions(transactionsResult.transactions || [])
			}

			if (balancesResult.success) {
				setBalances(balancesResult.balances || [])
			}
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
			setRefreshing(false)
		}
	}

	useEffect(() => {
		fetchData()
		const interval = setInterval(fetchData, 10000) // Refresh every 10 seconds
		return () => clearInterval(interval)
	}, [])

	const handleRefresh = () => {
		setRefreshing(true)
		fetchData()
	}

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			INITIATED: { variant: 'secondary' as const, label: 'Initiated' },
			VALIDATED: { variant: 'outline' as const, label: 'Validated' },
			EXECUTED: { variant: 'default' as const, label: 'Executed' },
			SETTLED: {
				variant: 'default' as const,
				label: 'Completed',
				className: 'bg-green-500 hover:bg-green-600',
			},
			FAILED: { variant: 'destructive' as const, label: 'Failed' },
		}

		const config =
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.INITIATED

		return <Badge variant={config.variant}>{config.label}</Badge>
	}

	const filteredTransactions = transactions.filter(tx => {
		const searchLower = searchTerm.toLowerCase()
		return (
			tx.txId.toLowerCase().includes(searchLower) ||
			tx.sender?.name.toLowerCase().includes(searchLower) ||
			tx.receiver?.name.toLowerCase().includes(searchLower) ||
			tx.sender?.email.toLowerCase().includes(searchLower) ||
			tx.receiver?.email.toLowerCase().includes(searchLower)
		)
	})

	const totalBalance = balances.reduce((sum, balance) => {
		// Convert everything to USD for total (simplified)
		const rates: Record<string, number> = {
			USD: 1,
			EUR: 1.18,
			GBP: 1.33,
			JPY: 0.009,
		}
		return sum + balance.amount * (rates[balance.currency] || 1)
	}, 0)

	if (loading) {
		return (
			<div className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[...Array(4)].map((_, i) => (
						<Card key={i}>
							<CardHeader className="pb-2">
								<Skeleton className="h-4 w-20" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-32 mb-2" />
								<Skeleton className="h-3 w-24" />
							</CardContent>
						</Card>
					))}
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
					<p className="text-slate-600 mt-1">
						Manage your blockchain remittance transactions
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<Button
						onClick={handleRefresh}
						disabled={refreshing}
						variant="outline"
						size="sm"
					>
						<RefreshCw
							className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
						/>
						Refresh
					</Button>
					<Link href="/fund-transfer">
						<Button>
							<ArrowUpRight className="w-4 h-4 mr-2" />
							Send Money
						</Button>
					</Link>
				</div>
			</div>

			{/* Balance Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{balances.map(balance => (
					<Card key={balance.currency} className="relative overflow-hidden">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-slate-600 flex items-center">
								<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
									<span className="text-white text-xs font-bold">
										{balance.currency.substring(0, 1)}
									</span>
								</div>
								{balance.currency} Balance
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-slate-900 mb-1">
								{formatCurrency(balance.amount, balance.currency)}
							</div>
							<p className="text-xs text-slate-500">Available to send</p>
						</CardContent>
						<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-3xl" />
					</Card>
				))}

				{/* Total Portfolio Card */}
				<Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-slate-300 flex items-center">
							<TrendingUp className="w-4 h-4 mr-2" />
							Total Portfolio
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold mb-1">
							{formatCurrency(totalBalance, 'USD')}
						</div>
						<p className="text-xs text-slate-400">Equivalent value</p>
					</CardContent>
				</Card>
			</div>

			{/* Transactions Table */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center">
								<Activity className="w-5 h-5 mr-2" />
								Transaction History
							</CardTitle>
							<CardDescription>
								View and track all your cross-border transfers
							</CardDescription>
						</div>
						<div className="flex items-center space-x-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
								<Input
									placeholder="Search transactions..."
									value={searchTerm}
									onChange={e => setSearchTerm(e.target.value)}
									className="pl-10 w-64"
								/>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{filteredTransactions.length === 0 ? (
						<div className="text-center py-12">
							<Wallet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-slate-900 mb-2">
								{searchTerm
									? 'No matching transactions'
									: 'No transactions yet'}
							</h3>
							<p className="text-slate-500 mb-6">
								{searchTerm
									? 'Try adjusting your search terms'
									: 'Start by sending your first international transfer'}
							</p>
							{!searchTerm && (
								<Link href="/fund-transfer">
									<Button>
										<ArrowUpRight className="w-4 h-4 mr-2" />
										Send Your First Transfer
									</Button>
								</Link>
							)}
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Type</TableHead>
										<TableHead>Details</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Transaction ID</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredTransactions.map(transaction => (
										<TableRow
											key={transaction.id}
											className="hover:bg-slate-50"
										>
											<TableCell>
												<div className="flex items-center">
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
															transaction.type === 'sent'
																? 'bg-red-100 text-red-600'
																: 'bg-green-100 text-green-600'
														}`}
													>
														{transaction.type === 'sent' ? (
															<ArrowUpRight className="w-4 h-4" />
														) : (
															<ArrowDownLeft className="w-4 h-4" />
														)}
													</div>
													<div>
														<p className="font-medium text-sm">
															{transaction.type === 'sent'
																? 'Sent'
																: 'Received'}
														</p>
														<p className="text-xs text-slate-500">
															{transaction.type === 'sent'
																? 'Outgoing'
																: 'Incoming'}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<p className="font-medium text-sm">
														{transaction.type === 'sent' ? (
															<>To: {transaction.receiver?.name}</>
														) : (
															<>From: {transaction.sender?.name}</>
														)}
													</p>
													<p className="text-xs text-slate-500">
														{transaction.type === 'sent'
															? transaction.receiver?.email
															: transaction.sender?.email}
													</p>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">
														{formatCurrency(
															transaction.amount,
															transaction.sourceCurrency,
														)}
													</p>
													{transaction.sourceCurrency !==
														transaction.targetCurrency && (
														<p className="text-xs text-slate-500">
															≈{' '}
															{formatCurrency(
																transaction.settledAmount,
																transaction.targetCurrency,
															)}
														</p>
													)}
												</div>
											</TableCell>
											<TableCell>
												{getStatusBadge(transaction.status)}
											</TableCell>
											<TableCell>
												<p className="text-sm">
													{formatDate(new Date(transaction.createdAt))}
												</p>
											</TableCell>
											<TableCell>
												<code className="text-xs bg-slate-100 px-2 py-1 rounded">
													{transaction.txId.substring(0, 12)}...
												</code>
											</TableCell>
											<TableCell>
												<Button variant="ghost" size="sm">
													<Eye className="w-4 h-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
