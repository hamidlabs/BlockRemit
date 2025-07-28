import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			{children}
			<Footer />
		</div>
	)
}
