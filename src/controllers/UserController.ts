import { Request, Response } from "express";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";
import bcrypt from "bcrypt";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, profile, email, password, document, full_address } = req.body;

  
  if (!name || !profile || !email || !password || !document || !full_address) {
    res.status(400).json({ error: "Dados incorretos ou incompletos no corpo da requisição." });
    return;
  }

  try {
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email já cadastrado." });
      return;
    }

    
    const passwordHash = await bcrypt.hash(password, 10);

    
    const newUser = User.create({
      name,
      profile,
      email,
      password_hash: passwordHash,
    });

    await newUser.save();

    
    if (profile === "BRANCH") {
      const branch = Branch.create({
        document,
        full_address,
        user: newUser,
      });
      await branch.save();
    } else if (profile === "DRIVER") {
      const driver = Driver.create({
        document,
        full_address,
        user: newUser,
      });
      await driver.save();
    } else {
      
      res.status(400).json({ error: "Perfil inválido." });
      return;
    }

    
    res.status(201).json({ name: newUser.name, profile: newUser.profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};