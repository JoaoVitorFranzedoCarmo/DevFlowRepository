import { z } from "zod";

export const createIntegrationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  desc: z.string().min(1, "Descrição é obrigatória"),
  status: z.enum(["conectado", "desconectado"]).optional().default("desconectado"),
  icon: z.string().optional().default(""),
});

export const updateIntegrationSchema = z.object({
  status: z.enum(["conectado", "desconectado"]).optional(),
  desc: z.string().min(1).optional(),
});
