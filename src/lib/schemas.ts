import { z } from "zod";

/** Admin payload contracts — shared by API route handlers and the admin UI. */

const id = z.number().int().positive();
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((v) => (v ? v : null));

export const idSchema = z.object({ id });

export const productSchema = z.object({
  id: id.optional(),
  categoryId: z.number({ error: "Escolha uma categoria." }).int().positive({ error: "Escolha uma categoria." }),
  name: z.string().trim().min(2, { error: "Informe o nome do produto." }).max(120),
  description: optionalText(500),
  imageUrl: optionalText(1000),
  priceFrom: z.number().nonnegative({ error: "Preço não pode ser negativo." }).max(100000).nullable(),
  featured: z.boolean(),
  active: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});
export type ProductInput = z.input<typeof productSchema>;

export const categorySchema = z.object({
  id: id.optional(),
  name: z.string().trim().min(2, { error: "Informe o nome da categoria." }).max(80),
  slug: z
    .string()
    .trim()
    .min(2, { error: "Identificador muito curto." })
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { error: "Identificador: só letras minúsculas, números e hífens." }),
  description: optionalText(300),
  imageUrl: optionalText(1000),
  active: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});
export type CategoryInput = z.input<typeof categorySchema>;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Data inválida." })
  .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), { error: "Data inválida." })
  .nullable();

export const noticeSchema = z
  .object({
    id: id.optional(),
    message: z.string().trim().min(3, { error: "Escreva o aviso." }).max(280, { error: "Máximo de 280 caracteres." }),
    startsAt: isoDate,
    endsAt: isoDate,
    active: z.boolean(),
  })
  .refine((v) => !v.startsAt || !v.endsAt || v.startsAt <= v.endsAt, {
    error: "A data final deve ser igual ou posterior à inicial.",
    path: ["endsAt"],
  });
export type NoticeInput = z.input<typeof noticeSchema>;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export const uploadUrlSchema = z.object({
  contentType: z.enum(ALLOWED_IMAGE_TYPES, { error: "Envie uma imagem JPG, PNG ou WebP." }),
  sizeBytes: z.number().int().positive().max(MAX_IMAGE_BYTES, { error: "Imagem acima de 8 MB." }),
});

export const loginSchema = z.object({
  email: z.email({ error: "E-mail inválido." }).max(254),
  password: z.string().min(1, { error: "Informe a senha." }).max(200),
});

export const resetRequestSchema = z.object({ email: z.email({ error: "E-mail inválido." }).max(254) });

export const resetPasswordSchema = z.object({
  email: z.email({ error: "E-mail inválido." }).max(254),
  code: z.string().trim().regex(/^\d{6}$/, { error: "O código tem 6 dígitos." }),
  newPassword: z.string().min(8, { error: "Use pelo menos 8 caracteres." }).max(200),
});
