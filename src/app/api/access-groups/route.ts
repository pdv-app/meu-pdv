import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const groups = await prisma.accessGroup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Erro ao listar grupos de acesso:", error);
    return NextResponse.json(
      { message: "Erro ao listar grupos de acesso" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, active, permissions } = body;

    if (!name) {
      return NextResponse.json(
        { message: "O nome é obrigatório" },
        { status: 400 },
      );
    }

    const group = await prisma.accessGroup.create({
      data: {
        name,
        description,
        active: active ?? true,
        permissions: permissions ?? {},
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar grupo de acesso:", error);
    console.error("Erro ao criar grupo de acesso:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Já existe um grupo com este nome." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Erro ao criar grupo de acesso" },
      { status: 500 },
    );
  }
}
