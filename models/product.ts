import clientPromise from "@/lib/mongo";
import { Product } from "@/types/product";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "products";

export async function getAllProducts(): Promise<Product[]> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Product>(COLLECTION_NAME).find({}).toArray();
}

export async function getProductById(id: string): Promise<Product | null> {
  const client = await clientPromise;
  const db = client.db();
  return db
    .collection<Product>(COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) });
}

export async function addProduct(
  product: Omit<Product, "_id" | "createdAt" | "updatedAt">
): Promise<Product> {
  const client = await clientPromise;
  const db = client.db();
  const now = new Date();

  const result = await db.collection<Product>(COLLECTION_NAME).insertOne({
    ...product,
    status: product.status || "available",
    createdAt: now,
    updatedAt: now,
  });

  return {
    _id: result.insertedId,
    ...product,
    status: product.status || "available",
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "_id" | "createdAt">>
): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db
    .collection<Product>(COLLECTION_NAME)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
}

export async function deleteProduct(id: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db
    .collection<Product>(COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) });
}
