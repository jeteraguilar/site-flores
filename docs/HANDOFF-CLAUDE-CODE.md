# Handoff — Site Rosa do Deserto (para recriar no Claude Code)

> Cole este arquivo (ou aponte para ele) numa sessão do Claude Code e peça:
> **"Implemente o site descrito em docs/HANDOFF-CLAUDE-CODE.md, seguindo a stack e os contratos definidos."**
>
> Origem: protótipo feito no Floot (projeto "Rosa do Deserto"). Este documento descreve o mesmo produto de forma
> independente de plataforma — nada aqui depende de APIs do Floot.

---

## 1. Produto

Site vitrine da **Rosa do Deserto — Garden | Floricultura** (viveiro, jardinagem e floricultura de bairro).
Venda acontece **100% pelo WhatsApp**; o site é catálogo + fonte oficial de contatos (a loja sofre com golpes
usando seu nome). Público: consumidor final, mobile-first (tráfego vem do Instagram/WhatsApp). Idioma: pt-BR.

### Dados da loja (constantes)

| Campo | Valor |
|---|---|
| Nome | Rosa do Deserto — Garden \| Floricultura |
| Endereço | R. Luís Juliani, nº 1023 — Jardim Adutora — São Paulo/SP |
| WhatsApp | (11) 99103-9621 → E.164 `5511991039621` |
| Horário | Seg–Sex 09h–18h30 · Sáb 08h–17h · Dom fechado |
| Instagram | `@garden.rosadodeserto` — https://instagram.com/garden.rosadodeserto |
| Facebook | https://www.facebook.com/garden.rosadodeserto |
| Canal WhatsApp | https://whatsapp.com/channel/0029Vb678Vm9Gv7NZJaAmB0K |
| Catálogo WhatsApp | https://wa.me/c/5511991039621 |

Links derivados:
- Pedido: `https://wa.me/5511991039621?text=<encodeURIComponent(msg)>`
- Mapa: `https://www.google.com/maps/search/?api=1&query=<endereço>`; embed: `https://www.google.com/maps?q=<endereço>&output=embed`

---

## 2. Stack recomendada

| Camada | Escolha | Motivo |
|---|---|---|
| Front | React 18 + Vite + TypeScript + React Router + TanStack Query | SPA simples; mesma estrutura do protótipo |
| Back | Node 20 + Fastify (ou Express) + Zod + Kysely | Contratos já definidos em Zod; Kysely tipado |
| Banco | PostgreSQL 16, migrações versionadas (Kysely migrator, node-pg-migrate ou Flyway) | |
| Fotos | Storage S3-compatível (Cloudflare R2 / S3) com **presigned PUT** | bytes não passam pela API |
| Auth | Sessão em cookie httpOnly + bcrypt; usuário admin único | |
| CI/CD | GitLab CI: lint → typecheck → test → build → deploy | stack do dev |

Alternativa mais enxuta: **Next.js (App Router) + Postgres** — ganha SSR/SEO nativo (o protótipo não tinha SSR).
Se escolher Next, mantenha os mesmos contratos das rotas de API.

---

## 3. Banco de dados (migração inicial)

```sql
CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE users (
  id serial PRIMARY KEY,
  email text NOT NULL,
  display_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  password_hash text,                       -- null até definir senha
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_lower_uidx ON users (lower(email));

CREATE TABLE sessions (
  id text PRIMARY KEY,                       -- 32 bytes random hex
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_accessed timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX sessions_user_idx ON sessions (user_id);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id serial PRIMARY KEY,
  category_id integer NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  image_url text,
  price_from numeric(10,2) CHECK (price_from IS NULL OR price_from >= 0),
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_active_idx ON products (category_id, active, sort_order);
CREATE INDEX products_featured_idx ON products (featured) WHERE active AND featured;

CREATE TABLE notices (
  id serial PRIMARY KEY,
  message text NOT NULL,
  starts_at date,
  ends_at date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (starts_at IS NULL OR ends_at IS NULL OR starts_at <= ends_at)
);
```

### Seed

