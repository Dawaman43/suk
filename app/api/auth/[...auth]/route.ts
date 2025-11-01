import { auth } from "@/lib/auth";

// Expose Better Auth handler for Next.js App Router under /api/auth/*
export const GET = auth.handler;
export const POST = auth.handler;
