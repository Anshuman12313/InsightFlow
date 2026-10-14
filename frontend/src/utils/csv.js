export function isCsvFile(file) {
  if (!file) {
    return false
  }

  const name = file.name.toLowerCase()
  return name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel'
}

export async function parseCsvPreview(file, maxRows = 5) {
  const text = await file.text()
  const lines = text.split(/\r?\n/).filter((line) => line.trim())

  if (lines.length === 0) {
    throw new Error('CSV file is empty.')
  }

  const headers = splitCsvLine(lines[0])
  const rows = lines.slice(1, maxRows + 1).map((line) => {
    const values = splitCsvLine(line)
    return headers.reduce((row, header, index) => {
      row[header] = values[index] ?? ''
      return row
    }, {})
  })

  return { headers, rows }
}

function splitCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}
