import Papa from 'papaparse'

export type ParsedCSV = {
  columns: string[]
  rows: Record<string, string>[]
  error?: string
}

export function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columns = results.meta.fields ?? []
        resolve({ columns, rows: results.data })
      },
      error: (err) => {
        resolve({ columns: [], rows: [], error: err.message })
      },
    })
  })
}

export function parseCSVText(text: string): ParsedCSV {
  const results = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  })
  return {
    columns: results.meta.fields ?? [],
    rows: results.data,
    error: results.errors[0]?.message,
  }
}

export function rowsToCSV(rows: Record<string, string>[], columns: string[]): string {
  return Papa.unparse({ fields: columns, data: rows })
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
