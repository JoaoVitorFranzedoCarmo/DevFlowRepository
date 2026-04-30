import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["GERENTE", "LIDER", "DESENVOLVEDOR", "QA"]).optional(),
  avatar: z.string().nullable().optional(),
});
