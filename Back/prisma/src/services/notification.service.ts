import appEmitter from "../events/event-emitter";
import { NotificationRepository, notificationRepository } from "../repositories/notification.repository";

const STATUS_LABELS: Record<string, string> = {
  BACKLOG: "Backlog",
  AFAZER: "A Fazer",
  PROGRESSO: "Em Progresso",
  REVISAO: "Em Revisão",
  CONCLUIDO: "Concluído",
};

export class NotificationService {
  constructor(private repo: NotificationRepository = notificationRepository) {
    this.registerListeners();
  }

  private registerListeners(): void {
    appEmitter.removeAllListeners("task:status_changed");
    appEmitter.removeAllListeners("task:assigned");
    appEmitter.removeAllListeners("task:due_soon");

    appEmitter.on("task:status_changed", (event: any) => {
      this.handleTaskStatusChanged(event).catch((err) =>
        console.error("[NotificationService] task:status_changed erro:", err)
      );
    });

    appEmitter.on("task:assigned", (event: any) => {
      this.handleTaskAssigned(event).catch((err) =>
        console.error("[NotificationService] task:assigned erro:", err)
      );
    });

    appEmitter.on("task:due_soon", (event: any) => {
      this.handleTaskDueSoon(event).catch((err) =>
        console.error("[NotificationService] task:due_soon erro:", err)
      );
    });
  }

  private async handleTaskStatusChanged(event: {
    taskId: string;
    taskTitle?: string;
    oldStatus: string;
    newStatus: string;
    assigneeId?: string | null;
  }): Promise<void> {
    if (!event.assigneeId) return;
    const title = event.taskTitle || "tarefa";
    const oldLbl = STATUS_LABELS[event.oldStatus] || event.oldStatus;
    const newLbl = STATUS_LABELS[event.newStatus] || event.newStatus;

    await this.repo.create({
      userId: event.assigneeId,
      type: "task:status_changed",
      message: `Tarefa "${title}" moveu de ${oldLbl} para ${newLbl}`,
      link: `/kanban?task=${event.taskId}`,
    });
  }

  private async handleTaskAssigned(event: {
    taskId: string;
    taskTitle?: string;
    assigneeId: string;
  }): Promise<void> {
    if (!event.assigneeId) return;
    await this.repo.create({
      userId: event.assigneeId,
      type: "task:assigned",
      message: `Você foi atribuído à tarefa "${event.taskTitle || "sem título"}"`,
      link: `/kanban?task=${event.taskId}`,
    });
  }

  private async handleTaskDueSoon(event: {
    taskId: string;
    taskTitle?: string;
    assigneeId: string;
    dueDate?: Date | null;
  }): Promise<void> {
    if (!event.assigneeId) return;
    const due = event.dueDate ? new Date(event.dueDate).toLocaleString("pt-BR") : "em breve";
    await this.repo.create({
      userId: event.assigneeId,
      type: "task:due_soon",
      message: `Tarefa "${event.taskTitle}" vence em ${due}`,
      link: `/kanban?task=${event.taskId}`,
    });
  }

  async feed(userId: string) {
    const items = await this.repo.findByUser(userId);
    const unreadCount = await this.repo.countUnread(userId);
    return { items, unreadCount };
  }

  async markRead(userId: string, id: string) {
    const n = await this.repo.findById(id);
    if (!n || n.userId !== userId) {
      throw new Error("Notificação não encontrada");
    }
    return this.repo.markRead(id);
  }

  async markAllRead(userId: string) {
    return this.repo.markAllRead(userId);
  }

  // Settings (para back-compat)
  async findSettings(userId: string) {
    return this.repo.findSettingsByUser(userId);
  }

  async upsertSetting(userId: string, data: { eventKey: string; email: boolean; push: boolean }) {
    return this.repo.upsertSetting(userId, data);
  }

  async bulkUpsertSettings(
    userId: string,
    settings: Array<{ eventKey: string; email: boolean; push: boolean }>
  ) {
    const results = await Promise.all(settings.map((s) => this.repo.upsertSetting(userId, s)));
    return results;
  }
}

export const notificationService = new NotificationService();
