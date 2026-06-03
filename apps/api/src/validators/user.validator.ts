import { z } from "zod";
import { Role } from "@devflow/types";

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
  avatar: z.string().nullable().optional(),
});
