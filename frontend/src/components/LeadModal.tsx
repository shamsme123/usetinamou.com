import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { analytics } from '@/lib/analytics'

const USE_CASES = [
  { value: 'apparel', label: '👕 Custom Apparel / T-shirts' },
  { value: 'bakery', label: '🎂 Bakery / Gifts / Custom Orders' },
  { value: 'print', label: '🖨️ Print / Signage Shop' },
  { value: 'wholesale', label: '📦 Wholesale / Trading' },
  { value: 'marketplace', label: '🛒 Marketplace / E-commerce' },
  { value: 'other', label: '✨ Other' },
]

type Props = {
  open: boolean
  onComplete: (email: string, remaining: number) => void
  onClose?: () => void
}

export function LeadModal({ open, onComplete, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !email.trim() || !useCase || !consent) {
      setError('Please fill all fields and accept the terms.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await api.createLead({ name: name.trim(), email: email.trim(), useCase, consentAccepted: true })
      analytics.identify(email.trim(), { name: name.trim(), useCase })
      analytics.track('email_submitted', { use_case: useCase, business_type: useCase })
      localStorage.setItem('ut_email', email.trim())
      localStorage.setItem('ut_name', name.trim())
      localStorage.setItem('ut_remaining', String(res.generationsRemaining))
      onComplete(email.trim(), res.generationsRemaining)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [name, email, useCase, consent, onComplete])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose && onClose()}>
      <DialogContent className="sm:max-w-md glass bg-card">
        <DialogHeader className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
            <span className="text-xl">🪶</span>
          </div>
          <DialogTitle className="font-heading text-xl text-foreground">
            Configure Sandbox Session
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter your details to initialize your parser sandbox.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Name</label>
            <Input
              placeholder="e.g. Raj Sharma"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="bg-secondary/40 border-border focus:border-primary/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Work Email</label>
            <Input
              type="email"
              placeholder="you@business.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="bg-secondary/40 border-border focus:border-primary/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Business Type</label>
            <Select onValueChange={(val) => setUseCase(val as string)}>
              <SelectTrigger className="bg-secondary/40 border-border">
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {USE_CASES.map((u) => (
                  <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border transition-all ${consent ? 'bg-primary border-primary' : 'border-border bg-secondary/40'}`}>
                {consent && <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
            </div>
            <span className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{' '}
              <a href="/terms" target="_blank" className="text-primary hover:underline">Terms & Conditions</a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</a>.
              No raw order data is stored.
            </span>
          </label>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium animate-pulse-glow"
          >
            {loading ? 'Setting up...' : 'Initialize Sandbox — 15 Credits'}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Evaluation session · 15 sandbox generations included
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
