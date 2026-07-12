import { Button } from '@/components/ui/button'
import { rowsToCSV, downloadCSV } from '@/lib/csvParser'
import { analytics } from '@/lib/analytics'

type Props = {
  rows: Record<string, string>[]
  columns: string[]
  filename?: string
  workflowType?: string
}

export function CsvDownloadButton({ rows, columns, filename = 'usetinamou-export.csv', workflowType }: Props) {
  const handleDownload = () => {
    const csv = rowsToCSV(rows, columns)
    downloadCSV(csv, filename)
    analytics.track('csv_downloaded', {
      workflow_type: workflowType ?? 'unknown',
      row_count: rows.length,
    })
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={rows.length === 0}
      className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download CSV ({rows.length} row{rows.length !== 1 ? 's' : ''})
    </Button>
  )
}
