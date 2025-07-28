import { Wallet } from 'lucide-react'

function Footer() {
	return (
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
								<a href="/about" className="hover:text-white transition-colors">
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
								<a href="/help" className="hover:text-white transition-colors">
									Help Center
								</a>
							</li>
							<li>
								<a href="/docs" className="hover:text-white transition-colors">
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
	)
}

export default Footer
