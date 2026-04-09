import { z } from "zod";

export const upsertNotificationSchema = z.object({
  eventKey: z.string().min(1, "Chave do evento é obrigatória"),
  email: z.boolean(),
  push: z.boolean(),
});

export const bulkNotificationSchema = z.object({
  settings: z
    .array(upsertNotificationSchema)
    .min(1, "Pelo menos uma configuração é necessária")
    .max(100, "Máximo de 100 configurações por requisição"),
});
