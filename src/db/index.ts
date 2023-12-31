import "server-only";

import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { Client } from "@planetscale/database";
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

  // @ts-ignore
  db.$on("query", (e) => {
    console.log(new Date().toTimeString());
    // @ts-ignore
    console.count(e.params.toString());
    console.log(
      "Query:\n" +
        // @ts-ignore
        e.query
          .replace("SELECT", "SELECT\n")
          .replace("FROM", "\nFROM\n")
          .replace("WHERE", "\nWHERE\n")
          .replace("IN", "\nIN\n")
          .replace("ORDER BY", "\nORDER BY\n"),
    );
    // @ts-ignore
    console.log("Params: " + e.params);
    // @ts-ignore
    console.log("Duration: " + e.duration + "ms");
    console.log();
  });
}

export default db;
