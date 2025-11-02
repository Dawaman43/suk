import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export interface Product {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sellerId: string;
}

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
  product: Omit<Product, "_id">
): Promise<Product> {
  const client = await clientPromise;
  const db = client.db();
  const result = await db
    .collection<Omit<Product, "_id">>(COLLECTION_NAME)
    .insertOne(product);
  return { _id: result.insertedId, ...product };
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db
    .collection<Product>(COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
}

export async function deleteProduct(id: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db
    .collection<Product>(COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) });
}
