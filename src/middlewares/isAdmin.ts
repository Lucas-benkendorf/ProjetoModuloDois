import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";  
import { User } from "../entities/User";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;


  const userRepository = AppDataSource.getRepository(User);
  

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user || user.profile !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores podem realizar essa ação." });
  }

  next();
};
