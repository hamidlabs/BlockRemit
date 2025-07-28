'use client'

import {
	getUserBalances,
	getUserTransactions,
} from '@/app/actions/transactions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowDownLeft, ArrowUpRight, Loader2, RefreshCw } from 'lucide-react'
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

		// Set up polling for real-time updates
		const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds

		return () => clearInterval(interval)
	}, [])

	const handleRefresh = () => {
		setRefreshing(true)
		fetchData()
	}

	const getStatusBadge = (status: string) => {
		const colors = {
			INITIATED: 'bg-yellow-100 text-yellow-800',
			VALIDATED: 'bg-blue-100 text-blue-800',
			EXECUTED: 'bg-purple-100 text-purple-800',
			SETTLED: 'bg-green-100 text-green-800',
			FAILED: 'bg-red-100 text-red-800',
		}

		return (
			<span
				className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
					colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
				}`}
			>
				{status}
			</span>
		)
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
			</div>
		)
	}

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			{/* Balance Cards */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold text-gray-900">Your Balances</h1>
					<button
						onClick={handleRefresh}
						disabled={refreshing}
						className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
					>
						<RefreshCw
							className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
						/>
						Refresh
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{balances.map(balance => (
						<div
							key={balance.currency}
							className="bg-white overflow-hidden shadow rounded-lg"
						>
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
											<span className="text-white text-sm font-medium">
												{balance.currency}
											</span>
										</div>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												{balance.currency} Balance
											</dt>
											<dd className="text-lg font-medium text-gray-900">
												{formatCurrency(balance.amount, balance.currency)}
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Transactions Table */}
			<div className="bg-white shadow rounded-lg">
				<div className="px-4 py-5 sm:p-6">
					<h2 className="text-lg font-medium text-gray-900 mb-4">
						Transaction History
					</h2>
					{transactions.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-500">No transactions yet</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Type
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Transaction
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Amount
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Date
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											TX ID
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{transactions.map(transaction => (
										<tr key={transaction.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													{transaction.type === 'sent' ? (
														<ArrowUpRight className="w-5 h-5 text-red-500" />
													) : (
														<ArrowDownLeft className="w-5 h-5 text-green-500" />
													)}
													<span
														className={`ml-2 text-sm font-medium ${
															transaction.type === 'sent'
																? 'text-red-600'
																: 'text-green-600'
														}`}
													>
														{transaction.type === 'sent' ? 'Sent' : 'Received'}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{transaction.type === 'sent' ? (
														<>To: {transaction.receiver?.name}</>
													) : (
														<>From: {transaction.sender?.name}</>
													)}
												</div>
												<div className="text-sm text-gray-500">
													{transaction.type === 'sent'
														? transaction.receiver?.email
														: transaction.sender?.email}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{formatCurrency(
														transaction.amount,
														transaction.sourceCurrency,
													)}
												</div>
												{transaction.sourceCurrency !==
													transaction.targetCurrency && (
													<div className="text-sm text-gray-500">
														≈{' '}
														{formatCurrency(
															transaction.settledAmount,
															transaction.targetCurrency,
														)}
													</div>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{getStatusBadge(transaction.status)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{formatDate(new Date(transaction.createdAt))}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
												{transaction.txId.substring(0, 16)}...
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
