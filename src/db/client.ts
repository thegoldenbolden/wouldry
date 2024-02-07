import "server-only";

import { Client } from "@planetscale/database";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { PrismaClient } from "@prisma/client";

const client = new Client({ url: process.env.DATABASE_URL, fetch });
const adapter = new PrismaPlanetScale(client);

declare global {
  var db: PrismaClient;
}

const db =
  global.db ||
  new PrismaClient({
    adapter,
    errorFormat: "pretty",
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "event",
        level: "error",
      },
      {
        emit: "event",
        level: "info",
      },
      {
        emit: "event",
        level: "warn",
      },
    ],
  });

if (process.env.NODE_ENV !== "production") {
  global.db = db;
}

export { db };
