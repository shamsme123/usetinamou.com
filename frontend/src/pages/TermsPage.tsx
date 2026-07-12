export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-foreground/80 leading-relaxed text-sm text-left">
      <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-8">Terms & Conditions</h1>
      
      <p className="text-xs text-muted-foreground">Last updated: 20 June 2026</p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">1. Agreement to Terms</h3>
      <p>
        Welcome to UseTinamou.com. By accessing or using our services, you agree to be bound by these Terms & Conditions.
        If you disagree with any part of these terms, you must not use our software or service.
      </p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">2. Proprietary License Restrictions</h3>
      <p>
        The software and all associated documentation are proprietary, confidential, and the sole intellectual property of Shams Mahboob Islam.
        This codebase is shared publicly strictly for evaluation, portfolio assessment, and educational review.
        You may not copy, modify, distribute, or run competing commercial versions of this system.
      </p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">3. Fair Use & Free Limits</h3>
      <p>
        Free tier users are granted a maximum limit of 5 total extraction generations and 20 product rows per CSV sheet.
        Circumventing limits via multi-account creations is grounds for immediate endpoint termination.
      </p>

      <h3 className="font-heading text-lg font-semibold text-foreground mt-4">4. Limitation of Liability</h3>
      <p>
        The Software is provided "AS IS", without warranty of any kind, express or implied.
        In no event shall the author or copyright holders be liable for any claims, damages, or other liability arising from the use of UseTinamou.com.
      </p>
    </div>
  )
}
