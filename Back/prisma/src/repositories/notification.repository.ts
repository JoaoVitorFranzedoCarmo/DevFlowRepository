import prisma from "../config/database";

export class NotificationRepository {
  async create(data: {
    userId: string;
    type: string;
    message: string;
    link?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        link: data.link || "",
      },
    });
  }

  async createMany(items: Array<{ userId: string; type: string; message: string; link?: string }>) {
    if (items.length === 0) return { count: 0 };
    return prisma.notification.createMany({
      data: items.map((i) => ({
        userId: i.userId,
        type: i.type,
        message: i.message,
        link: i.link || "",
      })),
    });
  }

  async findByUser(userId: string, limit = 30) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: [{ read: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  }

  async countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, read: false } });
  }

  async markRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  }

  // Notification settings
  async findSettingsByUser(userId: string) {
    return prisma.notificationSetting.findMany({
      where: { userId },
      orderBy: { eventKey: "asc" },
    });
  }

  async upsertSetting(userId: string, data: { eventKey: string; email: boolean; push: boolean }) {
    return prisma.notificationSetting.upsert({
      where: { userId_eventKey: { userId, eventKey: data.eventKey } },
      create: {
        userId,
        eventKey: data.eventKey,
        email: data.email,
        push: data.push,
      },
      update: { email: data.email, push: data.push },
    });
  }

  async findPushSettingsByEvent(eventKey: string) {
    return prisma.notificationSetting.findMany({
      where: { eventKey, push: true },
    });
  }
}

export const notificationRepository = new NotificationRepository();