```sql
INSERT INTO categories (slug, name, description, sort_order) VALUES
('buques', 'Buquês', 'Buquês e arranjos para presentear em qualquer ocasião.', 1),
('plantas', 'Plantas', 'Folhagens e plantas ornamentais para casa e jardim.', 2),
('cactos-e-suculentas', 'Cactos e Suculentas', 'Pouca rega, muita personalidade.', 3),
('frutiferas', 'Frutíferas e Mudas', 'Mudas de frutíferas, horta e temperos.', 4),
('pelucias', 'Pelúcias e Presentes', 'Pelúcias para acompanhar flores e presentes.', 5),
('vasos-e-insumos', 'Vasos, Insumos e Acessórios', 'Vasos, terra, adubo e ferramentas de jardinagem.', 6);

INSERT INTO products (category_id, name, description, featured, sort_order)
SELECT c.id, p.name, p.description, p.featured, p.sort_order
FROM (VALUES
  ('buques', 'Buquê de girassóis', 'Girassóis com margaridas em papel kraft.', true, 1),
  ('buques', 'Buquê de rosas', 'Rosas brancas e vermelhas embaladas para presente.', true, 2),
  ('plantas', 'Costela-de-adão (monstera)', 'Folhagem tropical para meia-sombra.', true, 1),
  ('cactos-e-suculentas', 'Cactos sortidos', 'Variedades em vaso pequeno.', true, 1),
  ('frutiferas', 'Mudas frutíferas', 'Limão, jabuticaba, acerola e outras.', false, 1),
  ('pelucias', 'Coelhinho de pelúcia', 'Embalado para presente.', true, 1),
  ('vasos-e-insumos', 'Vasos e terra adubada', 'Vasos de barro e cerâmica, terra e adubo.', false, 1)
) AS p(slug, name, description, featured, sort_order)
JOIN categories c ON c.slug = p.slug;

-- Admin sem senha: definir via fluxo "Esqueci minha senha" ou script CLI (nunca senha hardcoded)
INSERT INTO users (email, display_name, role) VALUES ('<email-do-admin>', 'Rosa do Deserto', 'admin');
```

Imagens: o seed do protótipo usava fotos **geradas por IA, provisórias**. No novo projeto, deixe `image_url` nulo
(o card mostra "Foto em breve") ou suba placeholders próprios até a loja enviar as fotos reais.

---

## 4. API (contratos)

Todas as respostas JSON. Erros: `{ "error": string }` com status adequado
(400 validação, 401 sem sessão, 403 não-admin, 404, 409 conflito — `23505` unique / `23503` FK, 500 genérico sem vazar detalhes).

### Público
`GET /api/catalog` → `{ categories, products, notices }`
- `categories`: `active = true`, ordem `sort_order, name`
- `products`: `products.active AND categories.active`, ordem `sort_order, name`
- `notices`: `active` e dentro do período, usando a data em `America/Sao_Paulo`:
  `(starts_at IS NULL OR starts_at <= hoje) AND (ends_at IS NULL OR ends_at >= hoje)`, ordem `created_at desc`
- `Cache-Control: public, max-age=60`

### Auth
- `POST /api/auth/login` `{ email, password }` → define cookie de sessão (httpOnly, Secure, SameSite=Lax). Rate limit por IP + e-mail.
- `POST /api/auth/logout`
- `GET /api/auth/session` → `{ user }` ou 401
- `POST /api/auth/request-password-reset` `{ email }` → envia código de uso único (hash no banco, expira, limite de tentativas). Resposta sempre igual, exista o e-mail ou não.
- `POST /api/auth/reset-password` `{ email, code, newPassword (min 8) }`
- **Cadastro público desativado** (não expor rota de registro).

### Admin (todas exigem sessão com `role = 'admin'`, checado no servidor)
| Rota | Body (Zod) | Retorno |
|---|---|---|
| `GET /api/admin/catalog` | — | tudo, inclusive inativos |
| `POST /api/admin/products/save` | `{ id?, categoryId:int>0, name:2..120, description:≤500\|null, imageUrl:≤1000\|null, priceFrom:0..100000\|null, featured, active, sortOrder:0..9999 }` | `{ id }` (update seta `updated_at`) |
| `POST /api/admin/products/delete` | `{ id }` | `{ ok: true }` |
| `POST /api/admin/categories/save` | `{ id?, name:2..80, slug:/^[a-z0-9]+(-[a-z0-9]+)*$/, description:≤300\|null, imageUrl\|null, active, sortOrder }` | `{ id }` |
| `POST /api/admin/categories/delete` | `{ id }` | `{ ok: true }` — 409 se houver produtos (FK RESTRICT) |
| `POST /api/admin/notices/save` | `{ id?, message:3..280, startsAt:'YYYY-MM-DD'\|null, endsAt\|null, active }` + refine início ≤ fim | `{ id }` |
| `POST /api/admin/notices/delete` | `{ id }` | `{ ok: true }` |
| `POST /api/admin/images/upload-url` | `{ contentType: image/jpeg\|image/png\|image/webp, sizeBytes ≤ 8 MB }` | `{ presignedUrl, headers, url }` |

Upload: o servidor gera o nome (`catalog/<uuid>.<ext>`), cria presigned PUT (15 min) e devolve a URL pública.
O front faz `PUT` direto no storage e salva só a `url` no produto/categoria. Nunca aceitar caminho vindo do cliente.

