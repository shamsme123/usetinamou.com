import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { analytics } from '@/lib/analytics'

const SACHET_RAZORPAY = '#sachet-razorpay'
const SACHET_PAYPAY   = '#sachet-paypal'
const BULK_RAZORPAY   = '#bulk-razorpay'
const BULK_PAYPAY     = '#bulk-paypal'

type Plan = {
  name: string
  price: string
  usd: string
  limit: string
  features: string[]
  cta: string
  highlight: boolean
  razorpay: string
  paypal: string
}

const PAID_PLANS: Plan[] = [
  {
    name: 'Sachet Pack',
    price: '₹99',
    usd: '$1.49',
    limit: '50 Credits (~250-500 rows)',
    features: [
      '50 extraction runs',
      'Shopify & Amazon target mapping',
      'Clean CSV downloads',
      'Email support (24 hours)'
    ],
    cta: 'Get Sachet Pack',
    highlight: false,
    razorpay: SACHET_RAZORPAY,
    paypal: SACHET_PAYPAY
  },
  {
    name: 'Bulk Pack',
    price: '₹299',
    usd: '$3.99',
    limit: '200 Credits (~1,000-2,000 rows)',
    features: [
      '200 extraction runs',
      'Priority processing speed',
      'Shopify & Amazon target mapping',
      'Priority support (under 6 hrs)'
    ],
    cta: 'Get Bulk Pack',
    highlight: true,
    razorpay: BULK_RAZORPAY,
    paypal: BULK_PAYPAY
  }
]

type Props = {
  open: boolean
  onClose: () => void
}

export function UpgradeModal({ open, onClose }: Props) {
  const handleClick = (planName: string, link: string) => {
    analytics.track('payment_clicked', { plan: planName.toLowerCase().replace(/ /g, '_') })
    if (link && !link.startsWith('#')) {
      window.open(link, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl glass bg-card">
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

        {/* Current status tier card */}
        <div className="bg-secondary/40 border border-border rounded-xl p-3 flex justify-between items-center text-xs mt-2">
          <div className="text-left">
            <span className="font-semibold text-foreground block">Active Plan: Sandbox Tier</span>
            <span className="text-muted-foreground text-[10px]">15 Credits (~75-150 rows estimated output)</span>
          </div>
          <span className="bg-accent/15 text-accent border border-accent/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
            Active
          </span>
        </div>

        {/* Paid tiers side-by-side */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          {PAID_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-4 border space-y-3 flex flex-col justify-between text-left ${
                plan.highlight
                  ? 'border-primary/30 bg-primary/5 glow-violet'
                  : 'border-border bg-secondary/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-bold text-foreground text-base">{plan.name}</h4>
                    <p className="text-muted-foreground text-xs">{plan.limit}</p>
                  </div>
                  {plan.highlight && (
                    <span className="text-[9px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase">
                      POPULAR
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-primary font-bold text-2xl">{plan.price}</span>
                  <span className="text-muted-foreground text-xs font-medium ml-1.5">/ {plan.usd}</span>
                </div>

                <ul className="space-y-1.5 border-t border-border pt-3">
                  {plan.features.map((f) => (
                    <li key={f} className="text-[11px] text-foreground/75 flex items-start gap-1.5">
                      <span className="text-accent text-[12px] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/95 text-xs font-semibold"
                  onClick={() => handleClick(plan.name + '_Razorpay', plan.razorpay)}
                >
                  Simulate INR Upgrade ({plan.price})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-border text-xs text-muted-foreground"
                  onClick={() => handleClick(plan.name + '_PayPal', plan.paypal)}
                >
                  Simulate USD Upgrade ({plan.usd})
                </Button>
              </div>
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
