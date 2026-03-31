import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2, "Título deve ter no mínimo 2 caracteres"),
  desc: z.string().optional().default(""),
  status: z.enum(["BACKLOG", "AFAZER", "PROGRESSO", "REVISAO", "CONCLUIDO"]).optional(),
  priority: z.enum(["CRITICA", "ALTA", "MEDIA", "BAIXA"]).optional(),
  tags: z.array(z.string()).optional().default([]),
  dueDate: z.string().datetime().nullable().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  desc: z.string().optional(),
  status: z.enum(["BACKLOG", "AFAZER", "PROGRESSO", "REVISAO", "CONCLUIDO"]).optional(),
  priority: z.enum(["CRITICA", "ALTA", "MEDIA", "BAIXA"]).optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

export const taskPrioritizationSchema = z.object({
  urgency: z.number().int().min(1).max(5),
  importance: z.number().int().min(1).max(5),
  value: z.number().int().min(1).max(10),
  effort: z.number().int().min(1).max(10),
  quadrant: z.enum(["FAZER", "AGENDAR", "DELEGAR", "ELIMINAR"]),
});

export const taskDependencySchema = z.object({
  targetTaskId: z.string().uuid("ID da tarefa dependência inválido"),
});