(Se preferir REST "puro", troque por `PUT/DELETE /api/admin/products/:id` — os contratos de payload continuam os mesmos.)

---

## 5. Páginas

### Layout público (todas exceto login/admin)
- **Faixa de avisos** (fundo preto) no topo se houver avisos vigentes; mensagens unidas por " · ".
- **Header sticky** com blur: monograma "RD" (círculo com borda, sombra interna rosa embaixo) + "Rosa do Deserto" / "GARDEN | FLORICULTURA" (micro label espaçado). Nav: Início, Catálogo, Canais oficiais + botão pill "Pedir pelo WhatsApp". Menu hambúrguer abaixo de 820px.
- **Rodapé**: marca, endereço (link mapa), horário, contato oficial (WhatsApp, ícones Instagram/Facebook, "Cuidado com golpes →"), © ano, link discreto "Área da loja" → `/admin`.
- **Botão flutuante** WhatsApp (58px, rosa, canto inferior direito).

### `/` Home
1. Hero 2 colunas (empilha no mobile com imagem acima): eyebrow "Garden · Floricultura · São Paulo"; H1 "Flores e plantas *escolhidas a dedo* para a sua casa." (itálico rosa); lead "Buquês, plantas, frutíferas, pelúcias, vasos e insumos — na nossa loja do Jardim Adutora ou com pedido direto pelo WhatsApp."; botões "Pedir pelo WhatsApp" (msg: "Olá! Vim pelo site e gostaria de fazer um pedido.") e "Ver catálogo".
2. "Nossas categorias": grid de cards quadrados com foto + nome sobre gradiente escuro → `/catalogo?categoria=<slug>`. Mobile: 2 colunas.
3. "Destaques da estação": até 8 produtos `featured` (ProductCard).
4. Bloco alerta (borda esquerda rosa): "Cuidado com golpes — A Rosa do Deserto **não faz rifas** e **não pede pagamento em grupos** de WhatsApp. Nosso único número é o (11) 99103-9621." + botão "Ver canais oficiais".
5. "Venha nos visitar": endereço, horários, botão "Como chegar" + iframe do Google Maps.
- `<title>`: "Rosa do Deserto — Floricultura e Garden no Jardim Adutora, São Paulo"; meta description; JSON-LD `Florist` com endereço, telefone `+55 11 99103-9621`, `openingHoursSpecification` e `sameAs` (Instagram, Facebook).

### `/catalogo`
- Título = nome da categoria ativa ou "Tudo o que temos na loja"; lead = descrição da categoria ou "Escolha o produto e toque em “Pedir” — você fala direto com a gente no WhatsApp. Disponibilidade e valores podem variar com a estação."
- Chips de categoria ("Todos" + categorias), estado na query `?categoria=<slug>` (replace).
- Busca com debounce 200 ms, sem acento/case (`normalize('NFD')`), em nome + descrição.
- Estados: skeleton, erro com "Tentar novamente", vazio ("Nenhum produto encontrado. Fale com a gente no WhatsApp — talvez tenhamos na loja!").
- Grid `minmax(230px,1fr)`; mobile 2 colunas.

### ProductCard
Imagem quadrada (ou "Foto em breve"), micro label da categoria (verde), nome (serifa), descrição, rodapé com
"a partir de **R$ X**" (Intl pt-BR BRL) ou "Consulte valores" + botão pill "Pedir" →
WhatsApp com "Olá! Vi no site e tenho interesse em: <nome>. Está disponível?"

### `/canais-oficiais`
- H1 "Canais oficiais"; lead: "Golpistas estão usando o nome e o endereço da Rosa do Deserto em rifas, grupos e ofertas falsas. Estes são os **únicos** canais da loja — qualquer outro não tem vínculo com a gente."
- Cards: WhatsApp (único número), Instagram (perfil verificado), Facebook, Canal oficial no WhatsApp, Loja física.
- Coluna "A Rosa do Deserto nunca…": não faz rifas/sorteios pagos/"ações entre amigos"; não tem grupos de WhatsApp para vendas (ex.: "Família Rosas do Deserto"); não pede pagamento antecipado por grupos/perfis/números diferentes; não oferece promoções "boas demais", como orquídeas por R$ 30 em grupos.
- Coluna "Como se proteger": conferir o número exato; na dúvida ligar ou ir à loja; não compartilhar dados/códigos SMS; denunciar e avisar pelo WhatsApp oficial.

### `/login`
Card centralizado: "← Voltar ao site", monograma, "Área da loja", "Acesso restrito para cadastrar produtos e avisos.", e-mail/senha, "Esqueci minha senha" (fluxo de código). Sucesso → `/admin`. `noindex`. Se já logado → `/admin`.

