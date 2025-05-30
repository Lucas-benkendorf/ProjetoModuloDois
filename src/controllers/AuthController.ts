import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email e senha são obrigatórios." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Email ou senha incorretos." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Email ou senha incorretos." });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res
        .status(500)
        .json({ error: "Erro interno no servidor. JWT_SECRET não definido." });
      return;
    }

    const isAdmin = user.profile === "ADMIN";

    const token = jwt.sign({ id: user.id, isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      name: user.name,
      profile: user.profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
