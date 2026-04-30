import { Request, Response } from "express";
import { taskService } from "../services/task.service";

export class TaskController {
  async findAll(req: Request, res: Response) {
    const { status, priority, assigneeId, search } = req.query;
    const tasks = await taskService.findAll({
      status: status as string,
      priority: priority as string,
      assigneeId: assigneeId ? parseInt(assigneeId as string) : undefined,
      search: search as string,
    });
    res.json(tasks);
  }

  async findById(req: Request, res: Response) {
    const task = await taskService.findById(parseInt(req.params.id));
    res.json(task);
  }

  async findByStatus(_req: Request, res: Response) {
    const columns = await taskService.findByStatus();
    res.json(columns);
  }

  async create(req: Request, res: Response) {
    const task = await taskService.create(req.body);
    res.status(201).json(task);
  }

  async update(req: Request, res: Response) {
    const task = await taskService.update(parseInt(req.params.id), req.body);
    res.json(task);
  }

  async moveTask(req: Request, res: Response) {
    const { status } = req.body;
    const task = await taskService.moveTask(parseInt(req.params.id), status);
    res.json(task);
  }

  async delete(req: Request, res: Response) {
    await taskService.delete(parseInt(req.params.id));
    res.status(204).send();
  }

  async setPrioritization(req: Request, res: Response) {
    const result = await taskService.setPrioritization(parseInt(req.params.id), req.body);
    res.json(result);
  }

  async getPrioritizedTasks(_req: Request, res: Response) {
    const tasks = await taskService.getPrioritizedTasks();
    res.json(tasks);
  }

  async addDependency(req: Request, res: Response) {
    const result = await taskService.addDependency(parseInt(req.params.id), parseInt(req.body.targetTaskId));
    res.status(201).json(result);
  }

  async setDependencies(req: Request, res: Response) {
    const targetTaskIds = (req.body.targetTaskIds as number[]).map(Number);
    const result = await taskService.setDependencies(parseInt(req.params.id), targetTaskIds);
    res.json(result);
  }

  async removeDependency(req: Request, res: Response) {
    await taskService.removeDependency(parseInt(req.params.id), parseInt(req.params.targetId));
    res.status(204).send();
  }

  async getDashboardStats(_req: Request, res: Response) {
    const stats = await taskService.getDashboardStats();
    res.json(stats);
  }

  async getCostEstimate(_req: Request, res: Response) {
    const cost = await taskService.getCostEstimate();
    res.json(cost);
  }

  async checkDueSoon(_req: Request, res: Response) {
    const count = await taskService.checkDueSoon();
    res.json({ count });
  }
}

export const taskController = new TaskController();
