import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LeadModal } from '@/components/LeadModal'
import { UpgradeModal } from '@/components/UpgradeModal'
import { EditableTable } from '@/components/EditableTable'
import { CsvDownloadButton } from '@/components/CsvDownloadButton'
import { api } from '@/lib/api'
import type { ProductRow, ProductCsvResult } from '@/lib/api'
import { parseCSVFile, parseCSVText } from '@/lib/csvParser'
import { analytics } from '@/lib/analytics'

export function ProductCsvPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const [targetSchema, setTargetSchema] = useState('shopify')
  const [category, setCategory] = useState('')
  const [pastedCsv, setPastedCsv] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Parsing & Results
  const [parsedInput, setParsedInput] = useState<{ columns: string[]; rows: ProductRow[] } | null>(null)
  const [results, setResults] = useState<ProductCsvResult | null>(null)
  const [gridRows, setGridRows] = useState<ProductRow[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem('ut_email')
    const storedRemaining = localStorage.getItem('ut_remaining')
    if (storedEmail) {
      setEmail(storedEmail)
      if (storedRemaining) setRemaining(Number(storedRemaining))
    } else {
      setShowLeadModal(true)
    }
    analytics.track('visitor_landed', { page: 'product-csv' })
  }, [])

  const handleLeadComplete = (userEmail: string, left: number) => {
    setEmail(userEmail)
    setRemaining(left)
    setShowLeadModal(false)
  }

  // Handle local CSV upload parse
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    try {
      const parsed = await parseCSVFile(file)
      if (parsed.error) {
        setError(parsed.error)
        return
      }
      // Hard limit check for free batch uploads: max 20 rows sent to server
      const slicedRows = parsed.rows.slice(0, 20)
      setParsedInput({ columns: parsed.columns, rows: slicedRows })
      analytics.track('csv_uploaded', { row_count: parsed.rows.length, sliced_count: slicedRows.length })
    } catch {
      setError('Failed to parse uploaded CSV file.')
    }
  }

  // Parse pasted CSV input string
  const handleParsePasted = () => {
    if (!pastedCsv.trim()) {
      setError('Please paste CSV contents to format.')
      return
    }
    setError('')
    const parsed = parseCSVText(pastedCsv.trim())
    if (parsed.error) {
      setError(parsed.error)
      return
    }
    const slicedRows = parsed.rows.slice(0, 20)
    setParsedInput({ columns: parsed.columns, rows: slicedRows })
  }

  const handleFormat = async () => {
    if (!email) {
      setShowLeadModal(true)
      return
    }
    if (remaining !== null && remaining <= 0) {
      setShowUpgradeModal(true)
      return
    }
    if (!parsedInput || parsedInput.rows.length === 0) {
      setError('No parsed rows found. Please upload a file or parse pasted csv lines.')
      return
    }
    setError('')
    setLoading(true)
    setResults(null)
    setGridRows([])

    analytics.track('generate_clicked', {
      workflow_type: 'product_csv',
      target_schema: targetSchema,
      row_count: parsedInput.rows.length,
    })

    try {
      const data = await api.generateProductCsv(
        email,
        parsedInput.columns,
        parsedInput.rows,
        targetSchema,
        category,
      )
      setResults(data)
      setGridRows(data.cleanedRows)
      setRemaining(data.generationsRemaining)
      localStorage.setItem('ut_remaining', String(data.generationsRemaining))

      analytics.track('generation_success', {
        workflow_type: 'product_csv',
        warning_count: data.warnings.length,
        duplicate_count: data.duplicateCandidates.length,
      })
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to clean product sheet. Try again.'
      setError(errMsg)
      analytics.track('generation_failed', {
        workflow_type: 'product_csv',
        error_type: errMsg,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGridChange = (updated: ProductRow[]) => {
    setGridRows(updated)
  }

  const handleClear = () => {
    setParsedInput(null)
    setResults(null)
    setGridRows([])
    setPastedCsv('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleResetUser = () => {
    localStorage.removeItem('ut_email')
    localStorage.removeItem('ut_name')
    localStorage.removeItem('ut_remaining')
    setEmail(null)
    setRemaining(null)
    handleClear()
    setShowLeadModal(true)
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-up">
      {/* Lead/Paywall gates */}
      <LeadModal open={showLeadModal} onComplete={handleLeadComplete} onClose={() => setShowLeadModal(false)} />
      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">Marketplace CSV Formatter</h2>
          <p className="text-muted-foreground text-sm">
            Standardize messy product sheets into clean columns mapped to Shopify or Amazon target schemas.
          </p>
        </div>
        {email && (
          <Button variant="outline" size="sm" onClick={handleResetUser} className="border-border text-muted-foreground">
            Clear current user configuration
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Left Side Config & Inputs */}
        <div className="md:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-foreground font-semibold">Clean Options</CardTitle>
              <CardDescription className="text-xs">Specify target parameters and configure supplier sheet inputs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Schema</label>
                <Select value={targetSchema} onValueChange={(val) => setTargetSchema(val as string)}>
                  <SelectTrigger className="bg-secondary/40 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="shopify">Shopify Standard Fields</SelectItem>
                    <SelectItem value="amazon">Amazon Listing Layout</SelectItem>
                    <SelectItem value="generic">Generic Consolidated Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category / Niche (Optional)</label>
                <Input
                  placeholder="e.g. Handmade ceramic mugs, graphic tees"
                  value={category}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                  className="bg-secondary/30 border-border"
                />
              </div>

              <div className="border-t border-border my-4" />

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step 1: Parse Product Table</h4>
                
                {/* File Upload Option */}
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Option A: Upload File</span>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="bg-secondary/30 border-border text-xs py-1"
                  />
                </div>

                <div className="text-center text-xs text-muted-foreground font-medium my-2">— OR —</div>

                {/* Paste Option */}
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Option B: Paste Raw CSV Rows</span>
                  <textarea
                    placeholder="title,sku,price,color&#10;mug 1,m-01,15.99,blue&#10;mug 2,m-02,17.99,red"
                    value={pastedCsv}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPastedCsv(e.target.value)}
                    className="min-h-[120px] w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-xs font-mono outline-none"
                  />
                  <Button variant="secondary" size="sm" onClick={handleParsePasted} className="w-full text-xs">
                    Parse Pasted Text
                  </Button>
                </div>
              </div>

              {parsedInput && (
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-accent">Parsed successfully</p>
                    <p className="text-[10px] text-muted-foreground">
                      Columns: {parsedInput.columns.length} · Rows: {parsedInput.rows.length}
                    </p>
                  </div>
                  <Button variant="link" size="sm" onClick={handleClear} className="text-destructive text-[11px] p-0 h-auto">
                    Clear Input
                  </Button>
                </div>
              )}

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button
                onClick={handleFormat}
                disabled={loading || !parsedInput}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-6 rounded-xl animate-pulse-glow"
              >
                {loading ? 'Formatting Catalog...' : 'Format Product Sheet ✨'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side Outputs Grid */}
        <div className="md:col-span-3 space-y-6">
          {loading && (
            <Card className="glass p-8 space-y-4 text-center">
              <span className="text-3xl animate-bounce inline-block">🪶</span>
              <h3 className="font-heading font-semibold text-lg text-foreground">Normalizing product columns...</h3>
              <Progress value={60} className="h-1 bg-secondary" />
              <p className="text-xs text-muted-foreground">Claude is matching header layouts and cleaning variants...</p>
            </Card>
          )}

          {!loading && !results && (
            <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground space-y-3">
              <span className="text-4xl block">📊</span>
              <h3 className="font-heading font-semibold text-foreground">Waiting for normalization</h3>
              <p className="text-xs max-w-xs mx-auto">
                Parse a source sheet on the left, then run the formatter to visualize clean marketplace columns.
              </p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6">
              {/* Warnings and Duplicate checks */}
              {(results.warnings.length > 0 || results.duplicateCandidates.length > 0) && (
                <div className="space-y-3">
                  {results.warnings.length > 0 && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                      <h4 className="font-heading text-xs font-semibold text-amber-400">Schema Integrity Warnings</h4>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                        {results.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                      </ul>
                    </div>
                  )}

                  {results.duplicateCandidates.length > 0 && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                      <h4 className="font-heading text-xs font-semibold text-red-400">Duplicate SKU / Title Candidates</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {results.duplicateCandidates.map((dup) => (
                          <Badge key={dup} variant="outline" className="border-red-500/30 text-red-300 text-[10px]">
                            {dup}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Formatted output spreadsheet */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading font-semibold text-foreground text-sm">Cleaned Output Table</h3>
                  <CsvDownloadButton
                    rows={gridRows}
                    columns={results.mappedColumns}
                    filename="cleaned-products.csv"
                    workflowType="product_csv"
                  />
                </div>
                <EditableTable
                  columns={results.mappedColumns}
                  rows={gridRows}
                  onChange={handleGridChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
