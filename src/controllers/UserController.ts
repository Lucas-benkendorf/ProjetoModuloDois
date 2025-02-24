import { Request, Response } from "express";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";


export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, profile, email, password, license_number } = req.body;

  console.log("Dados recebidos:", { name, profile, email, license_number });


  if (!name || !profile || !email || !password || !license_number) {
    console.log("Dados incompletos:", { name, profile, email, license_number });
    res
      .status(400)
      .json({
        error: "Dados incorretos ou incompletos no corpo da requisição.",
      });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    console.log("Verificando se o email já está cadastrado:", email);

 
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      console.log("Email já cadastrado:", email);
      res.status(409).json({ error: "Email já cadastrado." });
      return;
    }

    console.log("Criptografando a senha...");
    const passwordHash = await bcrypt.hash(password, 10);

    console.log("Criando novo usuário...");
    const newUser = userRepository.create({
      name,
      profile,
      email,
      password_hash: passwordHash,
      status: true, 
    });

    console.log("Salvando usuário no banco de dados...");
    await userRepository.save(newUser);
    console.log("Usuário salvo com sucesso:", newUser);

    
    if (profile === "BRANCH") {
      console.log("Criando Branch...");
      const branchRepository = AppDataSource.getRepository(Branch);
      const branch = branchRepository.create({
        document: license_number,
        full_address: "Endereço padrão", 
        user: newUser,
      });
      await branchRepository.save(branch);
      console.log("Branch salvo com sucesso:", branch);
    } else if (profile === "DRIVER") {
      console.log("Criando Driver...");
      const driverRepository = AppDataSource.getRepository(Driver);
      const driver = driverRepository.create({
        name,
        license_number,
        user: newUser,
      });
      await driverRepository.save(driver);
      console.log("Driver salvo com sucesso:", driver);
    } else if (profile === "ADMIN") {
      console.log("Perfil ADMIN: Nenhuma entidade relacionada criada.");
    } else {
      console.log("Perfil inválido:", profile);
      res.status(400).json({ error: "Perfil inválido." });
      return;
    }

    console.log("Usuário criado com sucesso. Retornando resposta...");
    res.status(201).json({ name: newUser.name, profile: newUser.profile });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};


export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
   
    if (!req.user?.isAdmin) {
      res
        .status(403)
        .json({
          error: "Acesso negado. Apenas administradores podem listar usuários.",
        });
      return;
    }

    const { profile } = req.query;
    const userRepository = AppDataSource.getRepository(User);

   
    let query = userRepository
      .createQueryBuilder("user")
      .select(["user.id", "user.name", "user.status", "user.profile"]);

   
    if (profile) {
      query = query.where("user.profile = :profile", { profile });
    }

    const users = await query.getMany();

    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
