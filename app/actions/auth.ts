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
		console.log('Starting registration for:', data.email)

		// First check if user already exists in our database
		let user = await prisma.user.findUnique({
			where: { email: data.email },
			include: { balances: true },
		})

		let authData = null

		if (!user) {
			// User doesn't exist, create via BetterAuth
			console.log('User not found, creating new user...')

			const authResponse = await auth.api.signUpEmail({
				body: {
					email: data.email,
					password: data.password,
					name: data.name,
				},
				asResponse: true,
			})

			console.log('Auth response:', authResponse)

			if (!authResponse.ok) {
				const errorData = await authResponse.json()
				console.log('Auth failed:', errorData)
				return {
					success: false,
					error: errorData.message || 'Failed to create auth account',
				}
			}

			authData = await authResponse.json()
			console.log('Auth response:', authData)
			console.log('Auth successful, user created')

			// Wait for user to be available in database
			for (let i = 0; i < 10; i++) {
				user = await prisma.user.findUnique({
					where: { email: data.email },
					include: { balances: true },
				})
				if (user) {
					console.log('Found user:', user.id)
					break
				}
				console.log(`User not found, attempt ${i + 1}/10, waiting...`)
				await new Promise(resolve => setTimeout(resolve, 200))
			}

			if (!user) {
				console.log('User not found after 10 attempts')
				return {
					success: false,
					error: 'User was created but not found in database',
				}
			}
		} else {
			console.log('User already exists:', user.id)
		}

		// Generate wallet and keys if not already set
		const walletAddress = user.walletAddress || generateWalletAddress()
		const { privateKey, publicKey } =
			user.publicKey && user.privateKey
				? { privateKey: user.privateKey, publicKey: user.publicKey }
				: generateKeyPair()

		console.log('Using wallet and keys')

		// Update the user with additional fields
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: {
				country: data.country,
				walletAddress,
				publicKey,
				privateKey,
			},
		})
		console.log('Updated user with wallet info')

		// Create balances if they don't exist
		if (!user.balances || user.balances.length === 0) {
			console.log('Creating balances for user:', updatedUser.id)

			const balancesData = [
				{ userId: updatedUser.id, currency: 'USD', amount: 7500.0 },
				{ userId: updatedUser.id, currency: 'EUR', amount: 2500.0 },
				{ userId: updatedUser.id, currency: 'GBP', amount: 2000.0 },
				{ userId: updatedUser.id, currency: 'JPY', amount: 250000.0 },
			]

			await prisma.balance.createMany({
				data: balancesData,
			})
			console.log('Balances created successfully')
		} else {
			console.log('User already has balances:', user.balances.length)
		}

		// Fetch the complete user with balances
		const userWithBalances = await prisma.user.findUnique({
			where: { id: updatedUser.id },
			include: {
				balances: true,
			},
		})

		console.log('Final user with balances:', {
			id: userWithBalances?.id,
			email: userWithBalances?.email,
			balanceCount: userWithBalances?.balances?.length,
		})

		return { success: true, user: userWithBalances, authData }
	} catch (error) {
		console.error('Error in registerUser:', error)
		return { success: false, error: `Registration failed` }
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
