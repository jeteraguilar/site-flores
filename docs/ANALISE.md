# Rosa do Deserto — Análise para criação do site

> Data: 2026-11-08 · Fontes: perfil do Instagram `@garden.rosadodeserto` (print), mensagem de boas-vindas do WhatsApp Business e links oficiais divulgados pela loja.
> **Não verificado:** o conteúdo do catálogo do WhatsApp (produtos, preços), os posts individuais e a página do Facebook não foram acessados — exigem login/app. Itens marcados com ❓ precisam de confirmação com a loja.

---

## 1. Resumo executivo

A Rosa do Deserto é uma **loja física de bairro** (viveiro, jardinagem e floricultura) em São Paulo que hoje vende **100% via WhatsApp**, usando o Instagram como vitrine. O negócio tem presença digital ativa (perfil verificado, 271 posts, destaques sazonais, canal oficial no WhatsApp), mas **não tem um endereço próprio na web**.

O maior problema visível **não é vendas, é confiança**: três dos posts fixados tratam de **golpes usando o nome e o endereço da loja** (rifas falsas, grupos falsos de WhatsApp "Família Rosas do Deserto", ofertas de orquídeas "por R$ 30,00"). Um site oficial com domínio próprio resolve isso melhor que qualquer post, porque vira a **fonte única da verdade** sobre quais canais são legítimos.

**Recomendação:** site institucional + catálogo vitrine, com pedido via WhatsApp (link com mensagem pré-preenchida), forte em SEO local. Sem e-commerce/checkout no MVP.

---

## 2. O que já existe (inventário)

| Item | Dado |
|---|---|
| Nome | Rosa do Deserto — *Garden \| Floricultura* |
| Categoria | Loja de viveiro e jardinagem / floricultura |
| Endereço | R. Luís Juliani, nº 1023 — Jardim Adutora — São Paulo/SP |
| WhatsApp | (11) 99103-9621 — WhatsApp Business com catálogo (`wa.me/c/5511991039621`) |
| Horário | Seg–Sex 09h–18h30 · Sáb 08h–17h · Dom: fechado ❓ |
| Instagram | `@garden.rosadodeserto` — verificado, 271 posts, 781 seguidores |
| Facebook | `facebook.com/garden.rosadodeserto` |
| Canal WhatsApp | `whatsapp.com/channel/0029Vb678Vm9Gv7NZJaAmB0K` |
| Logo | Monograma "RD" em preto, faixa "ROSA DO DESERTO" com detalhe rosa, subtítulo "GARDEN \| FLORICULTURA" |

### Mix de produtos (bio + vitrine da fachada)

- **Buquês e arranjos** (girassóis, rosas, margaridas — destaques "2026")
- **Flores** e **orquídeas**
- **Plantas** ornamentais (folhagens, ex.: costela-de-adão/monstera nos destaques)
- **Cactos e suculentas** (destaque "Nov 26")
- **Bonsai**
- **Frutíferas** e **mudas**, **horta**
- **Pelúcias** (presentes — ursos/coelhos embalados)
- **Acessórios** de jardinagem, **insumos** (terra, adubo) e **vasos**

### Leitura do conteúdo

- **Posts fixados:** 2× "Alerta de golpe" + foto da fachada. Indica dor real e recorrente.
- **Post "Aviso — Não abriremos nesse…":** fechamentos em feriados são comunicados só no Instagram → o site precisa de **banner de avisos** editável.
- **Destaques organizados por mês/temporada** → o catálogo muda com a estação; o site deve ser fácil de atualizar pelo dono, não pelo dev.
- **Público:** consumidor final do bairro/região, compra de impulso e presente (datas comemorativas), além de clientes recorrentes de jardinagem.

---

## 3. Problemas e oportunidades

