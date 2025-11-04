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

    // Validate basic fields (allow price 0, require non-empty name, at least 1 image)
    const hasMissingRequired =
      !body?.name?.trim() ||
      body.price === undefined ||
      body.price < 0 ||
      !Array.isArray(body.images) ||
      body.images.length === 0 ||
      !body.sellerId;
    if (hasMissingRequired) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // Normalize and validate sellerId
    let sellerId: ObjectId;
    if (typeof body.sellerId === "string") {
      if (!ObjectId.isValid(body.sellerId)) {
        return NextResponse.json(
          { error: "Invalid sellerId format" },
          { status: 400 }
        );
      }
      sellerId = new ObjectId(body.sellerId);
    } else {
      sellerId = body.sellerId;
    }

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
