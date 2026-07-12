import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { analytics } from '@/lib/analytics'

// Replace these with real payment links when ready
const RAZORPAY_LINK = '#razorpay' // e.g. https://rzp.io/l/usetinamou-starter
const PAYPAL_LINK   = '#paypal'   // e.g. https://paypal.me/shamsmislam/99

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    usd: '$0',
    limit: '15 generations · 20 rows',
    features: ['Order Parser', 'Product CSV Formatter', 'CSV Export'],
    cta: null,
    current: true,
  },
  {
    name: 'Starter',
    price: '₹8,000',
    usd: '$99',
    limit: '200 generations · 50 rows per CSV',
    features: ['Everything in Free', 'Priority processing', 'Template library', 'Email support'],
    cta: 'Upgrade Now',
    current: false,
    highlight: true,
  },
]

type Props = {
  open: boolean
  onClose: () => void
}

export function UpgradeModal({ open, onClose }: Props) {
  const handleClick = (planName: string, link: string) => {
    analytics.track('payment_clicked', { plan: planName })
    if (link !== '#razorpay' && link !== '#paypal') {
      window.open(link, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass bg-card">
        <DialogHeader className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
            <span className="text-xl">🚀</span>
          </div>
          <DialogTitle className="font-heading text-xl text-foreground">
            Sandbox Quota Reached
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Free sandbox runs are capped to protect API infrastructure limits. Request rate limit extensions below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-4 border space-y-3 ${
                plan.highlight
                  ? 'border-primary/30 bg-primary/5 glow-violet'
                  : 'border-border bg-secondary/50'
              }`}
            >
              {plan.highlight && (
                <span className="text-[10px] font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  RECOMMENDED
                </span>
              )}
              <div>
                <p className="font-heading font-bold text-foreground text-lg">{plan.name}</p>
                <p className="text-primary font-semibold text-xl">{plan.price}</p>
                <p className="text-muted-foreground text-xs">{plan.usd} · one time</p>
              </div>
              <p className="text-xs text-muted-foreground">{plan.limit}</p>
              <ul className="space-y-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-foreground/70 flex items-center gap-1.5">
                    <span className="text-accent">✓</span> {f}
                  </li>
                ))}
              </ul>
              {plan.cta ? (
                <div className="space-y-2 pt-1">
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-xs"
                    onClick={() => handleClick(plan.name + '-INR', RAZORPAY_LINK)}
                  >
                    Simulate INR Upgrade (₹8,000)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-border text-xs"
                    onClick={() => handleClick(plan.name + '-USD', PAYPAL_LINK)}
                  >
                    Simulate USD Upgrade ($99)
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic pt-1">Current plan</p>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground pt-2">
          Manual credentials verification within 24 hours. Questions?{' '}
          <a href="/contact" className="text-primary hover:underline">Contact us</a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
