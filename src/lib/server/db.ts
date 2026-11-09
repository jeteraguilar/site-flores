import "server-only";
import { CamelCasePlugin, Kysely, PostgresDialect, type ColumnType, type Generated } from "kysely";
import pg from "pg";

// DATE → "YYYY-MM-DD" string (avoid timezone shifts); NUMERIC → number (prices fit in float64).
pg.types.setTypeParser(1082, (v) => v);
pg.types.setTypeParser(1700, (v) => (v === null ? null : Number(v)));

type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;

export interface Database {
  users: {
    id: Generated<number>;
    email: string;
    displayName: string;
    role: ColumnType<"admin" | "user", "admin" | "user" | undefined>;
    passwordHash: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
  sessions: {
    id: string;
    userId: number;
    createdAt: Timestamp;
    lastAccessed: Timestamp;
    expiresAt: Timestamp;
  };
  loginAttempts: {
    id: Generated<string>;
    email: string;
    ip: string;
    kind: "login" | "reset";
    success: boolean;
    attemptedAt: Timestamp;
  };
  passwordResetCodes: {
    id: Generated<number>;
    userId: number;
    codeHash: string;
    attempts: ColumnType<number, number | undefined, number>;
    createdAt: Timestamp;
    expiresAt: Timestamp;
    usedAt: Date | null;
  };
  categories: {
    id: Generated<number>;
    slug: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    sortOrder: ColumnType<number, number | undefined, number>;
    active: ColumnType<boolean, boolean | undefined, boolean>;
    createdAt: Timestamp;
  };
  products: {
    id: Generated<number>;
    categoryId: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    priceFrom: number | null;
    featured: ColumnType<boolean, boolean | undefined, boolean>;
    active: ColumnType<boolean, boolean | undefined, boolean>;
    sortOrder: ColumnType<number, number | undefined, number>;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
  notices: {
    id: Generated<number>;
    message: string;
    startsAt: string | null;
    endsAt: string | null;
    active: ColumnType<boolean, boolean | undefined, boolean>;
    createdAt: Timestamp;
  };
}

const globalForDb = globalThis as unknown as { __rosaDb?: Kysely<Database> };

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não definido.");
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({ connectionString, max: Number(process.env.DB_POOL_MAX ?? 10), idleTimeoutMillis: 30_000 }),
    }),
    plugins: [new CamelCasePlugin()],
  });
}

/** Lazily created singleton (survives Next dev hot reloads). */
export function getDb(): Kysely<Database> {
  globalForDb.__rosaDb ??= createDb();
  return globalForDb.__rosaDb;
}
