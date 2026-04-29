import { NotFoundError } from "../utils/errors";
import { UserRepository, userRepository } from "../repositories/user.repository";

export class UserService {
  constructor(private repo: UserRepository = userRepository) {}

  async findAll() {
    return this.repo.findMany();
  }

  async findById(id: number) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundError("Usuário");
    return user;
  }

  async update(id: number, data: { name?: string; email?: string; role?: string; avatar?: string | null }) {
    await this.findById(id);
    return this.repo.update(id, data as Record<string, unknown>);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repo.delete(id);
  }
}

export const userService = new UserService();
