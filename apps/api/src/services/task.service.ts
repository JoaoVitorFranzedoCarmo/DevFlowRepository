import { BadRequestError, NotFoundError } from "../utils/errors";
import { TaskRepository, taskRepository } from "../repositories/task.repository";
import { PrioritizationStrategy, WSJFStrategy } from "../strategies/prioritization.strategy";
import appEmitter from "../events/event-emitter";
import { SystemConfigRepository, systemConfigRepository } from "../repositories/system-config.repository";

const COMPLEXITY_BY_PRIORITY: Record<string, number> = {
  CRITICA: 4,
  ALTA: 3,
  MEDIA: 2,
  BAIXA: 1,
};

export class TaskService {
  constructor(
    private repo: TaskRepository = taskRepository,
    private config: SystemConfigRepository = systemConfigRepository,
    private prioritizationStrategy: PrioritizationStrategy = new WSJFStrategy()
  ) {}

  setPrioritizationStrategy(strategy: PrioritizationStrategy): void {
    this.prioritizationStrategy = strategy;
  }

  async findAll(filters?: {
    status?: string;
    priority?: string;
    assigneeId?: number;
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

  async findById(id: number) {
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
    tasks.forEach((t) => { columns[t.status].push(t); });
    return columns;
  }

  async create(data: {
    title: string;
    desc?: string;
    status?: string;
    priority?: string;
    tags?: string[];
    dueDate?: string | null;
    assigneeId?: number | null;
    estimatedHours?: number;
  }) {
    const task = await this.repo.create({
      title: data.title,
      desc: data.desc || "",
      status: (data.status as any) || "BACKLOG",
      priority: (data.priority as any) || "MEDIA",
      tags: data.tags || [],
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assigneeId: data.assigneeId || null,
      estimatedHours: data.estimatedHours ?? 2,
    });

    if (task.assigneeId) {
      appEmitter.emit("task:assigned", {
        taskId: task.id,
        taskTitle: task.title,
        assigneeId: task.assigneeId,
      });
    }
    return task;
  }

  async update(id: number, data: Partial<{
    title: string;
    desc: string;
    status: string;
    priority: string;
    tags: string[];
    dueDate: string | null;
    assigneeId: number | null;
    estimatedHours: number;
  }>) {
    const current = await this.findById(id);

    const updateData: Record<string, unknown> = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const updated = await this.repo.update(id, updateData);

    if (data.assigneeId !== undefined && data.assigneeId !== current.assigneeId && data.assigneeId) {
      appEmitter.emit("task:assigned", {
        taskId: id,
        taskTitle: updated.title,
        assigneeId: data.assigneeId,
      });
    }
    return updated;
  }

  async moveTask(id: number, status: string) {
    const task = await this.findById(id);
    const oldStatus = task.status;
    const updated = await this.repo.update(id, { status: status as any });

    appEmitter.emit("task:status_changed", {
      taskId: id,
      taskTitle: task.title,
      oldStatus,
      newStatus: status,
      assigneeId: task.assigneeId,
    });

    return updated;
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repo.delete(id);
  }

  async setPrioritization(taskId: number, data: {
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
    return tasks
      .map((task) => {
        const p = task.prioritization;
        const score = p ? this.prioritizationStrategy.score(p) : 0;
        return { ...task, score, strategy: this.prioritizationStrategy.name };
      })
      .sort((a, b) => b.score - a.score);
  }

  async addDependency(sourceTaskId: number, targetTaskId: number) {
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

  async removeDependency(sourceTaskId: number, targetTaskId: number) {
    await this.repo.deleteDependencies(sourceTaskId, targetTaskId);
  }

  async setDependencies(sourceTaskId: number, targetTaskIds: number[]) {
    await this.findById(sourceTaskId);
    await this.repo.deleteAllDependenciesOfSource(sourceTaskId);
    const created = [];
    for (const targetId of targetTaskIds) {
      if (targetId === sourceTaskId) continue;
      try {
        const dep = await this.repo.createDependency(sourceTaskId, targetId);
        created.push(dep);
      } catch {
        /* ignora duplicatas */
      }
    }
    return created;
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

  async getHourlyRate(): Promise<number> {
    const v = await this.config.get("HOURLY_RATE");
    return v ? Number(v) : 50;
  }

  async getCostEstimate() {
    const hourlyRate = await this.getHourlyRate();
    const tasks = await this.repo.findMany({});

    let totalCost = 0;
    let totalHours = 0;
    const byAssignee = new Map<number, { name: string; cost: number; hours: number }>();
    const bySprint = new Map<string, { name: string; cost: number; hours: number }>();

    const items = tasks.map((t: any) => {
      const complexity = COMPLEXITY_BY_PRIORITY[t.priority] ?? 2;
      const hours = t.estimatedHours ?? 2;
      const cost = hours * complexity * hourlyRate;
      totalCost += cost;
      totalHours += hours;

      if (t.assigneeId && t.assignee) {
        const cur = byAssignee.get(t.assigneeId) || { name: t.assignee.name, cost: 0, hours: 0 };
        cur.cost += cost;
        cur.hours += hours;
        byAssignee.set(t.assigneeId, cur);
      }

      const sprintName = t.status === "CONCLUIDO" ? "Finalizadas" : "Sprint atual";
      const sp = bySprint.get(sprintName) || { name: sprintName, cost: 0, hours: 0 };
      sp.cost += cost;
      sp.hours += hours;
      bySprint.set(sprintName, sp);

      return {
        id: t.id,
        title: t.title,
        priority: t.priority,
        estimatedHours: hours,
        complexity,
        cost,
        assigneeName: t.assignee?.name || null,
      };
    });

    return {
      hourlyRate,
      totalCost,
      totalHours,
      tasks: items,
      byAssignee: Array.from(byAssignee.entries()).map(([id, v]) => ({ id, ...v })),
      bySprint: Array.from(bySprint.values()),
    };
  }

  async checkDueSoon() {
    const tasks = await this.repo.findTasksDueSoon(24);
    for (const t of tasks) {
      if (t.assigneeId) {
        appEmitter.emit("task:due_soon", {
          taskId: t.id,
          taskTitle: t.title,
          assigneeId: t.assigneeId,
          dueDate: t.dueDate,
        });
      }
    }
    return tasks.length;
  }
}

export const taskService = new TaskService();
