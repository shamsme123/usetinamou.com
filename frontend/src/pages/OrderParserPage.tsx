import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LeadModal } from '@/components/LeadModal'
import { UpgradeModal } from '@/components/UpgradeModal'
import { EditableTable } from '@/components/EditableTable'
import { MissingFieldsPanel } from '@/components/MissingFieldsPanel'
import { ConfirmationMessage } from '@/components/ConfirmationMessage'
import { CsvDownloadButton } from '@/components/CsvDownloadButton'
import { api } from '@/lib/api'
import type { OrderResult } from '@/lib/api'
import { analytics } from '@/lib/analytics'

export function OrderParserPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const [orderText, setOrderText] = useState('')
  const [businessType, setBusinessType] = useState('apparel')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Extracted Results
  const [results, setResults] = useState<OrderResult | null>(null)
  // Columns matching our Zod extraction shape
  const columns = ['item', 'quantity', 'size', 'color', 'notes']
  const [items, setItems] = useState<Record<string, string>[]>([])

  useEffect(() => {
    const storedEmail = localStorage.getItem('ut_email')
    const storedRemaining = localStorage.getItem('ut_remaining')
    if (storedEmail) {
      setEmail(storedEmail)
      if (storedRemaining) setRemaining(Number(storedRemaining))
    } else {
      setShowLeadModal(true)
    }
    analytics.track('visitor_landed', { page: 'order-parser' })
  }, [])

  const handleLeadComplete = (userEmail: string, left: number) => {
    setEmail(userEmail)
    setRemaining(left)
    setShowLeadModal(false)
  }

  const handleGenerate = async () => {
    if (!email) {
      setShowLeadModal(true)
      return
    }
    if (remaining !== null && remaining <= 0) {
      setShowUpgradeModal(true)
      return
    }
    if (!orderText.trim()) {
      setError('Please paste some order text to convert.')
      return
    }
    setError('')
    setLoading(true)
    setResults(null)
    setItems([])
    
    analytics.track('generate_clicked', {
      workflow_type: 'order_parser',
      business_type: businessType,
      char_count: orderText.length,
    })

    try {
      const data = await api.generateOrder(email, orderText, businessType)
      setResults(data)
      setRemaining(data.generationsRemaining)
      localStorage.setItem('ut_remaining', String(data.generationsRemaining))
      
      // Convert list of OrderItems to flat string record mapping for table display
      const mappedItems = data.items.map((item) => ({
        item: item.item ?? '',
        quantity: item.quantity !== null ? String(item.quantity) : '',
        size: item.size ?? '',
        color: item.color ?? '',
        notes: item.notes ?? '',
      }))
      setItems(mappedItems)

      analytics.track('generation_success', {
        workflow_type: 'order_parser',
        warning_count: data.missingFields.length,
        confidence_score: data.confidenceScore,
      })
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to parse order text. Try again.'
      setError(errMsg)
      analytics.track('generation_failed', {
        workflow_type: 'order_parser',
        error_type: errMsg,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTableChange = (newItems: Record<string, string>[]) => {
    setItems(newItems)
  }

  const handleReset = () => {
    localStorage.removeItem('ut_email')
    localStorage.removeItem('ut_name')
    localStorage.removeItem('ut_remaining')
    setEmail(null)
    setRemaining(null)
    setResults(null)
    setItems([])
    setOrderText('')
    setShowLeadModal(true)
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-up">
      {/* Lead/Paywall gates */}
      <LeadModal open={showLeadModal} onComplete={handleLeadComplete} onClose={() => setShowLeadModal(false)} />
      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">Order Parser</h2>
          <p className="text-muted-foreground text-sm">
            Paste messy customer messages to extract structured delivery, billing, and line-item details.
          </p>
        </div>
        {email && (
          <Button variant="outline" size="sm" onClick={handleReset} className="border-border text-muted-foreground">
            Clear current user configuration
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Left Side: pasted order input */}
        <div className="md:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-foreground font-semibold">Messy Order Input</CardTitle>
              <CardDescription className="text-xs">Paste email orders, chat messages, or SMS notes below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Niche</label>
                <Select value={businessType} onValueChange={(val) => setBusinessType(val as string)}>
                  <SelectTrigger className="bg-secondary/40 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="apparel">👗 T-shirt / Custom Apparel</SelectItem>
                    <SelectItem value="bakery">🎂 Bakery & Gift Customizations</SelectItem>
                    <SelectItem value="print">🖨️ Printing & Signage Jobs</SelectItem>
                    <SelectItem value="wholesale">📦 Traders & Wholesalers</SelectItem>
                    <SelectItem value="other">✨ Generic Order Schema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Messy Text Block</label>
                <Textarea
                  placeholder="Example: Hey, this is Amit. Need 15 red L shirts and 10 white M hoodies by Friday. Send invoice to Amit Fabrics. Deliver to Gurugram."
                  value={orderText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrderText(e.target.value)}
                  className="min-h-[220px] bg-secondary/30 border-border font-mono text-sm leading-relaxed"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-6 rounded-xl animate-pulse-glow"
              >
                {loading ? 'Analyzing Text...' : 'Parse Order Text ⚡'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: parsing results outputs */}
        <div className="md:col-span-3 space-y-6">
          {loading && (
            <Card className="glass p-8 space-y-4 text-center">
              <span className="text-3xl animate-bounce inline-block">🪶</span>
              <h3 className="font-heading font-semibold text-lg text-foreground">Extracting order information...</h3>
              <Progress value={45} className="h-1 bg-secondary" />
              <p className="text-xs text-muted-foreground">Claude is mapping messy fields to standard Zod schema...</p>
            </Card>
          )}

          {!loading && !results && (
            <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground space-y-3">
              <span className="text-4xl block">📋</span>
              <h3 className="font-heading font-semibold text-foreground">Waiting for generation</h3>
              <p className="text-xs max-w-xs mx-auto">
                Paste order details on the left, pick the template, and hit parse to render the editable data sheet.
              </p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6">
              {/* Client Info Metadata */}
              <Card className="glass">
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-heading text-base text-foreground font-semibold">Extracted Metadata</CardTitle>
                    <div className="text-[10px] text-muted-foreground uppercase bg-secondary/50 px-2 py-0.5 rounded">
                      Confidence Score: {Math.round(results.confidenceScore * 100)}%
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm pb-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">Customer Name</span>
                    <span className="font-medium text-foreground">{results.customerName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Phone</span>
                    <span className="font-medium text-foreground">{results.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Shipping Location</span>
                    <span className="font-medium text-foreground truncate block" title={results.shippingAddress || ''}>
                      {results.shippingAddress || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Delivery Target Date</span>
                    <span className="font-medium text-foreground">{results.deliveryDate || '—'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Items Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading font-semibold text-foreground text-sm">Extracted Line Items</h3>
                  <CsvDownloadButton rows={items} columns={columns} filename="parsed-order.csv" workflowType="order_parser" />
                </div>
                <EditableTable columns={columns} rows={items} onChange={handleTableChange} />
              </div>

              {/* Missing Details Panel */}
              <MissingFieldsPanel
                missingFields={results.missingFields}
                recommendedAction="Verify matching sizes, address correctness, and phone coordinates before confirming order."
              />

              {/* Confirmation / WhatsApp Message */}
              <ConfirmationMessage message={results.confirmationMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
