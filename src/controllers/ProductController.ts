import { Request, Response } from "express";
import { Product } from "../entities/Product";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, amount, description, url_cover } = req.body;
  const { userId } = req as any;

  if (!name || !amount || !description) {
    res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId }, relations: ["branch"] });

    if (!user || !user.branch) {
      res.status(403).json({ error: "Usuário não está vinculado a uma filial." });
      return;
    }

    const productRepository = AppDataSource.getRepository(Product);
    const newProduct = productRepository.create({
      name,
      amount,
      description,
      url_cover,
      branch: user.branch,
    });

    await productRepository.save(newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
