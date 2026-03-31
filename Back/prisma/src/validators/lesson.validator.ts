import { z } from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(2, "Título deve ter no mínimo 2 caracteres"),
  project: z.string().min(1, "Projeto é obrigatório"),
  desc: z.string().min(1, "Descrição é obrigatória"),
});

export const updateLessonSchema = z.object({
  title: z.string().min(2).optional(),
  project: z.string().min(1).optional(),
  desc: z.string().min(1).optional(),
});
