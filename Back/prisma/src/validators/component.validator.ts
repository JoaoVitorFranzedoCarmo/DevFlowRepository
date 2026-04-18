import { z } from "zod";

export const createComponentSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  desc: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  lang: z.string().min(1, "Linguagem é obrigatória"),
  tags: z.array(z.string()).optional().default([]),
  codeSnippet: z.string().min(1, "Trecho de código é obrigatório"),
});

export const updateComponentSchema = z.object({
  name: z.string().min(2).optional(),
  desc: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  lang: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  uses: z.number().int().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
  codeSnippet: z.string().optional(),
});
