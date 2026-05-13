import { PrismaClient } from "@prisma/client";

// Singleton — garante um único PrismaClient (e portanto um único connection pool) em toda a aplicação.
// Sem isso, cada módulo que importasse "new PrismaClient()" abriria seu próprio pool, esgotando
// conexões do PostgreSQL rapidamente. Em dev, ts-node-dev recarrega módulos a cada mudança;
// globalThis persiste entre reloads e impede que o pool seja recriado desnecessariamente.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
