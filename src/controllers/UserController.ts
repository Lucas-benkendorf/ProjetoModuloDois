import { Request, Response } from "express";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, profile, email, password, license_number } = req.body;

  if (!name || !profile || !email || !password || !license_number) {
    res.status(400).json({ error: "Dados incompletos na requisição." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email já cadastrado." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({
      name,
      profile,
      email,
      password_hash: passwordHash,
      status: true,
    });

    await userRepository.save(newUser);

    if (profile === "BRANCH") {
      const branchRepository = AppDataSource.getRepository(Branch);
      const branch = branchRepository.create({
        document: license_number,
        full_address: "Endereço padrão",
        user: newUser,
      });
      await branchRepository.save(branch);
    } else if (profile === "DRIVER") {
      const driverRepository = AppDataSource.getRepository(Driver);
      const driver = driverRepository.create({
        name,
        license_number,
        user: newUser,
      });
      await driverRepository.save(driver);
    }

    res.status(201).json({ name: newUser.name, profile: newUser.profile });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, password, full_address } = req.body;
  const userId = (req as any).userId;

  console.log("userId from token:", userId);
  console.log("id from params:", id);

  if (!userId || userId !== id) {
    console.log("Acesso negado: userId não corresponde ao id do usuário ou userId não está definido.");
    res.status(403).json({ error: "Acesso negado." });
    return;
  }

  if (req.body.id || req.body.created_at || req.body.updated_at || req.body.status || req.body.profile) {
    res.status(401).json({ error: "Campos restritos não podem ser alterados." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password_hash = await bcrypt.hash(password, 10);
    await userRepository.save(user);

    if (user.profile === "DRIVER" && full_address) {
      const driverRepository = AppDataSource.getRepository(Driver);
      const driver = await driverRepository.findOne({ where: { user: { id } } });
      if (driver) {
        driver.full_address = full_address;
        await driverRepository.save(driver);
      }
    }

    res.status(200).json({ message: "Usuário atualizado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};


export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (typeof status !== "boolean") {
    res.status(400).json({ error: "O status deve ser um valor booleano." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    user.status = status;
    await userRepository.save(user);

    res.status(200).json({ message: "Status do usuário atualizado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
