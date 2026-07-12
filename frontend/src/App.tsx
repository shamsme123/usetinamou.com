import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/Navbar'
import { LandingPage } from '@/pages/LandingPage'
import { OrderParserPage } from '@/pages/OrderParserPage'
import { ProductCsvPage } from '@/pages/ProductCsvPage'
import { TermsPage } from '@/pages/TermsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { RefundPage } from '@/pages/RefundPage'
import { ContactPage } from '@/pages/ContactPage'
import { PricingPage } from '@/pages/PricingPage'

export default function App() {
  const [email, setEmail] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)

  // Sync state from localStorage on load & state updates
  useEffect(() => {
    const syncUser = () => {
      const storedEmail = localStorage.getItem('ut_email')
      const storedRemaining = localStorage.getItem('ut_remaining')
      setEmail(storedEmail)
      setRemaining(storedRemaining ? Number(storedRemaining) : null)
    }

    syncUser()
    window.addEventListener('storage', syncUser)
    return () => window.removeEventListener('storage', syncUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ut_email')
    localStorage.removeItem('ut_name')
    localStorage.removeItem('ut_remaining')
    setEmail(null)
    setRemaining(null)
    window.location.href = '/'
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
        {/* Navigation Header */}
        <Navbar
          remainingGenerations={remaining}
          email={email}
          onLogout={handleLogout}
        />

        {/* Main Content Router */}
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/order-parser" element={<OrderParserPage />} />
            <Route path="/product-csv" element={<ProductCsvPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </main>

        {/* Global Footer (Razorpay / compliance check) */}
        <footer className="border-t border-border py-12 glass mt-auto bg-background/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪶</span>
                <span className="font-heading font-bold text-sm tracking-tight">UseTinamou.com</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm">
                Built by Shams Mahboob Islam. Turn messy business notes into importable structured spreadsheets instantly.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground font-medium">
              <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/refund" className="hover:text-primary transition-colors">Refund & Cancellation</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
            </div>

            <p className="text-right text-[10px] text-muted-foreground/60 md:max-w-xs leading-relaxed">
              © 2026 UseTinamou / Shams Mahboob Islam. All Rights Reserved. Fully proprietary.
            </p>
          </div>
        </footer>

        {/* Toast alerts */}
        <Toaster theme="dark" closeButton />
      </div>
    </Router>
  )
}
