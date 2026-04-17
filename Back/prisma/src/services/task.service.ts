import { BadRequestError, NotFoundError } from "../utils/errors";
import { TaskRepository, taskRepository } from "../repositories/task.repository";
import { PrioritizationStrategy, WSJFStrategy } from "../strategies/prioritization.strategy";
import appEmitter from "../events/event-emitter";

export class TaskService {
  constructor(
    private repo: TaskRepository = taskRepository,
    private prioritizationStrategy: PrioritizationStrategy = new WSJFStrategy()
  ) {}

  setPrioritizationStrategy(strategy: PrioritizationStrategy): void {
    this.prioritizationStrategy = strategy;
  }

  async findAll(filters?: {
    status?: string;
    priority?: string;
    assigneeId?: string;
    search?: string;
  }) {
    const where: Record<string, unknown> = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { desc: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return this.repo.findMany(where);
  }

  async findById(id: string) {
    const task = await this.repo.findUnique(id);
    if (!task) throw new NotFoundError("Tarefa");
    return task;
  }

  async findByStatus() {
    const tasks = await this.repo.findMany({}, { createdAt: "asc" });

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
    return this.repo.create({
      title: data.title,
      desc: data.desc || "",
      status: (data.status as any) || "BACKLOG",
      priority: (data.priority as any) || "MEDIA",
      tags: data.tags || [],
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assigneeId: data.assigneeId || null,
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

    const updateData: Record<string, unknown> = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;

    return this.repo.update(id, updateData);
  }

  async moveTask(id: string, status: string) {
    const task = await this.findById(id);
    const oldStatus = task.status;
    const updated = await this.repo.update(id, { status: status as any });

    // Observer: notifica listeners sobre mudança de status
    appEmitter.emit("task:status_changed", {
      taskId: id,
      oldStatus,
      newStatus: status,
      assigneeId: task.assigneeId,
    });

    return updated;
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repo.delete(id);
  }

  async setPrioritization(taskId: string, data: {
    urgency: number;
    importance: number;
    value: number;
    effort: number;
    quadrant: string;
  }) {
    await this.findById(taskId);
    return this.repo.upsertPrioritization(taskId, data as any);
  }

  async getPrioritizedTasks() {
    const tasks = await this.repo.findManyWithPrioritization();

    return tasks.map((task) => {
      const p = task.prioritization;
      const score = p ? this.prioritizationStrategy.score(p) : 0;
      return { ...task, score, strategy: this.prioritizationStrategy.name };
    }).sort((a, b) => b.score - a.score);
  }

  async addDependency(sourceTaskId: string, targetTaskId: string) {
    if (sourceTaskId === targetTaskId) {
      throw new BadRequestError("Uma tarefa não pode depender de si mesma");
    }

    await this.findById(sourceTaskId);
    await this.findById(targetTaskId);

    const targetDeps = await this.repo.findDependencies(targetTaskId);
    if (targetDeps.some((d) => d.targetTaskId === sourceTaskId)) {
      throw new BadRequestError("Dependência circular detectada");
    }

    return this.repo.createDependency(sourceTaskId, targetTaskId);
  }

  async removeDependency(sourceTaskId: string, targetTaskId: string) {
    await this.repo.deleteDependencies(sourceTaskId, targetTaskId);
  }

  async getDashboardStats() {
    const total = await this.repo.countAll();
    const byStatus = await this.repo.groupByStatus();
    const byPriority = await this.repo.groupByPriority();

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
