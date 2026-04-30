import { z } from "zod";

export const createTemplateSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  desc: z.string().min(1, "Descrição é obrigatória"),
  icon: z.string().optional().default("code"),
});

export const updateTemplateSchema = z.object({
  name: z.string().min(2).optional(),
  desc: z.string().min(1).optional(),
  icon: z.string().optional(),
  uses: z.number().int().min(0).optional(),
});
