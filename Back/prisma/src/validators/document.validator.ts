import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(2, "Título deve ter no mínimo 2 caracteres"),
  type: z.enum(["OPENAPI", "TECNICA", "MANUAL"]).optional(),
  format: z.enum(["HTML", "PDF", "MARKDOWN"]).optional(),
  version: z.string().optional(),
  codeVersion: z.string().optional(),
  status: z.enum(["ATUALIZADO", "DESATUALIZADO", "RASCUNHO"]).optional(),
  pages: z.number().int().min(0).optional(),
  sourceCode: z.string().optional(),
  content: z.string().optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(2).optional(),
  type: z.enum(["OPENAPI", "TECNICA", "MANUAL"]).optional(),
  format: z.enum(["HTML", "PDF", "MARKDOWN"]).optional(),
  version: z.string().optional(),
  codeVersion: z.string().optional(),
  status: z.enum(["ATUALIZADO", "DESATUALIZADO", "RASCUNHO"]).optional(),
  pages: z.number().int().min(0).optional(),
  sourceCode: z.string().optional(),
  content: z.string().optional(),
});

export const createDocVersionSchema = z.object({
  version: z.string().min(1, "Versão é obrigatória"),
  commit: z.string().optional().default(""),
  changes: z.string().min(1, "Descrição das mudanças é obrigatória"),
  author: z.string().optional(),
  content: z.string().optional(),
});

export const generateDocSchema = z.object({
  sourceCode: z.string().optional(),
  format: z.enum(["HTML", "PDF", "MARKDOWN"]).optional(),
  commit: z.string().optional(),
  changes: z.string().optional(),
});
