import { NotFoundError } from "../utils/errors";
import { IntegrationRepository, integrationRepository } from "../repositories/integration.repository";

export class IntegrationService {
  constructor(private repo: IntegrationRepository = integrationRepository) {}

  async findByUser(userId: string) {
    return this.repo.findByUser(userId);
  }

  async findById(id: string) {
    const integration = await this.repo.findUnique(id);
    if (!integration) throw new NotFoundError("Integração");
    return integration;
  }

  async create(userId: string, data: { name: string; desc: string; status?: string; icon?: string }) {
    return this.repo.create({
      name: data.name,
      desc: data.desc,
      status: data.status || "desconectado",
      icon: data.icon || "",
      userId,
    });
  }

  async update(id: string, data: Partial<{ status: string; desc: string }>) {
    await this.findById(id);
    return this.repo.update(id, data);
  }

  async toggle(id: string) {
    const integration = await this.findById(id);
    const newStatus = integration.status === "conectado" ? "desconectado" : "conectado";
    return this.repo.update(id, { status: newStatus });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repo.delete(id);
  }
}

export const integrationService = new IntegrationService();
