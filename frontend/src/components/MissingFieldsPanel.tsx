import { Badge } from '@/components/ui/badge'

type Props = {
  missingFields: string[]
  recommendedAction?: string
}

export function MissingFieldsPanel({ missingFields, recommendedAction }: Props) {
  if (missingFields.length === 0) return null

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-amber-400 text-lg">⚠</span>
        <h3 className="font-heading font-semibold text-amber-400 text-sm">Missing Information Detected</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {missingFields.map((field) => (
          <Badge
            key={field}
            variant="outline"
            className="border-amber-500/30 text-amber-300 bg-amber-500/10 text-xs capitalize"
          >
            {field.replace(/_/g, ' ')}
          </Badge>
        ))}
      </div>
      {recommendedAction && (
        <p className="text-xs text-muted-foreground border-t border-amber-500/10 pt-3">
          <span className="text-amber-400 font-medium">Recommended: </span>
          {recommendedAction}
        </p>
      )}
    </div>
  )
}
