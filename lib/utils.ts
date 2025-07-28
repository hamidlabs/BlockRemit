import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string) {
	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: currency === 'JPY' ? 0 : 6,
		}).format(amount)
	} catch (error) {
		// Fallback for invalid currency codes
		return `${amount.toFixed(2)} ${currency}`
	}
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	}).format(date)
}

export function formatDateRelative(date: Date) {
	const now = new Date()
	const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

	if (diffInHours < 1) {
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60),
		)
		return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
	} else if (diffInHours < 24) {
		const hours = Math.floor(diffInHours)
		return `${hours} hour${hours !== 1 ? 's' : ''} ago`
	} else {
		return formatDate(date)
	}
}

export function generateWalletAddress(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < 40; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

export function generateKeyPair() {
	const privateKey = Array.from({ length: 64 }, () =>
		Math.floor(Math.random() * 16).toString(16),
	).join('')

	const publicKey = Array.from({ length: 128 }, () =>
		Math.floor(Math.random() * 16).toString(16),
	).join('')

	return { privateKey, publicKey }
}

export function truncateAddress(address: string, chars: number = 6): string {
	if (address.length <= chars * 2) return address
	return `${address.substring(0, chars)}...${address.substring(
		address.length - chars,
	)}`
}

export function getExchangeRate(from: string, to: string): number {
	const rates: Record<string, Record<string, number>> = {
		USD: { EUR: 0.85, GBP: 0.75, JPY: 110, USD: 1 },
		EUR: { USD: 1.18, GBP: 0.88, JPY: 130, EUR: 1 },
		GBP: { USD: 1.33, EUR: 1.14, JPY: 150, GBP: 1 },
		JPY: { USD: 0.009, EUR: 0.0077, GBP: 0.0067, JPY: 1 },
	}

	return rates[from]?.[to] || 1
}
