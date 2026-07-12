import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { analytics } from '@/lib/analytics'

export function PricingPage() {
  useEffect(() => {
    analytics.track('visitor_landed', { page: 'pricing' })
  }, [])

  const handleSimulatePayment = (planName: string, link: string) => {
    analytics.track('payment_clicked', { plan: planName.toLowerCase().replace(/ /g, '_') })
    if (link && !link.startsWith('#')) {
      window.open(link, '_blank')
    }
  }

  return (
    <div className="flex-1 w-full bg-background hero-grid pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center space-y-8 animate-fade-up">
        {/* Header Title */}
        <div className="space-y-3">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            API Quotas & Usage Tiers
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Get started for free, then request sachet quota extensions as your business operation expands.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 pt-8 max-w-5xl mx-auto text-left">
          
          {/* Sandbox Tier */}
          <Card className="glass flex flex-col justify-between p-6 space-y-6 border-border">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full uppercase">
                  Free Sandbox
                </span>
                <CardTitle className="font-heading text-2xl font-bold text-foreground mt-2">Sandbox Tier</CardTitle>
                <CardDescription className="text-xs mt-1">Perfect for initial evaluations</CardDescription>
              </div>
              <div>
                <span className="text-4xl font-extrabold text-foreground">₹0</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">15 Credits (~75-150 rows estimated output)</p>
              <ul className="space-y-2 text-xs text-foreground/80 border-t border-border pt-4">
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Order Parser Sandbox</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> CSV Formatter Sandbox</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> 20 rows max per upload</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Basic email help</li>
              </ul>
            </div>
            <Link to="/order-parser" className="block pt-4">
              <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-semibold">
                Start Sandbox Session
              </Button>
            </Link>
          </Card>

          {/* Sachet Pack */}
          <Card className="glass flex flex-col justify-between p-6 space-y-6 border-border">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase border border-accent/15">
                  Popular
                </span>
                <CardTitle className="font-heading text-2xl font-bold text-foreground mt-2">Sachet Pack</CardTitle>
                <CardDescription className="text-xs mt-1">Great for small business batches</CardDescription>
              </div>
              <div>
                <span className="text-4xl font-extrabold text-foreground">₹99</span>
                <span className="text-muted-foreground text-xs font-medium ml-2">/ $1.49 USD</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">50 Credits (~250-500 rows estimated output)</p>
              <ul className="space-y-2 text-xs text-foreground/80 border-t border-border pt-4">
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> 50 generations included</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Unlimited CSV formatting rows</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Custom Amazon/Shopify mappings</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> 24-hr support SLA</li>
              </ul>
            </div>
            <div className="space-y-2 pt-4">
              <Button
                onClick={() => handleSimulatePayment('Sachet_Razorpay', '#sachet-razorpay')}
                className="w-full bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-semibold"
              >
                Simulate INR (₹99)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSimulatePayment('Sachet_PayPal', '#sachet-paypal')}
                className="w-full border-border text-xs text-muted-foreground"
              >
                Simulate USD ($1.49)
              </Button>
            </div>
          </Card>

          {/* Bulk Pack */}
          <Card className="glass flex flex-col justify-between p-6 space-y-6 border-primary/30 bg-primary/5 glow-violet relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold py-1 px-3 rounded-bl-xl uppercase">
              Best Value
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase border border-primary/10">
                  Bulk Pack
                </span>
                <CardTitle className="font-heading text-2xl font-bold text-foreground mt-2">Bulk Pack</CardTitle>
                <CardDescription className="text-xs mt-1">For ongoing operations</CardDescription>
              </div>
              <div>
                <span className="text-4xl font-extrabold text-foreground">₹299</span>
                <span className="text-muted-foreground text-xs font-medium ml-2">/ $3.99 USD</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">200 Credits (~1,000-2,000 rows estimated)</p>
              <ul className="space-y-2 text-xs text-foreground/80 border-t border-border pt-4">
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> 200 generations included</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Priority speed processing</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Custom Amazon/Shopify templates</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Under 6 hr priority support</li>
              </ul>
            </div>
            <div className="space-y-2 pt-4">
              <Button
                onClick={() => handleSimulatePayment('Bulk_Razorpay', '#bulk-razorpay')}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold"
              >
                Simulate INR (₹299)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSimulatePayment('Bulk_PayPal', '#bulk-paypal')}
                className="w-full border-border text-xs text-muted-foreground"
              >
                Simulate USD ($3.99)
              </Button>
            </div>
          </Card>

        </div>

        {/* FAQs Section */}
        <section className="max-w-4xl mx-auto pt-16 text-left space-y-8">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">How do credits work?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Each order parsed or CSV sheet standardized deducts exactly 1 credit from your sandbox quota. CSV downloads and table adjustments are completely free.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">How is my catalog data handled?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Privacy is our priority. We never write, store, or log raw notes, emails, phone numbers, or cleaned rows. We only maintain credit tallies and system metadata.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">Can I extend my quota?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes! Once your sandbox runs are exhausted, choose a sachet pack (₹99 or ₹299) to purchase rate-limit credits manually via our static payment simulator links.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">Do credits expire?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No. Purchased credits carry over and do not expire. You can use them to clean listings whenever you upload catalog supplier sheets.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
