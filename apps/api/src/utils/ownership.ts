import { ForbiddenError } from "./errors";

/**
 * Verifica se o usuário tem permissão de modificar/excluir o recurso.
 * Lança ForbiddenError se negar.
 */
export function assertOwnership(
  resourceOwnerId: string,
  userId: string,
  role: string,
  message = "Acesso negado: você não é o proprietário deste recurso"
): void {
  if (resourceOwnerId !== userId && role !== "GERENTE") {
    throw new ForbiddenError(message);
  }
}
