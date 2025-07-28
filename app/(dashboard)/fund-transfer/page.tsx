'use client'

import {
	createTransaction,
	getAllUsers,
	getUserBalances,
} from '@/app/actions/transactions'
import { formatCurrency } from '@/lib/utils'
import { AlertCircle, CheckCircle, Loader2, Search, Send } from 'lucide-react'
import { useEffect, useState } from 'react'

type User = {
	id: string
	name: string
	email: string
	country: string
	walletAddress: string
}

type Balance = {
	currency: string
	amount: number
}

export default function FundTransferPage() {
	const [users, setUsers] = useState<User[]>([])
	const [balances, setBalances] = useState<Balance[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [message, setMessage] = useState<{
		type: 'success' | 'error'
		text: string
	} | null>(null)

	const [transferData, setTransferData] = useState({
		amount: '',
		sourceCurrency: 'USD',
		targetCurrency: 'USD',
	})

	const currencies = ['USD', 'EUR', 'GBP', 'JPY']

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersResult, balancesResult] = await Promise.all([
					getAllUsers(),
					getUserBalances(),
				])

				if (usersResult.success) {
					setUsers(usersResult.users || [])
				}

				if (balancesResult.success) {
					setBalances(balancesResult.balances || [])
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const filteredUsers = users.filter(
		user =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.country.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	const selectedBalance = balances.find(
		b => b.currency === transferData.sourceCurrency,
	)
	const canSubmit =
		selectedUser &&
		transferData.amount &&
		parseFloat(transferData.amount) > 0 &&
		selectedBalance &&
		parseFloat(transferData.amount) <= selectedBalance.amount

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedUser || !canSubmit) return

		setSubmitting(true)
		setMessage(null)

		try {
			const result = await createTransaction({
				receiverEmail: selectedUser.email,
				amount: parseFloat(transferData.amount),
				sourceCurrency: transferData.sourceCurrency,
				targetCurrency: transferData.targetCurrency,
			})

			if (result.success) {
				setMessage({
					type: 'success',
					text: 'Transaction initiated successfully!',
				})
				setTransferData({
					amount: '',
					sourceCurrency: 'USD',
					targetCurrency: 'USD',
				})
				setSelectedUser(null)
				setSearchTerm('')

				// Refresh balances
				const balancesResult = await getUserBalances()
				if (balancesResult.success) {
					setBalances(balancesResult.balances || [])
				}
			} else {
				setMessage({
					type: 'error',
					text: result.error || 'Transaction failed',
				})
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'An error occurred' })
		} finally {
			setSubmitting(false)
		}
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
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-900 mb-8">Fund Transfer</h1>

				{/* Balance Overview */}
				<div className="bg-white shadow rounded-lg p-6 mb-8">
					<h2 className="text-lg font-medium text-gray-900 mb-4">
						Available Balances
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{balances.map(balance => (
							<div
								key={balance.currency}
								className="text-center p-3 border rounded-lg"
							>
								<div className="font-medium text-gray-900">
									{balance.currency}
								</div>
								<div className="text-lg font-bold text-blue-600">
									{formatCurrency(balance.amount, balance.currency)}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* User Selection */}
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-lg font-medium text-gray-900 mb-4">
							Select Recipient
						</h2>

						{/* Search */}
						<div className="relative mb-4">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Search by name, email, or country..."
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>

						{/* User List */}
						<div className="max-h-64 overflow-y-auto space-y-2">
							{filteredUsers.map(user => (
								<div
									key={user.id}
									className={`p-3 border rounded-lg cursor-pointer transition-colors ${
										selectedUser?.id === user.id
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
									}`}
									onClick={() => setSelectedUser(user)}
								>
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium text-gray-900">
												{user.name}
											</div>
											<div className="text-sm text-gray-500">{user.email}</div>
											<div className="text-sm text-gray-400">
												{user.country}
											</div>
										</div>
										{selectedUser?.id === user.id && (
											<CheckCircle className="w-5 h-5 text-blue-500" />
										)}
									</div>
								</div>
							))}
						</div>

						{filteredUsers.length === 0 && searchTerm && (
							<div className="text-center py-8 text-gray-500">
								No users found matching &quot;{searchTerm}&quot;
							</div>
						)}
					</div>

					{/* Transfer Form */}
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-lg font-medium text-gray-900 mb-4">
							Transfer Details
						</h2>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Amount
								</label>
								<input
									type="number"
									step="0.01"
									min="0.01"
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									value={transferData.amount}
									onChange={e =>
										setTransferData({ ...transferData, amount: e.target.value })
									}
									placeholder="0.00"
								/>
								{selectedBalance && (
									<p className="mt-1 text-sm text-gray-500">
										Available:{' '}
										{formatCurrency(
											selectedBalance.amount,
											transferData.sourceCurrency,
										)}
									</p>
								)}
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										From Currency
									</label>
									<select
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										value={transferData.sourceCurrency}
										onChange={e =>
											setTransferData({
												...transferData,
												sourceCurrency: e.target.value,
											})
										}
									>
										{currencies.map(currency => (
											<option key={currency} value={currency}>
												{currency}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										To Currency
									</label>
									<select
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										value={transferData.targetCurrency}
										onChange={e =>
											setTransferData({
												...transferData,
												targetCurrency: e.target.value,
											})
										}
									>
										{currencies.map(currency => (
											<option key={currency} value={currency}>
												{currency}
											</option>
										))}
									</select>
								</div>
							</div>

							{selectedUser && (
								<div className="p-3 bg-gray-50 rounded-lg">
									<h3 className="font-medium text-gray-900">
										Transfer Summary
									</h3>
									<p className="text-sm text-gray-600">
										To: {selectedUser.name} ({selectedUser.email})
									</p>
									<p className="text-sm text-gray-600">
										Amount: {transferData.amount} {transferData.sourceCurrency}
										{transferData.sourceCurrency !==
											transferData.targetCurrency &&
											` → ${transferData.targetCurrency}`}
									</p>
								</div>
							)}

							{message && (
								<div
									className={`p-3 rounded-lg flex items-center ${
										message.type === 'success'
											? 'bg-green-50 text-green-700'
											: 'bg-red-50 text-red-700'
									}`}
								>
									{message.type === 'success' ? (
										<CheckCircle className="w-5 h-5 mr-2" />
									) : (
										<AlertCircle className="w-5 h-5 mr-2" />
									)}
									{message.text}
								</div>
							)}

							<button
								type="submit"
								disabled={!canSubmit || submitting}
								className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{submitting ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<Send className="w-4 h-4 mr-2" />
										Send Transfer
									</>
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
