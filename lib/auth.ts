import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { memoryAdapter } from "better-auth/adapters/memory";
import clientPromise from "@/lib/mongo";

// Try to connect to Mongo; on failure, fall back to in-memory adapter in dev
const forceMemory =
  process.env.AUTH_USE_MEMORY === "1" || process.env.AUTH_USE_MEMORY === "true";

let databaseAdapter:
  | ReturnType<typeof mongodbAdapter>
  | ReturnType<typeof memoryAdapter>;

if (forceMemory) {
  console.warn("AUTH_USE_MEMORY is enabled; using in-memory auth adapter.");
  databaseAdapter = memoryAdapter({});
} else {
  try {
    const client = await clientPromise;
    databaseAdapter = mongodbAdapter(client.db("suq"));
  } catch (err) {
    console.warn(
      "Using in-memory auth adapter due to Mongo unavailability:",
      err
    );
    // Note: This is non-persistent and for development only
    databaseAdapter = memoryAdapter({});
  }
}

export const auth = betterAuth({
  appName: "Suq",
  secret: process.env.BETTER_AUTH_SECRET!,
  url: process.env.BETTER_AUTH_URL!,
  clientType: "nextjs",
  database: databaseAdapter,
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
