import { apiRequest } from "@/lib/api-request";

export const categoriesService = {
  async list() {
    return apiRequest("/categories");
  },
};