### `/admin` (só role admin; senão redireciona para login / 403)
Header "Administração da loja" + "Ver site" + "Sair". Tabs:
- **Produtos**: filtro por categoria, "Novo produto", lista (thumb, nome, ⭐ se destaque, categoria · preço, badge "Oculto"), editar/excluir (confirmação). Dialog: upload de foto, nome, categoria, descrição, preço "a partir de" (aceita `49,90`; vazio = "Consulte valores"), ordem, switches "Destaque na página inicial" e "Visível no site".
- **Categorias**: lista com contagem de produtos; excluir desabilitado se houver produtos. Dialog: foto, nome (gera slug automaticamente ao criar), identificador na URL, descrição, ordem, visível.
- **Avisos**: lista com período ("de dd/mm a dd/mm", "a partir de", "até", "sem data de término"). Dialog: mensagem (contador /280), datas opcionais, ligado.
- Feedback por toast; mutations invalidam as queries pública e admin.

---

## 6. Design system

Conceito: **"botanical atelier"** — floricultura de bairro como um diário de flores prensadas. Papel creme,
tipografia preta (monograma RD), **um** acento rosa (faixa do logo) só para CTAs e ornamentos; verde-folha
raro (tags de planta, confirmações). Light only. Espaçoso nas páginas públicas, compacto no admin.

Fontes (Google Fonts): **Fraunces** (display, com itálico para ênfase) + **Inter Tight** (texto/UI).
Micro labels: uppercase, `letter-spacing: .18–.24em`, 0.65–0.7rem.

```css
:root {
  --background: #f8f3ec; --foreground: #1c1a17;
  --surface: #f1e9de; --card: #fffbf5; --muted: #ebe2d5; --muted-foreground: #6b6359;
  --primary: #b8336a; --primary-foreground: #fffbf5;     /* rosa — CTAs */
  --secondary: #1c1a17; --secondary-foreground: #f8f3ec; /* preto */
  --accent: #2f5d3a; --accent-foreground: #f8f3ec;       /* verde-folha */
  --error: #b42318; --warning: #b7791f; --border: #e2d7c8;
  --font-display: "Fraunces", Georgia, serif;
  --font-base: "Inter Tight", system-ui, sans-serif;
  --shadow: 0 1px 2px rgba(60,40,20,.06);
  --shadow-md: 0 4px 14px rgba(60,40,20,.08);
  --shadow-lg: 0 12px 32px rgba(60,40,20,.12);
  --shadow-focus: 0 0 0 3px rgba(184,51,106,.25);
  --radius-sm: 6px; --radius: 10px; --radius-md: 14px; --radius-lg: 22px; --radius-full: 9999px;
}
```

Cards: fundo `--card`, borda 1px `--border`, raio 14px, sombra leve, hover sobe 3px. Botões em pill.
Títulos de seção: Fraunces 400, `clamp(1.7rem, 3.2vw, 2.4rem)`. H1 hero: `clamp(2.3rem, 5.4vw, 4.2rem)`, `line-height: 1.04`.
Container máx. 1200px, gutter `clamp(1rem, 4vw, 3rem)`. Breakpoint principal 820px.

---

## 7. Requisitos não funcionais

- **Segurança:** checagem de admin em toda rota admin (não confiar no front); cookies httpOnly/Secure; bcrypt; rate limit em login e reset (IP real atrás do proxy configurado corretamente); validação Zod em toda entrada; arrays com `.max()`; uploads só nos MIME permitidos e com nome gerado no servidor; sem segredos no código (`.env` + variáveis do GitLab CI protegidas/mascaradas).
- **LGPD:** sem formulários públicos nem cookies de rastreamento → sem banner. Se adicionar analytics, use um sem cookie.
- **Performance:** imagens `loading="lazy"`, preferir WebP; considerar redimensionar no upload (ex.: `sharp` para 1200px).
- **SEO:** títulos/descrições por página, JSON-LD `Florist`, `sitemap.xml`, `robots.txt` bloqueando `/admin` e `/login`, Open Graph (preview no WhatsApp). SSR/SSG recomendado (Next ou pré-render) — o protótipo não tinha.
- **Acessibilidade:** `aria-label` nos ícones, `aria-expanded` no menu, foco visível, contraste AA.
- **Testes mínimos:** schemas Zod (preço, slug, datas), filtro de avisos por período, guarda de admin (401/403), busca sem acento.

---

## 8. Pendências com a loja

- Fotos reais (galeria do celular / Drive) e autorização de uso.
- Entrega? Formas de pagamento? Abre domingo/feriados? Preço no site ou "consulte"?
- Domínio (`rosadodeserto.com.br`?) e e-mail para envio dos códigos de senha.
