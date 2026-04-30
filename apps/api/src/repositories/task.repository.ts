import prisma from "../config/database";

export const taskInclude = {
  assignee: {
    select: { id: true, name: true, avatar: true },
  },
  prioritization: true,
  dependsOn: {
    include: {
      targetTask: {
        select: { id: true, title: true, status: true },
      },
    },
  },
  dependedBy: {
    include: {
      sourceTask: {
        select: { id: true, title: true, status: true },
      },
    },
  },
} as const;

export class TaskRepository {
  async findMany(
    where: Record<string, unknown> = {},
    orderBy: Record<string, unknown> = { createdAt: "desc" }
  ) {
    return prisma.task.findMany({
      where: where as any,
      include: taskInclude,
      orderBy: orderBy as any,
    });
  }

  async findUnique(id: number) {
    return prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });
  }

  async create(data: Record<string, unknown>) {
    return prisma.task.create({ data: data as any, include: taskInclude });
  }

  async update(id: number, data: Record<string, unknown>) {
    return prisma.task.update({
      where: { id },
      data: data as any,
      include: taskInclude,
    });
  }

  async delete(id: number) {
    return prisma.task.delete({ where: { id } });
  }

  async countAll() {
    return prisma.task.count();
  }

  async groupByStatus() {
    return prisma.task.groupBy({ by: ["status"], _count: true });
  }

  async groupByPriority() {
    return prisma.task.groupBy({ by: ["priority"], _count: true });
  }

  async groupByAssignee() {
    return prisma.task.groupBy({
      by: ["assigneeId"],
      _count: true,
      _sum: { estimatedHours: true },
    });
  }

  async upsertPrioritization(
    taskId: number,
    data: { urgency: number; importance: number; value: number; effort: number; quadrant: any }
  ) {
    return prisma.taskPrioritization.upsert({
      where: { taskId },
      create: { taskId, ...data },
      update: { ...data },
    });
  }

  async findManyWithPrioritization() {
    return prisma.task.findMany({
      where: { prioritization: { isNot: null } },
      include: taskInclude,
    });
  }

  async findDependencies(sourceTaskId: number) {
    return prisma.taskDependency.findMany({ where: { sourceTaskId } });
  }

  async createDependency(sourceTaskId: number, targetTaskId: number) {
    return prisma.taskDependency.create({
      data: { sourceTaskId, targetTaskId },
      include: {
        targetTask: { select: { id: true, title: true, status: true } },
      },
    });
  }

  async deleteDependencies(sourceTaskId: number, targetTaskId: number) {
    return prisma.taskDependency.deleteMany({
      where: { sourceTaskId, targetTaskId },
    });
  }

  async deleteAllDependenciesOfSource(sourceTaskId: number) {
    return prisma.taskDependency.deleteMany({ where: { sourceTaskId } });
  }

  async findTasksDueSoon(hours: number) {
    const now = new Date();
    const limit = new Date(Date.now() + hours * 60 * 60 * 1000);
    return prisma.task.findMany({
      where: {
        dueDate: { gte: now, lte: limit },
        status: { notIn: ["CONCLUIDO"] },
        assigneeId: { not: null },
      },
      include: taskInclude,
    });
  }
}

export const taskRepository = new TaskRepository();
