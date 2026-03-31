import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.json(tokens);
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(204).send();
  }

  async me(req: Request, res: Response) {
    // req.user is set by authMiddleware
    const { userService } = await import("../services/user.service");
    const user = await userService.findById(req.user!.userId);
    res.json(user);
  }
}

export const authController = new AuthController();
