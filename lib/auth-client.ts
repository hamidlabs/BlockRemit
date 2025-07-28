import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'https://block-remit.vercel.app',
})

export const { signIn, signUp, useSession, signOut } = authClient
