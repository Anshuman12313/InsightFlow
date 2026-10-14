export function formatFileSize(bytes) {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / 1024 ** index

  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

export function formatPercent(value, total) {
  if (!total) {
    return '0%'
  }

  return `${((value / total) * 100).toFixed(1)}%`
}

export function truncateText(text, maxLength = 120) {
  if (!text || text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength)}...`
}
