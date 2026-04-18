import prisma from "../config/database";

const lessonInclude = {
  author: { select: { id: true, name: true, avatar: true } },
} as const;

export class LessonRepository {
  async findMany(where: Record<string, unknown> = {}) {
    return prisma.lesson.findMany({
      where: where as any,
      include: lessonInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findUnique(id: string) {
    return prisma.lesson.findUnique({
      where: { id },
      include: lessonInclude,
    });
  }

  async create(data: { title: string; project: string; desc: string; authorId: string }) {
    return prisma.lesson.create({ data, include: lessonInclude });
  }

  async update(id: string, data: Record<string, unknown>) {
    return prisma.lesson.update({
      where: { id },
      data: data as any,
      include: lessonInclude,
    });
  }

  async delete(id: string) {
    return prisma.lesson.delete({ where: { id } });
  }
}

export const lessonRepository = new LessonRepository();
