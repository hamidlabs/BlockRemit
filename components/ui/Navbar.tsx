'use client'
import { Menu, Wallet, X } from 'lucide-react'
import { useState } from 'react'

function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
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
	)
}

export default Navbar
