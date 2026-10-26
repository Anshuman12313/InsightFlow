import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 600000,
})

export async function checkHealth() {
  const response = await api.get('/health')
  return response.data
}

export async function uploadCsv(file, onUploadProgress) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })

  return response.data
}

export async function analyzeData({ usefulColumns, feedbackColumn, fileName }) {
  const response = await api.post('/analyze', {
    useful_columns: usefulColumns,
    feedback_column: feedbackColumn,
    file_name: fileName,
  })

  return response.data
}
export async function loginUser(username, password) {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  localStorage.setItem("access_token", data.access_token);

  return data;
}

export function getErrorMessage(error) {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail
    if (typeof detail === 'string') {
      return detail
    }
    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).join(', ')
    }
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Large files may take several minutes to process.'
  }

  if (error.message === 'Network Error') {
    return 'Unable to reach the server. Make sure the FastAPI backend is running.'
  }

  return error.message || 'Something went wrong. Please try again.'
}

export default api
