import { useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'

type Props = {
  columns: string[]
  rows: Record<string, string>[]
  onChange: (rows: Record<string, string>[]) => void
  warningRows?: Set<number>
  missingCells?: Set<string> // "rowIndex:column"
}

export function EditableTable({ columns, rows, onChange, warningRows, missingCells }: Props) {
  const [editingCell, setEditingCell] = useState<string | null>(null)

  const handleEdit = useCallback(
    (rowIdx: number, col: string, value: string) => {
      const updated = rows.map((r, i) =>
        i === rowIdx ? { ...r, [col]: value } : r,
      )
      onChange(updated)
    },
    [rows, onChange],
  )

  if (rows.length === 0) return null

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-secondary/40">
            <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">#</th>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => {
            const isWarning = warningRows?.has(rowIdx)
            return (
              <tr
                key={rowIdx}
                className={`border-b border-white/5 transition-colors hover:bg-white/3 ${isWarning ? 'bg-amber-500/5' : ''}`}
              >
                <td className="px-3 py-2 text-muted-foreground text-xs">{rowIdx + 1}</td>
                {columns.map((col) => {
                  const cellKey = `${rowIdx}:${col}`
                  const isMissing = missingCells?.has(cellKey)
                  const isEditing = editingCell === cellKey
                  const value = row[col] ?? ''

                  return (
                    <td key={col} className="px-3 py-2 max-w-[200px]">
                      {isEditing ? (
                        <input
                          autoFocus
                          className="w-full bg-secondary/60 border border-primary/40 rounded-md px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                          value={value}
                          onChange={(e) => handleEdit(rowIdx, col, e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                        />
                      ) : (
                        <div
                          onClick={() => setEditingCell(cellKey)}
                          className={`cursor-pointer rounded-md px-2 py-1 min-h-[28px] transition-all hover:bg-secondary/60 group ${isMissing ? 'border border-destructive/40 bg-destructive/5' : ''}`}
                        >
                          {value ? (
                            <span className="text-foreground truncate block">{value}</span>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs italic">
                              {isMissing ? '⚠ missing' : 'empty — click to add'}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  )
                })}
                {isWarning && (
                  <td className="px-3 py-2">
                    <Badge variant="outline" className="text-amber-400 border-amber-400/30 text-[10px]">
                      ⚠ review
                    </Badge>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
