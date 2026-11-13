import "server-only";

import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL environment variable.");
  }

  // Neon HTTP adapter (Vercel-safe). Unsupported patterns that throw at runtime:
  // - prisma.$transaction(...)
  // - createMany(...)
  // - update({ include: ... }) / create({ include: ... })
  // Use sequential create/update + a separate findFirst for includes.
  const adapter = new PrismaNeonHTTP(connectionString, {});

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;
  // After `prisma generate` adds models, a hot-reloaded Next process can keep a
  // stale singleton. Recreate if expected delegates are missing.
  if (
    cached &&
    typeof (cached as { packageInquiry?: unknown }).packageInquiry !== "undefined"
  ) {
    return cached;
  }
  return createPrismaClient();
}

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
