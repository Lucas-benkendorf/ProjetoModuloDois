import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

dotenv.config();

declare module "express" {
  interface Request {
    user?: {
      id: string;
      isAdmin: boolean;
    };
  }
}

interface TokenPayload {
  id: string;
  profile: string;
  iat: number;
  exp: number;
}

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const [, token] = authHeader.split(" ");

  if (!process.env.JWT_SECRET) {
    res
      .status(500)
      .json({ error: "Erro interno no servidor. JWT_SECRET não definido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: decoded.id } });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    if (user.profile !== "ADMIN") {
      res.status(403).json({
        error: "Acesso negado. Apenas administradores podem acessar esta rota.",
      });
      return;
    }

    req.user = { id: user.id, isAdmin: user.profile === "ADMIN" };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expirado." });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Token inválido." });
      return;
    }

    res.status(401).json({ error: "Erro ao verificar o token." });
  }
};
