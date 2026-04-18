import { NotFoundError } from "../utils/errors";
import { LessonRepository, lessonRepository } from "../repositories/lesson.repository";

export class LessonService {
  constructor(private repo: LessonRepository = lessonRepository) {}

  async findAll(search?: string) {
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { desc: { contains: search, mode: "insensitive" } },
        { project: { contains: search, mode: "insensitive" } },
      ];
    }
    return this.repo.findMany(where);
  }

  async findById(id: string) {
    const lesson = await this.repo.findUnique(id);
    if (!lesson) throw new NotFoundError("Lição");
    return lesson;
  }

  async create(data: { title: string; project: string; desc: string; authorId: string }) {
    return this.repo.create(data);
  }

  async update(id: string, data: Partial<{ title: string; project: string; desc: string }>) {
    await this.findById(id);
    return this.repo.update(id, data as Record<string, unknown>);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repo.delete(id);
  }
}

export const lessonService = new LessonService();
