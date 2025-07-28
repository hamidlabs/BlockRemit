import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs)
}

export function formatCurrency(amount: number, currency: string) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 6,
	}).format(amount)
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

export function generateWalletAddress(): string {
	// Simple wallet address generation (use proper crypto in production)
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < 40; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

export function generateKeyPair() {
	// Simple key generation (use proper crypto in production)
	const privateKey = Array.from({ length: 64 }, () =>
		Math.floor(Math.random() * 16).toString(16),
	).join('')

	const publicKey = Array.from({ length: 128 }, () =>
		Math.floor(Math.random() * 16).toString(16),
	).join('')

	return { privateKey, publicKey }
}
