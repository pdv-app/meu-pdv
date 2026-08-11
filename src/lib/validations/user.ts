import z from "zod";

const userFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().optional(),
  groupId: z.string().min(1, "Selecione um grupo de acesso"),
  active: z.boolean(),
});

export type UserFormData = z.infer<typeof userFormSchema>;
