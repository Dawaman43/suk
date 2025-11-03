import { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  images: string[];
  sellerId: ObjectId;
  status: "available" | "sold" | "reserved";
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  location?: string;
}
