'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { TransactionStatus } from '@/lib/generated/prisma'
import { revalidatePath } from 'next/cache'

export async function getUserTransactions() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		})

		if (!session) {
			return { success: false, error: 'Not authenticated' }
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				sentTransactions: {
					include: {
						receiver: true,
					},
					orderBy: { createdAt: 'desc' },
				},
				receivedTransactions: {
					include: {
						sender: true,
					},
					orderBy: { createdAt: 'desc' },
				},
			},
		})

		if (!user) {
			return { success: false, error: 'User not found' }
		}

		// Combine and sort all transactions
		const allTransactions = [
			...user.sentTransactions.map(tx => ({ ...tx, type: 'sent' as const })),
			...user.receivedTransactions.map(tx => ({
				...tx,
				type: 'received' as const,
			})),
		].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)

		return { success: true, transactions: allTransactions }
	} catch (error) {
		console.error('Error fetching transactions:', error)
		return { success: false, error: 'Failed to fetch transactions' }
	}
}

export async function getUserBalances() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		})

		if (!session) {
			return { success: false, error: 'Not authenticated' }
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				balances: true,
			},
		})

		if (!user) {
			return { success: false, error: 'User not found' }
		}

		return { success: true, balances: user.balances }
	} catch (error) {
		console.error('Error fetching balances:', error)
		return { success: false, error: 'Failed to fetch balances' }
	}
}

export async function createTransaction(data: {
	receiverEmail: string
	amount: number
	sourceCurrency: string
	targetCurrency: string
}) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		})

		if (!session) {
			return { success: false, error: 'Not authenticated' }
		}

		// Get sender
		const sender = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: { balances: true },
		})

		if (!sender) {
			return { success: false, error: 'Sender not found' }
		}

		// Get receiver
		const receiver = await prisma.user.findUnique({
			where: { email: data.receiverEmail },
			include: { balances: true },
		})

		if (!receiver) {
			return { success: false, error: 'Receiver not found' }
		}

		// Check sender balance
		const senderBalance = sender.balances.find(
			b => b.currency === data.sourceCurrency,
		)
		if (!senderBalance || senderBalance.amount < data.amount) {
			return { success: false, error: 'Insufficient balance' }
		}

		// Generate transaction ID
		const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

		// Calculate exchange rate (simplified)
		const exchangeRates: Record<string, Record<string, number>> = {
			USD: { EUR: 0.85, GBP: 0.75, JPY: 110, USD: 1 },
			EUR: { USD: 1.18, GBP: 0.88, JPY: 130, EUR: 1 },
			GBP: { USD: 1.33, EUR: 1.14, JPY: 150, GBP: 1 },
			JPY: { USD: 0.009, EUR: 0.0077, GBP: 0.0067, JPY: 1 },
		}

		const exchangeRate =
			exchangeRates[data.sourceCurrency]?.[data.targetCurrency] || 1
		const settledAmount = data.amount * exchangeRate
		const fee = data.amount * 0.001 // 0.1% fee
		const gasUsed = 10.0

		// Create transaction in database
		const transaction = await prisma.transaction.create({
			data: {
				txId,
				senderId: sender.id,
				receiverId: receiver.id,
				amount: data.amount,
				sourceCurrency: data.sourceCurrency,
				targetCurrency: data.targetCurrency,
				status: TransactionStatus.INITIATED,
				exchangeRate,
				settledAmount,
				fee,
				gasUsed,
				signature: `sig_${Math.random().toString(36).substr(2, 20)}`,
			},
		})

		// Simulate blockchain processing
		setTimeout(async () => {
			try {
				// Update balances
				await prisma.$transaction(async tx => {
					// Deduct from sender
					await tx.balance.update({
						where: {
							userId_currency: {
								userId: sender.id,
								currency: data.sourceCurrency,
							},
						},
						data: {
							amount: {
								decrement: data.amount + fee,
							},
						},
					})

					// Add to receiver (create balance if doesn't exist)
					await tx.balance.upsert({
						where: {
							userId_currency: {
								userId: receiver.id,
								currency: data.targetCurrency,
							},
						},
						update: {
							amount: {
								increment: settledAmount,
							},
						},
						create: {
							userId: receiver.id,
							currency: data.targetCurrency,
							amount: settledAmount,
						},
					})

					// Update transaction status
					await tx.transaction.update({
						where: { id: transaction.id },
						data: {
							status: TransactionStatus.SETTLED,
							blockHeight: Math.floor(Math.random() * 1000000),
						},
					})
				})
			} catch (error) {
				console.error('Error processing transaction:', error)
				// Update transaction status to failed
				await prisma.transaction.update({
					where: { id: transaction.id },
					data: { status: TransactionStatus.FAILED },
				})
			}
		}, 3000) // 3 second delay to simulate blockchain processing

		revalidatePath('/transactions')
		revalidatePath('/fund-transfer')

		return { success: true, transaction }
	} catch (error) {
		console.error('Error creating transaction:', error)
		return { success: false, error: 'Failed to create transaction' }
	}
}

export async function getAllUsers() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		})

		if (!session) {
			return { success: false, error: 'Not authenticated' }
		}

		const users = await prisma.user.findMany({
			where: {
				email: {
					not: session.user.email, // Exclude current user
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
				country: true,
				walletAddress: true,
			},
			orderBy: { name: 'asc' },
		})

		return { success: true, users }
	} catch (error) {
		console.error('Error fetching users:', error)
		return { success: false, error: 'Failed to fetch users' }
	}
}
