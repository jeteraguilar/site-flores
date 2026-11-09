import "server-only";
import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HttpError } from "./http";
import type { ALLOWED_IMAGE_TYPES } from "../schemas";

const EXT: Record<(typeof ALLOWED_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

let client: S3Client | null = null;

function config() {
  const { S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_BASE_URL } = process.env;
  if (!S3_BUCKET || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_PUBLIC_BASE_URL) {
    throw new HttpError(503, "Envio de fotos não configurado no servidor (variáveis S3_*).");
  }
  client ??= new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
  });
  return { client, bucket: S3_BUCKET, publicBase: S3_PUBLIC_BASE_URL.replace(/\/+$/, "") };
}

/** Presigned PUT (15 min). The key is server-generated; clients never choose paths. */
export async function createImageUploadUrl(contentType: (typeof ALLOWED_IMAGE_TYPES)[number], sizeBytes: number) {
  const { client, bucket, publicBase } = config();
  const key = `catalog/${randomUUID()}.${EXT[contentType]}`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: sizeBytes,
    CacheControl: "public, max-age=31536000, immutable",
  });
  const presignedUrl = await getSignedUrl(client, command, { expiresIn: 900 });
  return {
    presignedUrl,
    headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" },
    url: `${publicBase}/${key}`,
  };
}
