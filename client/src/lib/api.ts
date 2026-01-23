import type {
  CurriculumWithProgress,
  CurriculumDetail,
  Curriculum,
  Section,
  Item,
  CurriculumJSON,
} from '../../../shared/types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Curriculums
export const getCurriculums = () => fetchApi<CurriculumWithProgress[]>('/curriculums');

export const getCurriculum = (id: number) => fetchApi<CurriculumDetail>(`/curriculums/${id}`);

export const createCurriculum = (data: Partial<Curriculum>) =>
  fetchApi<Curriculum>('/curriculums', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateCurriculum = (id: number, data: Partial<Curriculum>) =>
  fetchApi<Curriculum>(`/curriculums/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteCurriculum = (id: number) =>
  fetchApi<void>(`/curriculums/${id}`, { method: 'DELETE' });

// Sections
export const createSection = (curriculumId: number, data: Partial<Section>) =>
  fetchApi<Section>(`/curriculums/${curriculumId}/sections`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateSection = (id: number, data: Partial<Section>) =>
  fetchApi<Section>(`/sections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteSection = (id: number) =>
  fetchApi<void>(`/sections/${id}`, { method: 'DELETE' });

// Items
export const createItem = (sectionId: number, data: Partial<Item>) =>
  fetchApi<Item>(`/sections/${sectionId}/items`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateItem = (id: number, data: Partial<Item>) =>
  fetchApi<Item>(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const cycleItemStatus = (id: number) =>
  fetchApi<Item>(`/items/${id}/status`, { method: 'PATCH' });

export const deleteItem = (id: number) =>
  fetchApi<void>(`/items/${id}`, { method: 'DELETE' });

// Import/Export
export const importCurriculum = (data: CurriculumJSON) =>
  fetchApi<{ message: string; id: number }>('/import', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const exportJSON = async () => {
  const response = await fetch(`${API_URL}/export/json`);
  if (!response.ok) throw new Error('Export failed');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'export.json';
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToraMemoryPack = async () => {
  const response = await fetch(`${API_URL}/export/tora`);
  if (!response.ok) throw new Error('Export failed');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'tora-memory-pack.zip';
  a.click();
  window.URL.revokeObjectURL(url);
};
