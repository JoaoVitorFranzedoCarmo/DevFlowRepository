import appEmitter from "../events/event-emitter";
import { NotificationRepository, notificationRepository } from "../repositories/notification.repository";

const STATUS_LABELS: Record<string, string> = {
  BACKLOG: "Backlog",
  AFAZER: "A Fazer",
  PROGRESSO: "Em Progresso",
  REVISAO: "Em Revisão",
  CONCLUIDO: "Concluído",
};

// Observer — NotificationService é o "observer" (subscriber) do barramento appEmitter.
// TaskService (publisher) emite eventos sem saber que NotificationService existe;
// o acoplamento entre domínios é zero. Adicionar outro observer (ex: EmailService)
// não exige alterar TaskService — basta registrar novos listeners no appEmitter.
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
    taskId: number;
    taskTitle?: string;
    oldStatus: string;
    newStatus: string;
    assigneeId?: number | null;
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
    taskId: number;
    taskTitle?: string;
    assigneeId: number;
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
    taskId: number;
    taskTitle?: string;
    assigneeId: number;
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

  async feed(userId: number) {
    const items = await this.repo.findByUser(userId);
    const unreadCount = await this.repo.countUnread(userId);
    return { items, unreadCount };
  }

  async markRead(userId: number, id: number) {
    const n = await this.repo.findById(id);
    if (!n || n.userId !== userId) {
      throw new Error("Notificação não encontrada");
    }
    return this.repo.markRead(id);
  }

  async markAllRead(userId: number) {
    return this.repo.markAllRead(userId);
  }

  async findSettings(userId: number) {
    return this.repo.findSettingsByUser(userId);
  }

  async upsertSetting(userId: number, data: { eventKey: string; email: boolean; push: boolean }) {
    return this.repo.upsertSetting(userId, data);
  }

  async bulkUpsertSettings(
    userId: number,
    settings: Array<{ eventKey: string; email: boolean; push: boolean }>
  ) {
    const results = await Promise.all(settings.map((s) => this.repo.upsertSetting(userId, s)));
    return results;
  }
}

export const notificationService = new NotificationService();
