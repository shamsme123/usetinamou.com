export function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-foreground/80 leading-relaxed text-sm text-left">
      <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-8">Contact Us</h1>

      <p className="text-muted-foreground text-center max-w-md mx-auto">
        Have questions about billing, custom schemas, or API credits? Drop us a line.
      </p>

      <div className="border border-white/10 rounded-2xl p-6 glass max-w-md mx-auto space-y-4">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">Support Email</span>
          <a href="mailto:support@usetinamou.com" className="text-primary hover:underline font-medium text-base">
            support@usetinamou.com
          </a>
        </div>

        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">Creator</span>
          <p className="text-foreground font-medium text-sm">
            Shams Mahboob Islam<br />
            Kolkata, West Bengal, India
          </p>
        </div>

        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">Verification Timings</span>
          <p className="text-foreground text-sm font-medium">
            Monday – Friday · 10:00 AM to 6:00 PM IST
          </p>
        </div>
      </div>
    </div>
  )
}
