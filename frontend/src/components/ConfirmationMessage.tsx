import { useState } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  message: string
}

export function ConfirmationMessage({ message }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-accent text-lg">💬</span>
          <h3 className="font-heading font-semibold text-accent text-sm">Customer Confirmation Message</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="border-accent/30 text-accent hover:bg-accent/10 text-xs h-7"
        >
          {copied ? '✓ Copied!' : 'Copy for WhatsApp'}
        </Button>
      </div>
      <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed bg-secondary/30 rounded-lg p-3 font-mono text-xs">
        {message}
      </p>
    </div>
  )
}
