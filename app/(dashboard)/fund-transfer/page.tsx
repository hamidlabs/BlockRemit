'use client'

import {
	createTransaction,
	getAllUsers,
	getUserBalances,
} from '@/app/actions/transactions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import {
	AlertCircle,
	ArrowRight,
	CheckCircle,
	DollarSign,
	Eye,
	EyeOff,
	Search,
	Send,
	Shield,
	Users,
	Zap,
} from 'lucide-react'
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
	const [showWalletAddress, setShowWalletAddress] = useState(false)

	const [transferData, setTransferData] = useState({
		amount: '',
		sourceCurrency: 'USD',
		targetCurrency: 'USD',
	})

	const currencies = [
		{ code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
		{ code: 'EUR', name: 'Euro', flag: '🇪🇺' },
		{ code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
		{ code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
	]

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
	const transferAmount = parseFloat(transferData.amount) || 0
	const fee = transferAmount * 0.001 // 0.1% fee
	const totalCost = transferAmount + fee

	const canSubmit =
		selectedUser &&
		transferData.amount &&
		transferAmount > 0 &&
		selectedBalance &&
		totalCost <= selectedBalance.amount

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedUser || !canSubmit) return

		setSubmitting(true)
		setMessage(null)

		try {
			const result = await createTransaction({
				receiverEmail: selectedUser.email,
				amount: transferAmount,
				sourceCurrency: transferData.sourceCurrency,
				targetCurrency: transferData.targetCurrency,
			})

			if (result.success) {
				setMessage({
					type: 'success',
					text: 'Transaction initiated successfully! Funds will be transferred within seconds.',
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

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
	}

	const getCountryFlag = (country: string) => {
		const flags: Record<string, string> = {
			'United States': '🇺🇸',
			'United Kingdom': '🇬🇧',
			Canada: '🇨🇦',
			Australia: '🇦🇺',
			Germany: '🇩🇪',
			France: '🇫🇷',
			Japan: '🇯🇵',
			Singapore: '🇸🇬',
			India: '🇮🇳',
			Bangladesh: '🇧🇩',
		}
		return flags[country] || '🌍'
	}

	if (loading) {
		return (
			<div className="space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<Skeleton className="h-8 w-48 mb-2" />
						<Skeleton className="h-4 w-96" />
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-36" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Skeleton className="h-10 w-full" />
								<div className="space-y-2">
									{[...Array(3)].map((_, i) => (
										<Skeleton key={i} className="h-16 w-full" />
									))}
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-36" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[...Array(4)].map((_, i) => (
									<Skeleton key={i} className="h-10 w-full" />
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-slate-900">Fund Transfer</h1>
					<p className="text-slate-600 mt-1">
						Send money instantly across borders with blockchain technology
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Badge variant="secondary" className="bg-green-100 text-green-800">
						<Zap className="w-3 h-3 mr-1" />3 Second Transfers
					</Badge>
					<Badge variant="secondary" className="bg-blue-100 text-blue-800">
						<Shield className="w-3 h-3 mr-1" />
						0.1% Fee
					</Badge>
				</div>
			</div>

			{/* Balance Overview */}
			<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
				<CardHeader>
					<CardTitle className="flex items-center text-blue-900">
						<DollarSign className="w-5 h-5 mr-2" />
						Available Balances
					</CardTitle>
					<CardDescription className="text-blue-700">
						Choose your source currency for the transfer
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{balances.map(balance => {
							const currency = currencies.find(c => c.code === balance.currency)
							return (
								<div
									key={balance.currency}
									className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
										transferData.sourceCurrency === balance.currency
											? 'border-blue-500 bg-blue-50'
											: 'border-slate-200 bg-white hover:border-slate-300'
									}`}
									onClick={() =>
										setTransferData({
											...transferData,
											sourceCurrency: balance.currency,
										})
									}
								>
									<div className="flex items-center justify-between mb-2">
										<span className="text-2xl">{currency?.flag}</span>
										<span className="text-sm font-medium text-slate-600">
											{balance.currency}
										</span>
									</div>
									<div className="text-lg font-bold text-slate-900">
										{formatCurrency(balance.amount, balance.currency)}
									</div>
									<div className="text-xs text-slate-500">Available</div>
								</div>
							)
						})}
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Recipient Selection */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Users className="w-5 h-5 mr-2" />
							Select Recipient
						</CardTitle>
						<CardDescription>
							Choose who you want to send money to
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Search */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
							<Input
								type="text"
								placeholder="Search by name, email, or country..."
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>

						{/* Selected User Display */}
						{selectedUser && (
							<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<Avatar className="h-10 w-10">
											<AvatarFallback className="bg-green-500 text-white">
												{getInitials(selectedUser.name)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium text-green-900">
												{selectedUser.name}
											</p>
											<p className="text-sm text-green-700">
												{selectedUser.email}
											</p>
											<p className="text-xs text-green-600 flex items-center">
												<span className="mr-1">
													{getCountryFlag(selectedUser.country)}
												</span>
												{selectedUser.country}
											</p>
										</div>
									</div>
									<CheckCircle className="w-6 h-6 text-green-500" />
								</div>
								<div className="mt-3 pt-3 border-t border-green-200">
									<div className="flex items-center justify-between text-xs">
										<span className="text-green-700">Wallet Address:</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowWalletAddress(!showWalletAddress)}
											className="h-6 px-2 text-green-700"
										>
											{showWalletAddress ? (
												<EyeOff className="w-3 h-3" />
											) : (
												<Eye className="w-3 h-3" />
											)}
										</Button>
									</div>
									<code className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded mt-1 block">
										{showWalletAddress
											? selectedUser.walletAddress
											: `${selectedUser.walletAddress.substring(
													0,
													8,
											  )}...${selectedUser.walletAddress.substring(-8)}`}
									</code>
								</div>
							</div>
						)}

						{/* User List */}
						<div className="max-h-64 overflow-y-auto space-y-2">
							{filteredUsers.map(user => (
								<div
									key={user.id}
									className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
										selectedUser?.id === user.id
											? 'border-green-500 bg-green-50'
											: 'border-slate-200 hover:border-slate-300'
									}`}
									onClick={() => setSelectedUser(user)}
								>
									<div className="flex items-center space-x-3">
										<Avatar className="h-8 w-8">
											<AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
												{getInitials(user.name)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm text-slate-900 truncate">
												{user.name}
											</p>
											<p className="text-xs text-slate-500 truncate">
												{user.email}
											</p>
											<p className="text-xs text-slate-400 flex items-center">
												<span className="mr-1">
													{getCountryFlag(user.country)}
												</span>
												{user.country}
											</p>
										</div>
										{selectedUser?.id === user.id && (
											<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
										)}
									</div>
								</div>
							))}
						</div>

						{filteredUsers.length === 0 && searchTerm && (
							<div className="text-center py-8">
								<Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
								<p className="text-slate-600">
									No users found matching &quot;{searchTerm}&quot;
								</p>
								<p className="text-sm text-slate-500">
									Try adjusting your search terms
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Transfer Form */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Send className="w-5 h-5 mr-2" />
							Transfer Details
						</CardTitle>
						<CardDescription>
							Enter the amount and currency details
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Amount Input */}
							<div className="space-y-2">
								<Label htmlFor="amount" className="text-sm font-medium">
									Amount to Send
								</Label>
								<div className="relative">
									<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
									<Input
										id="amount"
										type="number"
										step="0.01"
										min="0.01"
										placeholder="0.00"
										value={transferData.amount}
										onChange={e =>
											setTransferData({
												...transferData,
												amount: e.target.value,
											})
										}
										className="pl-10 text-lg h-12"
									/>
								</div>
								{selectedBalance && transferAmount > 0 && (
									<div className="flex justify-between text-xs">
										<span className="text-slate-500">
											Available:{' '}
											{formatCurrency(
												selectedBalance.amount,
												transferData.sourceCurrency,
											)}
										</span>
										{totalCost > selectedBalance.amount && (
											<span className="text-red-500 font-medium">
												Insufficient funds
											</span>
										)}
									</div>
								)}
							</div>

							{/* Currency Selection */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium">From Currency</Label>
									<Select
										value={transferData.sourceCurrency}
										onValueChange={value =>
											setTransferData({
												...transferData,
												sourceCurrency: value,
											})
										}
									>
										<SelectTrigger className="h-12">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{currencies.map(currency => (
												<SelectItem key={currency.code} value={currency.code}>
													<div className="flex items-center">
														<span className="mr-2">{currency.flag}</span>
														<span>{currency.code}</span>
														<span className="ml-2 text-slate-500 text-xs">
															{currency.name}
														</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label className="text-sm font-medium">To Currency</Label>
									<Select
										value={transferData.targetCurrency}
										onValueChange={value =>
											setTransferData({
												...transferData,
												targetCurrency: value,
											})
										}
									>
										<SelectTrigger className="h-12">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{currencies.map(currency => (
												<SelectItem key={currency.code} value={currency.code}>
													<div className="flex items-center">
														<span className="mr-2">{currency.flag}</span>
														<span>{currency.code}</span>
														<span className="ml-2 text-slate-500 text-xs">
															{currency.name}
														</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Transfer Summary */}
							{selectedUser && transferAmount > 0 && (
								<div className="p-4 bg-slate-50 rounded-lg space-y-3">
									<h4 className="font-medium text-slate-900 flex items-center">
										<CheckCircle className="w-4 h-4 mr-2 text-green-500" />
										Transfer Summary
									</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-slate-600">Recipient:</span>
											<span className="font-medium">{selectedUser.name}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-600">Amount:</span>
											<span className="font-medium">
												{formatCurrency(
													transferAmount,
													transferData.sourceCurrency,
												)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-600">Fee (0.1%):</span>
											<span className="font-medium">
												{formatCurrency(fee, transferData.sourceCurrency)}
											</span>
										</div>
										<Separator />
										<div className="flex justify-between font-medium">
											<span>Total Cost:</span>
											<span>
												{formatCurrency(totalCost, transferData.sourceCurrency)}
											</span>
										</div>
										{transferData.sourceCurrency !==
											transferData.targetCurrency && (
											<div className="flex justify-between text-green-600">
												<span>Recipient Receives:</span>
												<span className="font-medium">
													≈{' '}
													{formatCurrency(
														transferAmount * 0.85,
														transferData.targetCurrency,
													)}{' '}
													{/* Simplified rate */}
												</span>
											</div>
										)}
									</div>
								</div>
							)}

							{/* Success/Error Messages */}
							{message && (
								<Alert
									variant={
										message.type === 'success' ? 'default' : 'destructive'
									}
								>
									{message.type === 'success' ? (
										<CheckCircle className="h-4 w-4" />
									) : (
										<AlertCircle className="h-4 w-4" />
									)}
									<AlertDescription>{message.text}</AlertDescription>
								</Alert>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={!canSubmit || submitting}
								className="w-full h-12 text-base font-medium"
								size="lg"
							>
								{submitting ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Processing Transfer...
									</>
								) : (
									<>
										<Send className="w-4 h-4 mr-2" />
										Send{' '}
										{transferAmount > 0
											? formatCurrency(
													transferAmount,
													transferData.sourceCurrency,
											  )
											: 'Money'}
										<ArrowRight className="w-4 h-4 ml-2" />
									</>
								)}
							</Button>

							{/* Security Notice */}
							<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
								<div className="flex items-start space-x-2">
									<Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
									<div className="text-xs text-blue-800">
										<p className="font-medium mb-1">Secure & Transparent</p>
										<p>
											All transactions are secured with blockchain technology
											and will be completed within 3 seconds. Transaction
											details will be permanently recorded on the blockchain for
											full transparency.
										</p>
									</div>
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
