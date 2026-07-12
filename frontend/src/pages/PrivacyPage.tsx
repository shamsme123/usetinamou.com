export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-foreground/80 leading-relaxed text-sm text-left">
      <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-8">Privacy Policy</h1>
      
      <p className="text-xs text-muted-foreground">Last updated: 20 June 2026</p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">1. Data Storage & Privacy Promise</h3>
      <p>
        Your privacy is our utmost priority. Unlike typical AI wrappers, UseTinamou.com **does not store or log raw customer orders,
        SMS strings, address details, phone numbers, or product sheets** in our databases. All extraction happens in memory
        during the Claude 3.5 API request execution lifecycle and is discarded immediately.
      </p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">2. Collected Information</h3>
      <p>
        To track token allowances and free limits, we store only:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Your Name, Email, and designated Business Type (collected upfront).</li>
          <li>Basic metadata metrics (timestamps, usage count counters, token counts estimate).</li>
        </ul>
      </p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">3. Third Party Engines</h3>
      <p>
        Messy texts are parsed securely using Anthropic API endpoints. We ensure no model training takes place on the data processed.
      </p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">4. Cookie & LocalStorage usage</h3>
      <p>
        We store your email address and authentication state inside your local web browser LocalStorage to skip the signup step on subsequent visits.
      </p>
    </div>
  )
}
