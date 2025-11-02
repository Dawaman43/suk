import {
  addProduct,
  deleteProduct,
  getProductById,
  Product,
  updateProduct,
} from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const product = await getProductById(id);
      if (!product)
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      return NextResponse.json(product);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Product, "_id">;
    const newProduct = await addProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );

    const updates = (await req.json()) as Partial<Product>;
    await updateProduct(id, updates);
    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );

    await deleteProduct(id);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
