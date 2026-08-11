const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Erro ao comunicar com o servidor.");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
