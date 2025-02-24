import { Request, Response } from "express";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source"; // Certifique-se de que está importando corretamente

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, profile, email, password, license_number } = req.body;

    console.log("Dados recebidos:", { name, profile, email, license_number }); // Log para depuração

    // Verifique se todos os campos obrigatórios estão presentes
    if (!name || !profile || !email || !password || !license_number) {
        console.log("Dados incompletos:", { name, profile, email, license_number }); // Log para depuração
        res.status(400).json({ error: "Dados incorretos ou incompletos no corpo da requisição." });
        return;
    }

    try {
        // Obtenha o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Verifique se o email já está em uso
        console.log("Verificando se o email já está cadastrado:", email); // Log para depuração
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            console.log("Email já cadastrado:", email); // Log para depuração
            res.status(409).json({ error: "Email já cadastrado." });
            return;
        }

        // Criptografe a senha
        console.log("Criptografando a senha..."); // Log para depuração
        const passwordHash = await bcrypt.hash(password, 10);

        // Crie o novo usuário
        console.log("Criando novo usuário..."); // Log para depuração
        const newUser = userRepository.create({
            name,
            profile,
            email,
            password_hash: passwordHash,
            status: true, // Definindo o status como true por padrão
        });

        // Salve o usuário no banco de dados
        console.log("Salvando usuário no banco de dados..."); // Log para depuração
        await userRepository.save(newUser);
        console.log("Usuário salvo com sucesso:", newUser); // Log para depuração

        // Crie a entidade relacionada (Branch ou Driver) com base no perfil
        if (profile === "BRANCH") {
            console.log("Criando Branch..."); // Log para depuração
            const branchRepository = AppDataSource.getRepository(Branch);
            const branch = branchRepository.create({
                document: license_number, // Usando license_number como document
                full_address: "Endereço padrão", // Adicione um endereço padrão ou ajuste conforme necessário
                user: newUser,
            });
            await branchRepository.save(branch);
            console.log("Branch salvo com sucesso:", branch); // Log para depuração
        } else if (profile === "DRIVER") {
            console.log("Criando Driver..."); // Log para depuração
            const driverRepository = AppDataSource.getRepository(Driver);
            const driver = driverRepository.create({
                name,
                license_number,
                user: newUser,
            });
            await driverRepository.save(driver);
            console.log("Driver salvo com sucesso:", driver); // Log para depuração
        } else if (profile === "ADMIN") {
            console.log("Perfil ADMIN: Nenhuma entidade relacionada criada."); // Log para depuração
            // Para o perfil ADMIN, não é necessário criar Branch ou Driver
            // Apenas salve o usuário
        } else {
            console.log("Perfil inválido:", profile); // Log para depuração
            res.status(400).json({ error: "Perfil inválido." });
            return;
        }

        // Retorne a resposta de sucesso
        console.log("Usuário criado com sucesso. Retornando resposta..."); // Log para depuração
        res.status(201).json({ name: newUser.name, profile: newUser.profile });
    } catch (error) {
        console.error("Erro ao criar usuário:", error); // Log para depuração
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};