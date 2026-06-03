import { ForbiddenError } from "./errors";
import { Role } from "@devflow/types";

export function assertOwnership(
  resourceOwnerId: string,
  userId: string,
  role: string,
  message = "Acesso negado: você não é o proprietário deste recurso"
): void {
  if (resourceOwnerId !== userId && role !== Role.GERENTE) {
    throw new ForbiddenError(message);
  }
}
