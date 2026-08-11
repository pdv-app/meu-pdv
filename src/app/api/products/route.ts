import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { productSchema } from "../../../lib/validations/product";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });

    // Convertendo Decimal para number para o frontend
    const serializedProducts = products.map((p) => ({
      ...p,
      costPrice: Number(p.costPrice),
      salePrice: Number(p.salePrice),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...data,
        costPrice: data.costPrice, // Prisma aceita number e converte pra Decimal internamente
        salePrice: data.salePrice,
      },
      include: { category: true },
    });

    return NextResponse.json(
      {
        ...product,
        costPrice: Number(product.costPrice),
        salePrice: Number(product.salePrice),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 400 },
    );
  }
}
