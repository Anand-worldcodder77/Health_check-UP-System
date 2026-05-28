import { API_BASE } from './apiConfig';

export function isCloudinaryConfigured() {
  return true;
}

export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_BASE}/api/uploads/doctor-documents`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Cloudinary upload failed');
  }

  return data.document;
}
