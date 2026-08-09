import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const data = productSchema.parse(body);
    const { id } = await params;

    const product = await prisma.product.update({
      where: { id: id },
      data,
      include: { category: true },
    });

    return NextResponse.json({
      ...product,
      costPrice: Number(product.costPrice),
      salePrice: Number(product.salePrice),
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json(
      { error: "Erro ao deletar produto" },
      { status: 400 },
    );
  }
}

// Rota específica para adicionar estoque
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { qty } = await request.json();
    const product = await prisma.product.update({
      where: { id: id },
      data: { stock: { increment: Number(qty) } },
      include: { category: true },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao atualizar estoque:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar estoque" },
      { status: 400 },
    );
  }
}
