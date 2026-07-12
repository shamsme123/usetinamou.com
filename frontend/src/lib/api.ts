// Typed API client — talks to the Express backend on port 3001
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error((err as { message: string }).message ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

// ── Types ──────────────────────────────────────────────────────────────────

export type LeadPayload = {
  name: string
  email: string
  useCase: string
  consentAccepted: boolean
}

export type LeadResponse = {
  leadId: string
  generationsRemaining: number
}

export type OrderItem = {
  item: string
  quantity: number | null
  size?: string | null
  color?: string | null
  notes?: string | null
}

export type OrderResult = {
  customerName: string | null
  phone: string | null
  email: string | null
  billingName: string | null
  shippingAddress: string | null
  deliveryDate: string | null
  items: OrderItem[]
  missingFields: string[]
  confidenceScore: number
  confirmationMessage: string
  generationsRemaining: number
}

export type ProductRow = Record<string, string>

export type ProductCsvResult = {
  mappedColumns: string[]
  cleanedRows: ProductRow[]
  warnings: string[]
  duplicateCandidates: string[]
  missingRequiredFields: string[]
  generationsRemaining: number
}

export type ConfigResponse = {
  freeGenerationLimit: number
  freeRowLimit: number
  features: { orderParser: boolean; productCsv: boolean }
}

// ── Endpoints ──────────────────────────────────────────────────────────────

export const api = {
  createLead: (payload: LeadPayload) =>
    request<LeadResponse>('/leads', payload),

  generateOrder: (email: string, orderText: string, businessType: string) =>
    request<OrderResult>('/generate/order', { email, orderText, businessType }),

  generateProductCsv: (
    email: string,
    columns: string[],
    rows: ProductRow[],
    targetSchema: string,
    category: string,
  ) =>
    request<ProductCsvResult>('/generate/product-csv', {
      email,
      columns,
      rows,
      targetSchema,
      category,
    }),

  getConfig: async (): Promise<ConfigResponse> => {
    const res = await fetch(`${BASE}/config`)
    return res.json() as Promise<ConfigResponse>
  },
}
