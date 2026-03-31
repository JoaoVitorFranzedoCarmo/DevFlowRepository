import prisma from "../config/database";

export class NotificationService {
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
    const results = await Promise.all(
      settings.map((s) => this.upsert(userId, s))
    );
    return results;
  }
}

export const notificationService = new NotificationService();
