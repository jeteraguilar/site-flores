import { whatsappLink } from "./store-info";
export { normalizeSearch } from "./text";

/** "Ask about X" link for the empty search state. */
export const whatsappLinkSafe = (query: string) => {
  const q = query.trim().slice(0, 80);
  return whatsappLink(q ? `Olá! Vocês têm ${q}?` : "Olá! Vim pelo site e gostaria de tirar uma dúvida.");
};
