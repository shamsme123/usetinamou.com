export function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-foreground/80 leading-relaxed text-sm text-left">
      <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-8">Refund & Cancellation Policy</h1>
      
      <p className="text-xs text-muted-foreground">Last updated: 20 June 2026</p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">1. Digital Item Nature</h3>
      <p>
        Since UseTinamou.com provides digital services that are consumed immediately upon generation execution (API calls to Anthropic models),
        we do not offer standard refunds once generation credits are used.
      </p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">2. Upgrades & Top-ups</h3>
      <p>
        Upgrades to the Starter Pack are verified manually by cross-checking incoming Razorpay, Instamojo, or PayPal receipt receipts
        against user emails. Verification takes up to 24 hours.
      </p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">3. Refunds Eligibility</h3>
      <p>
        If your account fails to receive credits within 48 hours of verification receipt, or you encounter technical errors where credits cannot be spent,
        please contact our support team. We will resolve the issue or process a full manual refund.
      </p>
    </div>
  )
}
