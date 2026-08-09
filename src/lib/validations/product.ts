import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter no mínimo 2 caracteres"),
  active: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2, "O nome do produto é obrigatório"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  description: z.string().optional().nullable(),
  costPrice: z.coerce.number().min(0, "O preço não pode ser negativo"),
  salePrice: z.coerce.number().min(0, "O preço não pode ser negativo"),
  stock: z.coerce.number().int().min(0, "O estoque não pode ser negativo"),
  minStock: z.coerce
    .number()
    .int()
    .min(0, "O estoque mínimo não pode ser negativo"),
  notes: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
