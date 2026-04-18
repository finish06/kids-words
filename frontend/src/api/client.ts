import type {
  CategoryListResponse,
  CategoryProgressResponse,
  CategoryWordsResponse,
  MatchResultCreate,
  MatchResultResponse,
  ProfileListResponse,
  Profile,
  RoundResponse,
  WordBuilderAttempt,
  WordBuilderProgressResponse,
  WordBuilderResultResponse,
} from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

let activeProfileId: string | null = null;

export function setActiveProfile(profileId: string | null) {
  activeProfileId = profileId;
}

export function getActiveProfileId(): string | null {
  return activeProfileId;
}

function profileHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (activeProfileId) {
    headers["X-Profile-ID"] = activeProfileId;
  }
  return headers;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: profileHeaders(),
    ...init,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// Categories
export async function getCategories(): Promise<CategoryListResponse> {
  return fetchJson<CategoryListResponse>("/api/categories");
}

export async function getCategoryWords(
  slug: string,
): Promise<CategoryWordsResponse> {
  return fetchJson<CategoryWordsResponse>(`/api/categories/${slug}/words`);
}

// Results
export async function postResult(
  data: MatchResultCreate,
): Promise<MatchResultResponse> {
  return fetchJson<MatchResultResponse>("/api/results", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Profiles
export async function getProfiles(): Promise<ProfileListResponse> {
  return fetchJson<ProfileListResponse>("/api/profiles");
}

export async function setupPin(pin: string): Promise<void> {
  await fetchJson("/api/profiles/setup", {
    method: "POST",
    body: JSON.stringify({ pin }),
  });
}

export async function verifyPin(pin: string): Promise<boolean> {
  try {
    const data = await fetchJson<{ verified: boolean }>(
      "/api/profiles/verify-pin",
      { method: "POST", body: JSON.stringify({ pin }) },
    );
    return data.verified;
  } catch {
    return false;
  }
}

export async function createProfile(
  name: string,
  color: string,
  pin: string,
): Promise<Profile> {
  return fetchJson<Profile>("/api/profiles", {
    method: "POST",
    body: JSON.stringify({ name, color, pin }),
  });
}

export async function updateProfile(
  id: string,
  name: string,
  color: string,
  pin: string,
): Promise<Profile> {
  return fetchJson<Profile>(`/api/profiles/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, color, pin }),
  });
}

export async function deleteProfile(
  id: string,
  pin: string,
): Promise<void> {
  await fetch(`${API_BASE}/api/profiles/${id}`, {
    method: "DELETE",
    headers: profileHeaders(),
    body: JSON.stringify({ pin }),
  });
}

// Progress
export async function getCategoryProgress(
  slug: string,
): Promise<CategoryProgressResponse> {
  return fetchJson<CategoryProgressResponse>(`/api/progress/${slug}`);
}

// Word Builder (M7)

export async function getWordBuilderRound(
  count: number,
  level?: number,
): Promise<RoundResponse> {
  const params = new URLSearchParams({ count: String(count) });
  if (level !== undefined) params.set("level", String(level));
  return fetchJson<RoundResponse>(
    `/api/word-builder/round?${params.toString()}`,
  );
}

export async function postWordBuilderResult(
  attempt: WordBuilderAttempt,
): Promise<WordBuilderResultResponse> {
  return fetchJson<WordBuilderResultResponse>("/api/word-builder/results", {
    method: "POST",
    body: JSON.stringify(attempt),
  });
}

export async function getWordBuilderProgress(): Promise<WordBuilderProgressResponse> {
  return fetchJson<WordBuilderProgressResponse>("/api/word-builder/progress");
}
