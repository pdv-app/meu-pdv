export const categoriesService = {
  async list() {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Erro ao buscar categorias");
    return res.json();
  },
};
