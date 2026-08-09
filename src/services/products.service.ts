import type { ProductFormValues } from "@/lib/validations/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    throw new Error("Erro ao comunicar com o servidor.");
  }

  return res.json();
}

export const productsService = {
  async list() {
    return apiRequest("/products");
  },

  async create(data: ProductFormValues) {
    return apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<ProductFormValues>) {
    return apiRequest(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async remove(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao remover produto");
    }

    if (response.status === 204) return null;

    return response.json();
  },

  async addStock(id: string, qty: number) {
    return apiRequest(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ qty }),
    });
  },
};
