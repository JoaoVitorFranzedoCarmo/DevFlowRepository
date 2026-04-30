import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { ForbiddenError } from "../utils/errors";

export class UserController {
  async findAll(_req: Request, res: Response) {
    const users = await userService.findAll();
    res.json(users);
  }

  async findById(req: Request, res: Response) {
    const user = await userService.findById(parseInt(req.params.id));
    res.json(user);
  }

  async update(req: Request, res: Response) {
    const isOwn = parseInt(req.params.id) === req.user!.userId;
    const isGerente = req.user!.role === "GERENTE";
    if (!isOwn && !isGerente) {
      throw new ForbiddenError("Permissão negada para atualizar este usuário");
    }
    const data = { ...req.body };
    if (!isGerente) delete data.role;
    const user = await userService.update(parseInt(req.params.id), data);
    res.json(user);
  }

  async delete(req: Request, res: Response) {
    await userService.delete(parseInt(req.params.id));
    res.status(204).send();
  }
}

export const userController = new UserController();
