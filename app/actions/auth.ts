'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateKeyPair, generateWalletAddress } from '@/lib/utils'

export async function registerUser(data: {
	name: string
	email: string
	password: string
	country: string
}) {
	try {
		// First, create user via BetterAuth
		const authResponse = await auth.api.signUpEmail({
			body: {
				email: data.email,
				password: data.password,
				name: data.name,
			},
			asResponse: true,
		})

		if (!authResponse.ok) {
			const errorData = await authResponse.json()
			return {
				success: false,
				error: errorData.message || 'Failed to create auth account',
			}
		}

		const authData = await authResponse.json()

		// Generate wallet and keys
		const walletAddress = generateWalletAddress()
		const { privateKey, publicKey } = generateKeyPair()

		// Create or update user in our database with wallet information
		const user = await prisma.user.update({
			where: { email: data.email },
			data: {
				name: data.name,
				country: data.country,
				walletAddress,
				publicKey,
				privateKey,
				balances: {
					create: [
						{ currency: 'USD', amount: Math.random() * 5000 + 5000 },
						{ currency: 'EUR', amount: Math.random() * 3000 + 1000 },
						{ currency: 'GBP', amount: Math.random() * 3000 + 1000 },
						{ currency: 'JPY', amount: Math.random() * 300000 + 100000 },
					],
				},
			},
			include: {
				balances: true,
			},
		})

		return { success: true, user, authData }
	} catch (error) {
		console.error('Error creating user:', error)
		return { success: false, error: 'Failed to create user account' }
	}
}

export async function signInUser(data: { email: string; password: string }) {
	try {
		const response = await auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password,
			},
			asResponse: true,
		})

		if (!response.ok) {
			const errorData = await response.json()
			return {
				success: false,
				error: errorData.message || 'Invalid credentials',
			}
		}

		const authData = await response.json()

		// Get or create user profile in our database
		const user = await prisma.user.findUnique({
			where: { email: data.email },
			include: { balances: true },
		})

		return { success: true, user, authData }
	} catch (error) {
		console.error('Error signing in user:', error)
		return { success: false, error: 'Sign in failed' }
	}
}

export async function getUserByEmail(email: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				balances: true,
			},
		})
		return user
	} catch (error) {
		console.error('Error fetching user:', error)
		return null
	}
}

// export async function ensureUserProfile(email: string, name?: string) {
//   try {
//     let user = await prisma.user.findUnique({
//       where: { email },
//       include: { balances: true }
//     })

//     if (!user) {
//       const walletAddress = generateWalletAddress()
//       const { privateKey, publicKey } = generateKeyPair()

//       user = await prisma.user.create({
//         data: {
//           email,
//           name: name || 'User',
//           country: 'Unknown',
//           walletAddress,
//           publicKey,
//           privateKey,
//           balances: {
//             create: [
//               { currency: 'USD', amount: Math.random() * 5000 + 5000 },
//               { currency: 'EUR', amount: Math.random() * 3000 + 1000 },
//               { currency: 'GBP', amount: Math.random() * 3000 + 1000 },
//               { currency: 'JPY', amount: Math.random() * 300000 + 100000 },
//             ]
//           }
//         },
//         include: { balances: true }
//       })
//     }

//     return { success: true, user }
//   } catch (error) {
//     console.error('Error ensuring user profile:', error)
//     return { success: false, error: 'Failed to create user profile' }
//   }
// }
