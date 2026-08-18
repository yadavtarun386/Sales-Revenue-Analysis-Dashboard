const API_BASE = '/api';

async function fetchJson(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `API Request failed with status ${response.status}`);
  }

  return response.json();
}

export const apiService = {
  getFilters: () => fetchJson('/filters'),
  getKPIs: (filters) => fetchJson('/kpis', { method: 'POST', body: JSON.stringify(filters) }),
  getTrends: (filters) => fetchJson('/trends', { method: 'POST', body: JSON.stringify(filters) }),
  getCategories: (filters) => fetchJson('/categories', { method: 'POST', body: JSON.stringify(filters) }),
  getProducts: (filters) => fetchJson('/products', { method: 'POST', body: JSON.stringify(filters) }),
  getRegions: (filters) => fetchJson('/regions', { method: 'POST', body: JSON.stringify(filters) }),
  getChannels: (filters) => fetchJson('/channels', { method: 'POST', body: JSON.stringify(filters) }),
  getCustomers: (filters) => fetchJson('/customers', { method: 'POST', body: JSON.stringify(filters) }),
  getEDA: (filters) => fetchJson('/eda', { method: 'POST', body: JSON.stringify(filters) }),
  getInsights: (filters) => fetchJson('/insights', { method: 'POST', body: JSON.stringify(filters) }),
  getQuality: () => fetchJson('/quality', { method: 'POST' }),
  getTableData: (tableReq) => fetchJson('/table', { method: 'POST', body: JSON.stringify(tableReq) }),
  reloadSample: () => fetchJson('/reload-sample', { method: 'POST' }),

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Upload failed with status ${response.status}`);
    }
    return response.json();
  },

  exportData: async (filters, exportFormat) => {
    const response = await fetch(`${API_BASE}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters, export_format: exportFormat }),
    });

    if (!response.ok) {
      throw new Error(`Export failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const extensions = { csv: 'csv', excel: 'xlsx', pdf: 'pdf' };
    a.download = `sales_report_${new Date().toISOString().slice(0, 10)}.${extensions[exportFormat] || 'file'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};