| # | Problema observado | O que o site resolve |
|---|---|---|
| 1 | Golpistas usando nome/endereço (rifas, grupos falsos, ofertas de orquídea) | Página **"Canais oficiais"** com a lista fechada de números/perfis e o aviso "não fazemos rifas nem pedimos pagamento antecipado por grupos". Domínio próprio é verificável. |
| 2 | Quem busca "floricultura perto de mim" no Google não encontra site | SEO local + Google Business Profile apontando para o site |
| 3 | Catálogo só existe dentro do WhatsApp (não indexável, não compartilhável fora do app) | Catálogo web com URL por categoria/produto |
| 4 | Avisos de horário/feriado ficam perdidos no feed | Banner de avisos no topo + horário estruturado (schema.org) |
| 5 | Atendimento manual repete as mesmas perguntas (horário, entrega, pagamento) | Página de FAQ + mensagem de WhatsApp pré-preenchida com o produto |
| 6 | Link da bio do Instagram é um `wa.me/message/...` genérico | Bio passa a apontar para o site (que tem o botão de WhatsApp) |

---

## 4. Proposta de site (MVP)

### 4.1 Mapa do site

```
/                      Home
/catalogo              Categorias (buquês, plantas, cactos, frutíferas, presentes, insumos e vasos)
/catalogo/[categoria]  Lista de produtos
/catalogo/[categoria]/[produto]   (opcional no MVP)
/datas-especiais       Dia das Mães, Namorados, Finados, Natal… (sazonal)
/a-loja                Sobre, fotos da fachada/interior, como chegar (mapa)
/canais-oficiais       Contatos legítimos + alerta de golpes
/duvidas               FAQ: entrega, pagamento, encomendas, cuidados
/dicas                 (fase 2) cuidados com plantas — SEO de cauda longa
```

### 4.2 Home — blocos

1. Hero com foto real da loja/buquê + CTA **"Pedir pelo WhatsApp"**
2. Banner de avisos (feriados, horário especial) — some quando vazio
3. Categorias em cards (fotos dos destaques do Instagram)
4. Destaques da temporada
5. Faixa de confiança: "Loja física desde ❓ · Perfil verificado · Endereço"
6. Horário + mapa + endereço
7. Selo/link **"Cuidado com golpes — veja nossos canais oficiais"**
8. Rodapé: Instagram, Facebook, canal do WhatsApp

### 4.3 Fluxo de pedido

Cada produto tem botão que abre:

```
https://wa.me/5511991039621?text=Olá!%20Vi%20no%20site%20e%20tenho%20interesse%20em%3A%20Buquê%20de%20girassóis
```

Mantém o processo atual da loja (atendimento humano no WhatsApp), sem mudar operação. Preço é opcional: dá para exibir "a partir de" ou "consulte".

### 4.4 Identidade visual

- Base: preto do monograma + rosa da faixa do logo + verde (plantas) como cor de apoio
- Fundo claro, muitas fotos reais (o produto vende pela imagem)
- Tipografia: serifada elegante para títulos (ecoa o logo) + sans legível para texto
- **Mobile-first** — o tráfego virá quase todo do Instagram/WhatsApp no celular

---

## 5. Arquitetura técnica

### Opções

| Abordagem | Prós | Contras | Custo/mês |
|---|---|---|---|
| **A. Astro (SSG) + CMS git-based (Decap/Pages CMS) + Cloudflare Pages** | Rápido, SEO excelente, hospedagem grátis, dono edita produtos/avisos num painel, zero servidor | Exige setup inicial do CMS; painel é simples | ~R$ 0 (+ domínio ~R$ 40/ano) |
| B. Next.js + Postgres + painel admin próprio | Flexível, pronto para e-commerce | Over-engineering para o MVP; servidor/banco para manter | R$ 0–100 |
| C. Construtor (Wix, Nuvemshop, Shopify) | Dono opera sozinho, checkout pronto | Mensalidade, lock-in, SEO/perf medianos, sem controle | R$ 60–300 |
| D. Integrar catálogo do WhatsApp via API | Uma fonte de produtos só | Catálogo do WhatsApp Business App **não tem API pública**; exigiria migrar para Meta Commerce Manager/WABA — complexidade e burocracia altas | — |

**Recomendação: A.** Projeto voluntário/pequeno comércio: custo zero de infraestrutura, nada para manter rodando e o dono atualiza produtos e avisos sem depender de dev. Se houver demanda real de venda online, evoluir para checkout (fase 3) sem jogar fora o front.

