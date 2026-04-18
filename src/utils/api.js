const API_URL = 'http://localhost:3001';

const request = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('İstek zaman aşımına uğradı');
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};

export const syncClientToApi = async (clientData, method = 'POST') => {
  const url = method === 'POST'
    ? `${API_URL}/musteriler`
    : `${API_URL}/musteriler/${clientData.id}`;

  await request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData),
  });
};

export const deleteClientFromApi = async (id) => {
  await request(`${API_URL}/musteriler/${id}`, { method: 'DELETE' });
};
