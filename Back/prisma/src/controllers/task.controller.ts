import { Request, Response } from "express";
import { taskService } from "../services/task.service";

export class TaskController {
  async findAll(req: Request, res: Response) {
    const { status, priority, assigneeId, search } = req.query;
    const tasks = await taskService.findAll({
      status: status as string,
      priority: priority as string,
      assigneeId: assigneeId as string,
      search: search as string,
    });
    res.json(tasks);
  }

  async findById(req: Request, res: Response) {
    const task = await taskService.findById(req.params.id);
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
    const task = await taskService.update(req.params.id, req.body);
    res.json(task);
  }

  async moveTask(req: Request, res: Response) {
    const { status } = req.body;
    const task = await taskService.moveTask(req.params.id, status);
    res.json(task);
  }

  async delete(req: Request, res: Response) {
    await taskService.delete(req.params.id);
    res.status(204).send();
  }

  // Prioritization
  async setPrioritization(req: Request, res: Response) {
    const result = await taskService.setPrioritization(req.params.id, req.body);
    res.json(result);
  }

  async getPrioritizedTasks(_req: Request, res: Response) {
    const tasks = await taskService.getPrioritizedTasks();
    res.json(tasks);
  }

  // Dependencies
  async addDependency(req: Request, res: Response) {
    const result = await taskService.addDependency(req.params.id, req.body.targetTaskId);
    res.status(201).json(result);
  }

  async removeDependency(req: Request, res: Response) {
    await taskService.removeDependency(req.params.id, req.params.targetId);
    res.status(204).send();
  }

  // Dashboard
  async getDashboardStats(_req: Request, res: Response) {
    const stats = await taskService.getDashboardStats();
    res.json(stats);
  }
}

export const taskController = new TaskController();
