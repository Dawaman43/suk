import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, addProduct } from "@/models/product";
import { ObjectId } from "mongodb";
import { Product } from "@/types/product";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<
      Product,
      "_id" | "createdAt" | "updatedAt"
    >;

    if (!body.name || !body.price || !body.images?.length || !body.sellerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sellerId =
      typeof body.sellerId === "string"
        ? new ObjectId(body.sellerId)
        : body.sellerId;

    const newProduct = await addProduct({ ...body, sellerId });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