### Stack sugerida

- **Astro 5** + TypeScript + Tailwind CSS
- **Content Collections** (Markdown/JSON versionado) para produtos, categorias e avisos
- **Pages CMS** ou **Decap CMS** para o painel do lojista (login via GitHub)
- **Cloudflare Pages** (ou Netlify) — deploy por push, HTTPS, CDN
- Imagens: `astro:assets` (WebP/AVIF, lazy-load) — fotos do Instagram reprocessadas
- Analytics sem cookie: Cloudflare Web Analytics ou Plausible (evita banner LGPD)
- Domínio: `rosadodeserto.com.br` ❓ (verificar disponibilidade no Registro.br)

### SEO local (prioridade alta)

- **Google Business Profile** completo (fotos, horário, categoria "Floricultura", link do site) — provavelmente gera mais tráfego que o próprio site
- JSON-LD `Florist` (`LocalBusiness`) com `address`, `geo`, `openingHoursSpecification`, `telephone`, `sameAs` (Instagram/Facebook)
- Títulos e textos com termos locais: "floricultura no Jardim Adutora", "buquê de flores em São Paulo", "cactos e suculentas", "mudas frutíferas"
- `sitemap.xml`, Open Graph (preview bonito ao compartilhar no WhatsApp)
- Core Web Vitals: SSG + imagens otimizadas → LCP < 2,5 s no 4G

---

## 6. Roadmap

| Fase | Entrega | Esforço estimado |
|---|---|---|
| 0 | Levantamento com a loja (perguntas da seção 8), fotos, textos | 1 semana |
| 1 — MVP | Home, catálogo por categoria, canais oficiais, a loja, FAQ, WhatsApp pré-preenchido, SEO + GBP, deploy | 2–3 semanas |
| 2 | CMS para o lojista, banner de avisos, datas especiais, blog de dicas | 1–2 semanas |
| 3 (se fizer sentido) | Pedido online com Pix (Mercado Pago/Asaas), área de entrega por CEP, agendamento de entrega para datas | 3–4 semanas |

---

## 7. Riscos e cuidados

- **Imagens:** usar só fotos da própria loja (autorização formal do dono). Fotos com pessoas (ex.: post de alerta de golpe) precisam de consentimento.
- **LGPD:** MVP sem formulário nem cookies de rastreamento → sem coleta de dados pessoais. Se entrar formulário/checkout, incluir política de privacidade.
- **Golpes:** o site também pode ser clonado — publicar o domínio oficial na bio do Instagram, no canal do WhatsApp e no GBP para criar a referência.
- **Manutenção:** site desatualizado (preço/horário errado) é pior que nenhum. Por isso o CMS e preço "a partir de"/"consulte".
- **Dependência do WhatsApp Business App:** mantido como canal de venda; o site não substitui, só alimenta.

---

## 8. Perguntas para a loja (antes de começar)

1. Fazem **entrega**? Qual região/raio, taxa e prazo? Entregam em datas (Finados, Dia das Mães) com agendamento?
2. **Formas de pagamento** (Pix, cartão, link de pagamento)?
3. Abrem **domingo/feriados**? Existe calendário fixo de fechamento?
4. Querem **preços no site** ou "consulte pelo WhatsApp"?
5. Quantos produtos ativos no catálogo do WhatsApp? Quem vai atualizar o site?
6. Desde quando a loja existe? Há uma história/fundadora para a página "A loja"?
7. Têm **domínio** ou e-mail profissional? CNPJ para registrar `.com.br`?
8. Têm **Google Business Profile** ativo? Avaliações?
9. Fazem **eventos/decoração** (casamentos, empresas) ou paisagismo? Seria outra linha no site.
10. Autorizam uso das fotos do Instagram/Facebook e da foto da fachada?

---

## 9. Próximos passos

1. Responder às perguntas da seção 8
2. Validar o mapa do site e a direção visual (wireframe/protótipo)
3. Criar o projeto Astro neste repositório e publicar um preview
