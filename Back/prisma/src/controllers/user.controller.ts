import { Request, Response } from "express";
import { userService } from "../services/user.service";

export class UserController {
  async findAll(_req: Request, res: Response) {
    const users = await userService.findAll();
    res.json(users);
  }

  async findById(req: Request, res: Response) {
    const user = await userService.findById(req.params.id);
    res.json(user);
  }

  async update(req: Request, res: Response) {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  }

  async delete(req: Request, res: Response) {
    await userService.delete(req.params.id);
    res.status(204).send();
  }
}

export const userController = new UserController();
