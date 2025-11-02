import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

// Use a shorter server selection timeout in dev to avoid long hangs
const options: ConstructorParameters<typeof MongoClient>[1] = {
  // 5s instead of default 30s to fail fast in development
  serverSelectionTimeoutMS: 5000,
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  console.warn("MONGODB_URI is not defined in environment variables");
  // Export a rejected promise so callers can handle fallback gracefully
  clientPromise = Promise.reject(
    new Error("MONGODB_URI is not defined in environment variables")
  );
} else {
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
  clientPromise = global._mongoClientPromise!;
}

export default clientPromise;
