import { NextRequest, NextResponse } from "next/server";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "@/models/product";
import { ObjectId } from "mongodb";

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

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );

    const updates = (await req.json()) as Partial<Product>;
    if (updates.sellerId && typeof updates.sellerId === "string") {
      updates.sellerId = new ObjectId(updates.sellerId);
    }

    await updateProduct(id, updates);
    return NextResponse.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );

    await deleteProduct(id);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
