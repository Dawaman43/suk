import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client
    .connect()
    .then((c) => {
      console.log("✅ MongoDB connected successfully!");
      return c;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err);
      throw err; // rethrow so the app knows connection failed
    });
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
