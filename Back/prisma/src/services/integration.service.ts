import prisma from "../config/database";
import { NotFoundError } from "../utils/errors";

export class IntegrationService {
  async findByUser(userId: string) {
    return prisma.integration.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    const integration = await prisma.integration.findUnique({ where: { id } });
    if (!integration) throw new NotFoundError("Integração");
    return integration;
  }

  async create(userId: string, data: { name: string; desc: string; status?: string; icon?: string }) {
    return prisma.integration.create({
      data: {
        name: data.name,
        desc: data.desc,
        status: data.status || "desconectado",
        icon: data.icon || "",
        userId,
      },
    });
  }

  async update(id: string, data: Partial<{ status: string; desc: string }>) {
    await this.findById(id);
    return prisma.integration.update({ where: { id }, data });
  }

  async toggle(id: string) {
    const integration = await this.findById(id);
    const newStatus = integration.status === "conectado" ? "desconectado" : "conectado";
    return prisma.integration.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.integration.delete({ where: { id } });
  }
}

export const integrationService = new IntegrationService();
