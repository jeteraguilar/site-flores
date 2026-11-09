import { readFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definido.");
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query(await readFile(path.resolve(process.cwd(), "db/seed.sql"), "utf8"));
    console.log("Seed aplicado.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
