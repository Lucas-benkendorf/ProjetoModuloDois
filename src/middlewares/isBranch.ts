import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

export const isBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req as any;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["branch"],
    });

    if (!user || user.profile !== "BRANCH") {
      res
        .status(403)
        .json({
          error: "Acesso negado. Apenas filiais podem cadastrar produtos.",
        });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
