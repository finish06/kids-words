import type {
  CategoryListResponse,
  CategoryWordsResponse,
  MatchResultCreate,
  MatchResultResponse,
} from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getCategories(): Promise<CategoryListResponse> {
  return fetchJson<CategoryListResponse>("/api/categories");
}

export async function getCategoryWords(
  slug: string,
): Promise<CategoryWordsResponse> {
  return fetchJson<CategoryWordsResponse>(`/api/categories/${slug}/words`);
}

export async function postResult(
  data: MatchResultCreate,
): Promise<MatchResultResponse> {
  return fetchJson<MatchResultResponse>("/api/results", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
