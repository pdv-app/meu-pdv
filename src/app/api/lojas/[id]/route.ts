import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { lojaSchema } from "@/lib/validations/loja";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();

    // Validação com Zod no back-end
    const parsed = lojaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: parsed.error.format() },
        { status: 400 },
      );
    }
    const { id } = await params;

    const updatedLoja = await prisma.loja.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updatedLoja);
  } catch (error) {
    console.error("Erro ao atualizar loja:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar dados" },
      { status: 500 },
    );
  }
}
