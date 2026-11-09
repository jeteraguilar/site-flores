# Rosa do Deserto — Site

Site da **Rosa do Deserto — Garden | Floricultura** (R. Luís Juliani, 1023 — Jardim Adutora, São Paulo/SP):
vitrine com catálogo, pedidos pelo WhatsApp, página de canais oficiais contra golpes e área administrativa
para a loja cadastrar produtos, categorias, fotos e avisos.

## Stack

| Camada | Tecnologia |
|---|---|
| App | Next.js 15 (App Router, renderização no servidor) · React 19 · TypeScript estrito |
| API | Route handlers do Next (`src/app/api`) · Zod 4 · Kysely |
| Banco | PostgreSQL 16 · migrações SQL versionadas (`db/migrations`) |
| Fotos | Storage S3-compatível (Cloudflare R2, S3, MinIO) com presigned PUT direto do navegador |
| Auth | Sessão em cookie httpOnly (token com hash SHA-256 no banco) · bcrypt · rate limit no Postgres |
| Admin UI | TanStack Query · Sonner (toasts) · `<dialog>` nativo |
| Testes / CI | Vitest · GitLab CI · Docker (output `standalone`) |

## Rodando localmente

```bash
cp .env.example .env              # ajuste DATABASE_URL se precisar
docker compose up -d db           # Postgres 16 (e "minio" se quiser testar upload)
npm ci
npm run db:migrate && npm run db:seed
ADMIN_PASSWORD='uma-senha-forte' npm run admin:create -- voce@exemplo.com "Seu nome"
npm run dev                       # http://localhost:3000  ·  admin em /login
```

Sem `SMTP_URL`, em desenvolvimento o código de "Esqueci minha senha" sai no console do servidor.
Sem as variáveis `S3_*`, o envio de fotos responde 503 com mensagem clara (o resto funciona).

## Scripts

| Comando | O quê |
|---|---|
| `npm run dev` / `build` / `start` | Desenvolvimento, build de produção, servidor de produção |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Testes unitários (schemas, preço, slug, avisos por período, guarda de admin, horário de funcionamento) |
| `npm run db:migrate` | Aplica migrações pendentes (transação por arquivo, lock consultivo contra execuções paralelas) |
| `npm run db:seed` | Categorias e produtos iniciais (idempotente) |
| `npm run admin:create -- <email> ["Nome"]` | Cria/promove admin; senha via `ADMIN_PASSWORD` (nunca em argumento) |

## Estrutura

```
src/app/(site)/          páginas públicas: /, /catalogo, /canais-oficiais (+ layout, site.css)
src/app/login, /admin    área da loja (noindex)
src/app/api/             catalog · auth/* · admin/* (contratos em docs/HANDOFF-CLAUDE-CODE.md §4)
src/components/          Header, ProductCard, CatalogBrowser, ícones/ilustração, admin/*
src/lib/                 schemas (Zod), text (preço/slug/datas), opening-hours, store-info
src/lib/server/          db, auth, rate-limit, catalog, storage, mailer, http (só servidor)
db/                      migrations/*.sql, seed.sql
scripts/                 migrate, seed, create-admin
tests/                   Vitest
```

## Segurança

- Toda rota `/api/admin/*` valida a sessão **e** `role = 'admin'` no servidor (401/403).
- Cookie `rd_session`: httpOnly, `Secure` em produção, `SameSite=Lax`; no banco só o hash do token; expiração de 7 dias com renovação.
- Checagem de `Origin` em requisições que alteram dados (defesa extra contra CSRF).
- Login: 5 falhas por e-mail / 30 por IP em 15 min → 429. Recuperação: código de 6 dígitos com hash, 15 min, 5 tentativas, uso único; troca de senha derruba todas as sessões. A resposta é igual exista ou não o e-mail.
- IP do cliente só vem de `X-Forwarded-For` com `TRUST_PROXY=1` (última entrada, adicionada pelo seu proxy).
- Upload: só JPEG/PNG/WebP até 8 MB, nome gerado no servidor (`catalog/<uuid>.<ext>`), URL assinada por 15 min.
- Sem cadastro público. Sem cookies de rastreamento (não precisa de banner LGPD).

## Deploy

Imagem Docker (`output: "standalone"`, usuário não-root). Exemplo:

```bash
docker build -t rosa-do-deserto .
npm run db:migrate   # rode as migrações a partir do CI/host com DATABASE_URL de produção antes de subir a nova versão
docker run -d -p 3000:3000 --env-file .env.production rosa-do-deserto
```

Variáveis: ver `.env.example`. Coloque um proxy (Caddy/Nginx/Cloudflare) com HTTPS na frente e defina `TRUST_PROXY=1` e `SITE_URL`.

## Pendências com a loja

Fotos reais e autorização de uso · entrega e formas de pagamento · domingos/feriados · preço no site ou "consulte" ·
domínio (`rosadodeserto.com.br`?) e e-mail remetente para os códigos de senha.

## Documentos

- [`docs/ANALISE.md`](docs/ANALISE.md) — análise da presença digital e proposta.
- [`docs/HANDOFF-CLAUDE-CODE.md`](docs/HANDOFF-CLAUDE-CODE.md) — especificação usada nesta implementação.
