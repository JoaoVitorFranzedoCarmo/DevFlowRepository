import prisma from "../config/database";
import { NotFoundError } from "../utils/errors";

export class LessonService {
  async findAll(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { desc: { contains: search, mode: "insensitive" } },
        { project: { contains: search, mode: "insensitive" } },
      ];
    }

    return prisma.lesson.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
    if (!lesson) throw new NotFoundError("Lição");
    return lesson;
  }

  async create(data: { title: string; project: string; desc: string; authorId: string }) {
    return prisma.lesson.create({
      data,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async update(id: string, data: Partial<{ title: string; project: string; desc: string }>) {
    await this.findById(id);
    return prisma.lesson.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.lesson.delete({ where: { id } });
  }
}

export const lessonService = new LessonService();
