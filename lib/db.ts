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

function hasExpectedModels(client: PrismaClient | undefined): client is PrismaClient {
  if (!client) return false;
  // After `prisma generate` adds models, a hot-reloaded Next process can keep a
  // stale singleton. Recreate when expected delegates are missing.
  return (
    typeof (client as { packageInquiry?: unknown }).packageInquiry !== "undefined" &&
    typeof (client as { textReview?: unknown }).textReview !== "undefined" &&
    typeof (client as { videoReview?: unknown }).videoReview !== "undefined"
  );
}

function getPrismaClient(): PrismaClient {
  if (hasExpectedModels(globalForPrisma.prisma)) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

/**
 * Lazy proxy so Turbopack HMR always hits a Prisma client that includes the
 * latest generated models (e.g. textReview), not a stale module singleton.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
