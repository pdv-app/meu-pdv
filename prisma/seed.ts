import { PrismaClient } from "../src/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando o seed do banco de dados...");

  // 1. Criar a Loja Inicial
  const loja = await prisma.loja.upsert({
    where: { name: "Massagem da Cris" },
    update: {},
    create: {
      name: "Massagem da Cris",
      ownerName: "Cris",
      email: "cryslaine.s.f@hotmail.com",
      phone: "79991552156",
    },
  });

  console.log(`Loja criada com ID: ${loja.id}`);

  // 2. Criar o Grupo de Acesso ADMIN
  const adminGroup = await prisma.accessGroup.upsert({
    where: {
      lojaId_name: {
        lojaId: loja.id,
        name: "ADMIN",
      },
    },
    update: {},
    create: {
      name: "ADMIN",
      description: "Acesso total ao sistema",
      lojaId: loja.id,
      permissions: {
        clientes: ["Visualizar", "Adicionar", "Editar", "Excluir"],
        produtos: ["Visualizar", "Adicionar", "Editar", "Excluir"],
        dashboard: ["Visualizar"],
        historico: ["Visualizar", "Editar", "Excluir"],
        "nova-venda": ["Visualizar", "Adicionar"],
      },
    },
  });

  console.log(`Grupo ADMIN criado com ID: ${adminGroup.id}`);

  // 3. Criar o Usuário Administrador
  const hashedPassword = await bcrypt.hash("123456", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "cryslaine.s.f@hotmail.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      name: "Cris",
      email: "cryslaine.s.f@hotmail.com",
      password: hashedPassword,
      groupId: adminGroup.id,
      lojaId: loja.id,
      active: true,
    },
  });

  console.log(
    `Usuário ADMIN criado com ID: ${adminUser.id} e E-mail: ${adminUser.email} (Senha: 123456)`,
  );

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
