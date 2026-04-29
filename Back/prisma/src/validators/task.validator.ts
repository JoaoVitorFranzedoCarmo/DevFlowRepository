import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2, "Título deve ter no mínimo 2 caracteres"),
  desc: z.string().optional().default(""),
  status: z.enum(["BACKLOG", "AFAZER", "PROGRESSO", "REVISAO", "CONCLUIDO"]).optional(),
  priority: z.enum(["CRITICA", "ALTA", "MEDIA", "BAIXA"]).optional(),
  tags: z.array(z.string()).optional().default([]),
  dueDate: z.string().datetime().nullable().optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  estimatedHours: z.number().min(0).max(10000).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  desc: z.string().optional(),
  status: z.enum(["BACKLOG", "AFAZER", "PROGRESSO", "REVISAO", "CONCLUIDO"]).optional(),
  priority: z.enum(["CRITICA", "ALTA", "MEDIA", "BAIXA"]).optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  estimatedHours: z.number().min(0).max(10000).optional(),
});

export const taskPrioritizationSchema = z.object({
  urgency: z.number().int().min(1).max(5),
  importance: z.number().int().min(1).max(5),
  value: z.number().int().min(1).max(10),
  effort: z.number().int().min(1).max(10),
  quadrant: z.enum(["FAZER", "AGENDAR", "DELEGAR", "ELIMINAR"]),
});

export const taskDependencySchema = z.object({
  targetTaskId: z.number().int().positive("ID da tarefa dependência inválido"),
});

export const bulkDependenciesSchema = z.object({
  targetTaskIds: z.array(z.number().int().positive()),
});

export const moveTaskSchema = z.object({
  status: z.enum(["BACKLOG", "AFAZER", "PROGRESSO", "REVISAO", "CONCLUIDO"]),
});
