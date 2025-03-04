import { Request, Response } from "express";
import { Movement } from "../entities/Movement";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Branch } from "../entities/Branch";
import { MovementStatus } from "../entities/Movement";

export const createMovement = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { destination_branch_id, product_id, quantity } = req.body;
  const { userId } = req as any;

  if (!destination_branch_id || !product_id || !quantity || quantity <= 0) {
    res.status(400).json({ error: "Dados inválidos na requisição." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["branch"],
    });

    if (!user || !user.branch) {
      res.status(403).json({ error: "Usuário não está vinculado a uma filial." });
      return;
    }

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({
      where: { id: product_id },
      relations: ["branch"],
    });

    if (!product) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }

    if (product.branch.id === destination_branch_id) {
      res
        .status(400)
        .json({ error: "A filial de origem não pode ser a mesma que a filial de destino." });
      return;
    }

    if (product.amount < quantity) {
      res.status(400).json({ error: "Estoque insuficiente para essa movimentação." });
      return;
    }

    const branchRepository = AppDataSource.getRepository(Branch);
    const destinationBranch = await branchRepository.findOne({
      where: { id: destination_branch_id },
    });

    if (!destinationBranch) {
      res.status(404).json({ error: "Filial de destino não encontrada." });
      return;
    }

    const movementRepository = AppDataSource.getRepository(Movement);
    const newMovement = movementRepository.create({
      destination_branch: destinationBranch,
      product,
      quantity,
      status: MovementStatus.PENDING,
    });

    await movementRepository.save(newMovement);


    product.amount -= quantity;
    await productRepository.save(product);

    res.status(201).json(newMovement);
  } catch (error) {
    console.error("Erro durante a criação da movimentação:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};