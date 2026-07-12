import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { analytics } from '@/lib/analytics'

export function LandingPage() {
  useEffect(() => {
    analytics.track('visitor_landed', { page: 'landing' })
  }, [])

  return (
    <div className="flex-1 w-full relative overflow-hidden bg-background hero-grid">
      {/* Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center space-y-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-medium text-muted-foreground">Sandbox session · 5 free quota runs</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-foreground">
          Convert Messy Business Inputs Into Clean <span className="gradient-text font-extrabold">Spreadsheets</span>
        </h1>

        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          UseTinamou turns chaotic WhatsApp texts, email lists, and legacy product sheets into clean, structured, downloadable CSV files in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/order-parser">
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-xl text-base animate-pulse-glow">
              Open Order Parser 👕
            </Button>
          </Link>
          <Link to="/product-csv">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-secondary text-foreground px-8 py-6 rounded-xl text-base">
              Open CSV Formatter 🛒
            </Button>
          </Link>
        </div>
      </section>

      {/* Workflows Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-8">
        <Card className="glass relative group overflow-hidden border-white/10">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/40 group-hover:bg-primary transition-colors" />
          <CardHeader className="space-y-1">
            <span className="text-3xl">💬</span>
            <CardTitle className="font-heading text-2xl text-foreground font-bold">Order Parser</CardTitle>
            <CardDescription className="text-muted-foreground">
              Messy WhatsApp texts, SMS, notes, and emails to order tables.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/40 rounded-xl p-4 text-xs font-mono text-left leading-relaxed text-muted-foreground border border-white/5">
              "Raj Traders here. Need 15 black XL shirts, 10 blue M, delivery next Tuesday. Bill to Raj Traders."
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-accent">
              <span>Extracts sizes, counts, shipping & dates</span>
              <span>➔</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass relative group overflow-hidden border-white/10">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-accent/40 group-hover:bg-accent transition-colors" />
          <CardHeader className="space-y-1">
            <span className="text-3xl">📦</span>
            <CardTitle className="font-heading text-2xl text-foreground font-bold">Product Formatter</CardTitle>
            <CardDescription className="text-muted-foreground">
              Supplier tables and pasted catalog listings to clean marketplace fields.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/40 rounded-xl p-4 text-xs font-mono text-left leading-relaxed text-muted-foreground border border-white/5">
              Item description with missing titles, non-matching categories, varying variant columns.
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-accent">
              <span>Standardizes titles, categories & tags</span>
              <span>➔</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Competitive Grid VS ChatGPT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-8">
          Why OrderSheet AI over raw ChatGPT?
        </h2>
        <div className="border border-white/10 rounded-xl overflow-hidden glass">
          <div className="grid grid-cols-3 text-xs uppercase tracking-wider font-semibold text-muted-foreground bg-secondary/40 px-6 py-4 border-b border-white/10">
            <div>Feature</div>
            <div>ChatGPT / Claude</div>
            <div className="text-primary font-bold">OrderSheet AI</div>
          </div>
          <div className="divide-y divide-white/5 text-sm">
            <div className="grid grid-cols-3 px-6 py-4 text-foreground/80">
              <div className="font-medium text-foreground">Repeatable Output</div>
              <div>Prompt writes vary daily</div>
              <div className="text-accent font-semibold">Fixed Zod-schema mapping</div>
            </div>
            <div className="grid grid-cols-3 px-6 py-4 text-foreground/80">
              <div className="font-medium text-foreground">Interactive Control</div>
              <div>Text response only</div>
              <div className="text-accent font-semibold">Editable table + manual corrections</div>
            </div>
            <div className="grid grid-cols-3 px-6 py-4 text-foreground/80">
              <div className="font-medium text-foreground">Missing details</div>
              <div>Often ignores or hallucinates</div>
              <div className="text-accent font-semibold">Flags empty fields & alerts vendor</div>
            </div>
            <div className="grid grid-cols-3 px-6 py-4 text-foreground/80">
              <div className="font-medium text-foreground">File Exports</div>
              <div>Messy markdown tables</div>
              <div className="text-accent font-semibold">Clean Shopify/Amazon import CSVs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <h2 className="font-heading text-3xl font-bold text-foreground">API Quotas & Usage Tiers</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Free sessions are capped to safeguard AI APIs. Request rate limit extensions as needed.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-6">
          <div className="border border-border rounded-2xl p-6 bg-secondary/20 space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">Sandbox Tier</h3>
            <p className="text-3xl font-extrabold text-foreground">Free</p>
            <p className="text-xs text-muted-foreground">5 extraction requests · Max 20 catalog rows</p>
            <Link to="/order-parser" className="block">
              <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground border border-border">
                Open Sandbox
              </Button>
            </Link>
          </div>
          <div className="border border-primary/30 rounded-2xl p-6 bg-primary/5 glow-violet space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold py-1 px-3 rounded-bl-xl uppercase">
              Production
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground">Extended Quota</h3>
            <p className="text-3xl font-extrabold text-foreground">₹8,000</p>
            <p className="text-xs text-muted-foreground">$99 USD (one-time API key allocation fee)</p>
            <p className="text-xs text-muted-foreground">200 runs/month · Max 50 rows per CSV</p>
            <Link to="/order-parser" className="block">
              <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground">
                Request Extended Quota
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
