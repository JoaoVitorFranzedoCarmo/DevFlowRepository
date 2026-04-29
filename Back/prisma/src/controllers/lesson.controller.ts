import { Request, Response } from "express";
import { lessonService } from "../services/lesson.service";

export class LessonController {
  async findAll(req: Request, res: Response) {
    const lessons = await lessonService.findAll(req.query.search as string);
    res.json(lessons);
  }

  async findById(req: Request, res: Response) {
    const lesson = await lessonService.findById(parseInt(req.params.id));
    res.json(lesson);
  }

  async create(req: Request, res: Response) {
    const lesson = await lessonService.create({
      ...req.body,
      authorId: req.user!.userId,
    });
    res.status(201).json(lesson);
  }

  async update(req: Request, res: Response) {
    const lesson = await lessonService.update(parseInt(req.params.id), req.body);
    res.json(lesson);
  }

  async delete(req: Request, res: Response) {
    await lessonService.delete(parseInt(req.params.id));
    res.status(204).send();
  }
}

export const lessonController = new LessonController();
