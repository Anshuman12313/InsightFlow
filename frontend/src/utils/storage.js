const RESULTS_KEY = 'feedback_cluster_results'

export function saveResults(results) {
  sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results))
}

export function loadResults() {
  const raw = sessionStorage.getItem(RESULTS_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearResults() {
  sessionStorage.removeItem(RESULTS_KEY)
}
