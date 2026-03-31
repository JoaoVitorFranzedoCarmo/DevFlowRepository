import prisma from "../config/database";
import { BadRequestError, NotFoundError } from "../utils/errors";

const taskInclude = {
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
};

export class TaskService {
  async findAll(filters?: {
    status?: string;
    priority?: string;
    assigneeId?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { desc: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });
    if (!task) throw new NotFoundError("Tarefa");
    return task;
  }

  async findByStatus() {
    const tasks = await prisma.task.findMany({
      include: taskInclude,
      orderBy: { createdAt: "asc" },
    });

    const columns: Record<string, any[]> = {
      BACKLOG: [],
      AFAZER: [],
      PROGRESSO: [],
      REVISAO: [],
      CONCLUIDO: [],
    };

    tasks.forEach((task) => {
      columns[task.status].push(task);
    });

    return columns;
  }

  async create(data: {
    title: string;
    desc?: string;
    status?: string;
    priority?: string;
    tags?: string[];
    dueDate?: string | null;
    assigneeId?: string | null;
  }) {
    return prisma.task.create({
      data: {
        title: data.title,
        desc: data.desc || "",
        status: (data.status as any) || "BACKLOG",
        priority: (data.priority as any) || "MEDIA",
        tags: data.tags || [],
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assigneeId: data.assigneeId || null,
      },
      include: taskInclude,
    });
  }

  async update(id: string, data: Partial<{
    title: string;
    desc: string;
    status: string;
    priority: string;
    tags: string[];
    dueDate: string | null;
    assigneeId: string | null;
  }>) {
    await this.findById(id);

    const updateData: any = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;

    return prisma.task.update({
      where: { id },
      data: updateData,
      include: taskInclude,
    });
  }

  async moveTask(id: string, status: string) {
    await this.findById(id);
    return prisma.task.update({
      where: { id },
      data: { status: status as any },
      include: taskInclude,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.task.delete({ where: { id } });
  }

  // Prioritization
  async setPrioritization(taskId: string, data: {
    urgency: number;
    importance: number;
    value: number;
    effort: number;
    quadrant: string;
  }) {
    await this.findById(taskId);

    return prisma.taskPrioritization.upsert({
      where: { taskId },
      create: {
        taskId,
        urgency: data.urgency,
        importance: data.importance,
        value: data.value,
        effort: data.effort,
        quadrant: data.quadrant as any,
      },
      update: {
        urgency: data.urgency,
        importance: data.importance,
        value: data.value,
        effort: data.effort,
        quadrant: data.quadrant as any,
      },
    });
  }

  async getPrioritizedTasks() {
    const tasks = await prisma.task.findMany({
      where: {
        prioritization: { isNot: null },
      },
      include: taskInclude,
    });

    return tasks.map((task) => {
      const p = task.prioritization;
      const score = p
        ? Math.round(((p.value * p.importance * p.urgency) / Math.max(p.effort, 1)) * 10) / 10
        : 0;
      return { ...task, score };
    }).sort((a, b) => b.score - a.score);
  }

  // Dependencies
  async addDependency(sourceTaskId: string, targetTaskId: string) {
    if (sourceTaskId === targetTaskId) {
      throw new BadRequestError("Uma tarefa não pode depender de si mesma");
    }

    await this.findById(sourceTaskId);
    await this.findById(targetTaskId);

    // Check for circular dependency
    const targetDeps = await prisma.taskDependency.findMany({
      where: { sourceTaskId: targetTaskId },
    });
    if (targetDeps.some((d) => d.targetTaskId === sourceTaskId)) {
      throw new BadRequestError("Dependência circular detectada");
    }

    return prisma.taskDependency.create({
      data: { sourceTaskId, targetTaskId },
      include: {
        targetTask: {
          select: { id: true, title: true, status: true },
        },
      },
    });
  }

  async removeDependency(sourceTaskId: string, targetTaskId: string) {
    await prisma.taskDependency.deleteMany({
      where: { sourceTaskId, targetTaskId },
    });
  }

  // Dashboard stats
  async getDashboardStats() {
    const total = await prisma.task.count();
    const byStatus = await prisma.task.groupBy({
      by: ["status"],
      _count: true,
    });
    const byPriority = await prisma.task.groupBy({
      by: ["priority"],
      _count: true,
    });

    const statusMap: Record<string, number> = {};
    byStatus.forEach((s) => { statusMap[s.status] = s._count; });

    const priorityMap: Record<string, number> = {};
    byPriority.forEach((p) => { priorityMap[p.priority] = p._count; });

    return {
      total,
      completed: statusMap["CONCLUIDO"] || 0,
      pending: (statusMap["AFAZER"] || 0) + (statusMap["BACKLOG"] || 0),
      inProgress: statusMap["PROGRESSO"] || 0,
      inReview: statusMap["REVISAO"] || 0,
      byStatus: statusMap,
      byPriority: priorityMap,
    };
  }
}

export const taskService = new TaskService();
