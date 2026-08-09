import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// [GET] /api/clients - Lista todos os clientes com seus endereços
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        address: true, // Inclui o endereço relacionado
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar clientes." },
      { status: 500 },
    );
  }
}

// [POST] /api/clients - Cria um novo cliente com endereço
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, notes, address } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios." },
        { status: 400 },
      );
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        phone,
        email,
        notes,
        address: address
          ? {
              create: {
                street: address.street || "",
                number: address.number || "",
                complement: address.complement || "",
                neighborhood: address.neighborhood || "",
                city: address.city || "",
                state: address.state || "",
                zipCode: address.zipCode || "",
              },
            }
          : undefined,
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar cliente." },
      { status: 500 },
    );
  }
}
