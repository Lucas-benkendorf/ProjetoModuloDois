import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido" });
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

    if (!decoded.isAdmin) {
      res.status(403).json({
        error: "Acesso negado. Apenas administradores podem acessar esta rota.",
      });
      return;
    }

    req.user = { id: decoded.id, isAdmin: decoded.isAdmin };

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
