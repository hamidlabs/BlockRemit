'use client'
import {
	ArrowRight,
	CheckCircle,
	DollarSign,
	Globe,
	Menu,
	Shield,
	TrendingUp,
	Wallet,
	X,
	Zap,
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	const features = [
		{
			icon: <Zap className="h-6 w-6" />,
			title: 'Lightning Fast',
			description: 'Process transactions in seconds, not days',
		},
		{
			icon: <DollarSign className="h-6 w-6" />,
			title: 'Lower Fees',
			description: '0.1% transaction fee vs traditional 3-8%',
		},
		{
			icon: <Shield className="h-6 w-6" />,
			title: 'Secure & Transparent',
			description: 'Cryptographic security with full audit trail',
		},
		{
			icon: <Globe className="h-6 w-6" />,
			title: 'Global Access',
			description: '24/7 availability across all time zones',
		},
	]

	const stats = [
		{ number: '99.9%', label: 'Uptime' },
		{ number: '3 sec', label: 'Avg Transaction Time' },
		{ number: '180+', label: 'Countries Supported' },
		{ number: '$2.1B+', label: 'Volume Processed' },
	]

	const comparison = [
		{
			feature: 'Transaction Speed',
			swift: '1-5 Business Days',
			blockchain: '3 Seconds',
			advantage: true,
		},
		{
			feature: 'Transaction Fees',
			swift: '3-8% + Hidden Fees',
			blockchain: '0.1% Fixed',
			advantage: true,
		},
		{
			feature: 'Transparency',
			swift: 'Limited Visibility',
			blockchain: 'Full Audit Trail',
			advantage: true,
		},
		{
			feature: 'Operating Hours',
			swift: 'Business Hours Only',
			blockchain: '24/7 Available',
			advantage: true,
		},
		{
			feature: 'Currency Support',
			swift: 'Limited Pairs',
			blockchain: 'Multi-Currency',
			advantage: true,
		},
	]

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			{/* Navigation */}
			<nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<Wallet className="h-8 w-8 text-blue-600" />
							<span className="ml-2 text-xl font-bold text-gray-900">
								BlockRemit
							</span>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-8">
							<a
								href="#features"
								className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
							>
								Features
							</a>
							<a
								href="#comparison"
								className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
							>
								Comparison
							</a>
							<a
								href="#about"
								className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
							>
								About
							</a>
							<div className="h-6 w-px bg-gray-300"></div>
							<a href="/login">
								<button className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
									Sign In
								</button>
							</a>
							<a href="/register">
								<button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
									Get Started
								</button>
							</a>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
							>
								{mobileMenuOpen ? (
									<X className="h-6 w-6" />
								) : (
									<Menu className="h-6 w-6" />
								)}
							</button>
						</div>
					</div>

					{/* Mobile Navigation */}
					{mobileMenuOpen && (
						<div className="md:hidden py-4 space-y-2 border-t border-gray-100">
							<a
								href="#features"
								className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
							>
								Features
							</a>
							<a
								href="#comparison"
								className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
							>
								Comparison
							</a>
							<a
								href="#about"
								className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
							>
								About
							</a>
							<div className="pt-2 space-y-2">
								<a href="/login" className="block">
									<button className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
										Sign In
									</button>
								</a>
								<a href="/register" className="block">
									<button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
										Get Started
									</button>
								</a>
							</div>
						</div>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
				<div className="absolute inset-0 opacity-20">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.3) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2px, transparent 0)`,
							backgroundSize: '100px 100px',
						}}
					></div>
				</div>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="text-white">
							<div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30 backdrop-blur-sm mb-4">
								🚀 The Future of Cross-Border Payments
							</div>
							<h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
								A Better Alternative to
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">
									{' '}
									SWIFT
								</span>
							</h1>
							<p className="text-xl text-blue-100 mb-8 leading-relaxed">
								Experience the future of international money transfers with
								blockchain technology. Faster, cheaper, and more transparent
								than traditional banking systems.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<a href="/register">
									<button className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 rounded-lg font-semibold shadow-lg transition-colors flex items-center">
										Start Free Transfer
										<ArrowRight className="ml-2 h-5 w-5" />
									</button>
								</a>
								<a href="#comparison">
									<button className="px-8 py-4 border border-white/50 text-white hover:bg-white/10 rounded-lg font-semibold backdrop-blur-sm transition-colors">
										Compare with SWIFT
									</button>
								</a>
							</div>
						</div>

						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur-3xl opacity-20"></div>
							<div className="relative bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl p-6">
								<div className="mb-4">
									<h3 className="flex items-center text-gray-900 font-semibold">
										<TrendingUp className="mr-2 h-5 w-5 text-green-500" />
										Live Transaction
									</h3>
								</div>
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 font-medium">From: USA</span>
										<span className="text-gray-600 font-medium">
											To: Bangladesh
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-2xl font-bold text-gray-900">
											$1,000 USD
										</span>
										<span className="text-2xl font-bold text-gray-900">
											৳109,500 BDT
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-green-600 font-semibold">
											Fee: $1.00 (0.1%)
										</span>
										<span className="text-green-600 font-semibold">
											Time: 3 seconds
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full shadow-sm animate-pulse"></div>
									</div>
									<div className="flex items-center text-green-600 font-semibold">
										<CheckCircle className="mr-2 h-5 w-5" />
										Transaction Completed
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-white border-b border-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
									{stat.number}
								</div>
								<div className="text-gray-600 font-medium">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
							Features
						</div>
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Why Choose Blockchain Remittance?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Revolutionary technology meets practical financial solutions for
							the modern world.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 bg-white rounded-lg p-6"
							>
								<div className="mb-4">
									<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
										{feature.icon}
									</div>
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Comparison Section */}
			<section id="comparison" className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
							Comparison
						</div>
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							SWIFT vs Blockchain Remittance
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							See how our blockchain-based solution outperforms traditional
							SWIFT transfers.
						</p>
					</div>

					<div className="overflow-hidden border border-gray-200 shadow-lg rounded-lg">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
											Feature
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
											SWIFT
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
											BlockRemit
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{comparison.map((item, index) => (
										<tr key={index} className="hover:bg-gray-50">
											<td className="px-6 py-4 text-sm font-medium text-gray-900">
												{item.feature}
											</td>
											<td className="px-6 py-4 text-sm text-gray-600">
												{item.swift}
											</td>
											<td className="px-6 py-4 text-sm">
												<div className="flex items-center">
													<span className="text-blue-600 font-semibold">
														{item.blockchain}
													</span>
													{item.advantage && (
														<CheckCircle className="ml-2 h-4 w-4 text-green-500" />
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
						Ready to Experience the Future?
					</h2>
					<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
						Join thousands of users who have already made the switch to faster,
						cheaper, and more transparent cross-border payments.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="/register">
							<button className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 rounded-lg font-semibold shadow-lg transition-colors flex items-center">
								Create Free Account
								<ArrowRight className="ml-2 h-5 w-5" />
							</button>
						</a>
						<a href="/login">
							<button className="px-8 py-4 border border-white/50 text-white hover:bg-white/10 rounded-lg font-semibold backdrop-blur-sm transition-colors">
								Sign In
							</button>
						</a>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center mb-4">
								<Wallet className="h-8 w-8 text-blue-400" />
								<span className="ml-2 text-xl font-bold">BlockRemit</span>
							</div>
							<p className="text-gray-400 leading-relaxed">
								The future of cross-border payments, powered by blockchain
								technology.
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4 text-white">Product</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="/features"
										className="hover:text-white transition-colors"
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="/pricing"
										className="hover:text-white transition-colors"
									>
										Pricing
									</a>
								</li>
								<li>
									<a
										href="/security"
										className="hover:text-white transition-colors"
									>
										Security
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4 text-white">Company</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="/about"
										className="hover:text-white transition-colors"
									>
										About
									</a>
								</li>
								<li>
									<a
										href="/careers"
										className="hover:text-white transition-colors"
									>
										Careers
									</a>
								</li>
								<li>
									<a
										href="/contact"
										className="hover:text-white transition-colors"
									>
										Contact
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4 text-white">Support</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="/help"
										className="hover:text-white transition-colors"
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="/docs"
										className="hover:text-white transition-colors"
									>
										Documentation
									</a>
								</li>
								<li>
									<a href="/api" className="hover:text-white transition-colors">
										API
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2024 BlockRemit. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
