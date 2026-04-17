import prisma from "../config/database";
import appEmitter from "../events/event-emitter";

export class NotificationService {
  constructor() {
    this.registerListeners();
  }

  // Observer: escuta eventos de domínio e aciona notificações correspondentes
  private registerListeners(): void {
    appEmitter.removeAllListeners("task:status_changed");
    appEmitter.on(
      "task:status_changed",
      (event: { taskId: string; oldStatus: string; newStatus: string; assigneeId?: string | null }) => {
        this.handleTaskStatusChanged(event).catch((err) => {
          console.error("[NotificationService] Erro ao processar task:status_changed:", err);
        });
      }
    );
  }

  private async handleTaskStatusChanged(event: {
    taskId: string;
    oldStatus: string;
    newStatus: string;
    assigneeId?: string | null;
  }): Promise<void> {
    const settingsToNotify = await prisma.notificationSetting.findMany({
      where: { eventKey: "task:status_changed", push: true },
    });

    if (settingsToNotify.length === 0) return;

    const userIds = settingsToNotify.map((s) => s.userId);
    console.log(
      `[NotificationService] task:status_changed — task=${event.taskId} ` +
        `${event.oldStatus} → ${event.newStatus} — push para users: [${userIds.join(", ")}]`
    );
  }

  async findByUser(userId: string) {
    return prisma.notificationSetting.findMany({
      where: { userId },
      orderBy: { eventKey: "asc" },
    });
  }

  async upsert(userId: string, data: { eventKey: string; email: boolean; push: boolean }) {
    return prisma.notificationSetting.upsert({
      where: {
        userId_eventKey: { userId, eventKey: data.eventKey },
      },
      create: {
        userId,
        eventKey: data.eventKey,
        email: data.email,
        push: data.push,
      },
      update: {
        email: data.email,
        push: data.push,
      },
    });
  }

  async bulkUpsert(userId: string, settings: Array<{ eventKey: string; email: boolean; push: boolean }>) {
    const results = await Promise.all(settings.map((s) => this.upsert(userId, s)));
    return results;
  }
}

export const notificationService = new NotificationService();
