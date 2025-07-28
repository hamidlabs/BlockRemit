import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	reactStrictMode: true,
}

export default nextConfig
