import { Address, Client } from "@/prisma/client";
import { ClientWithAddress } from "@/types";

// Atualizamos a tipagem para incluir o address que o formulário envia
export type ClientPayload = Omit<Client, "id" | "createdAt" | "updatedAt"> & {
  address?: Address; // ou a tipagem específica AddressData se você tiver exportada
};

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

export const clientsService = {
  async list(): Promise<ClientWithAddress[]> {
    return apiRequest<ClientWithAddress[]>("/clients");
  },

  async create(data: ClientPayload): Promise<ClientWithAddress> {
    return apiRequest<ClientWithAddress>("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: Partial<ClientPayload>,
  ): Promise<ClientWithAddress> {
    return apiRequest<ClientWithAddress>(`/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async remove(id: string) {
    const response = await fetch(`/api/clients/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao remover cliente");
    }

    // Se for 204 (No Content), não tente ler o .json() pois o corpo está vazio
    if (response.status === 204) return null;

    return response.json();
  },
};
