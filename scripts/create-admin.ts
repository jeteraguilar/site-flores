/**
 * Cria (ou atualiza) a conta de administração.
 *   ADMIN_PASSWORD='...' npm run admin:create -- loja@exemplo.com "Rosa do Deserto"
 * Sem ADMIN_PASSWORD a conta é criada sem senha (definida depois por "Esqueci minha senha").
 * A senha nunca vai em argumento de linha de comando (fica no histórico do shell / ps).
 */
import bcrypt from "bcryptjs";
import { Client } from "pg";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definido.");
  const [emailArg, nameArg] = process.argv.slice(2);
  const email = emailArg?.trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error('Uso: npm run admin:create -- <email> ["Nome"]');
  }
  const password = process.env.ADMIN_PASSWORD;
  if (password !== undefined && password.length < 8) throw new Error("ADMIN_PASSWORD precisa de 8+ caracteres.");
  const hash = password ? await bcrypt.hash(password, 12) : null;

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const { rows } = await client.query<{ id: number }>(
      `INSERT INTO users (email, display_name, role, password_hash)
       VALUES ($1, $2, 'admin', $3)
       ON CONFLICT (lower(email)) DO UPDATE
         SET role = 'admin',
             password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
             updated_at = now()
       RETURNING id`,
      [email, nameArg ?? "Rosa do Deserto", hash],
    );
    console.log(`Admin ${email} pronto (id ${rows[0]?.id})${hash ? " com senha definida" : " sem senha"}.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
