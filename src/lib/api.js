const API_BASE_URL = 'https://upgradtask-backend.onrender.com/api';

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/admin/stats`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function uploadCSV(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/admin/upload-csv`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function fetchCertificates(page = 1, limit = 10) {
  const response = await fetch(`${API_BASE_URL}/admin/certificates?page=${page}&limit=${limit}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function searchCertificates(query) {
  const response = await fetch(`${API_BASE_URL}/admin/search?query=${encodeURIComponent(query)}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function fetchCertificateById(certificateId) {
  const response = await fetch(`${API_BASE_URL}/certificate/${certificateId}`);
  
  // Check content type before parsing
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // If response is not OK
  if (!response.ok) {
    if (isJson) {
      // Parse JSON error response
      const errorData = await response.json();
      throw new Error(errorData.error || 'Certificate not found');
    } else {
      // If not JSON (e.g., HTML error page), throw a generic error
      throw new Error(`Failed to fetch certificate: ${response.status} ${response.statusText}`);
    }
  }
  
  // If not JSON, throw error
  if (!isJson) {
    throw new Error('Invalid response format: expected JSON');
  }
  
  // Parse JSON response
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Certificate not found');
  }
  return data;
}

