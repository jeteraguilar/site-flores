export const storeInfo = {
  name: "Rosa do Deserto",
  fullName: "Rosa do Deserto — Garden | Floricultura",
  tagline: "Garden | Floricultura",
  phoneDisplay: "(11) 99103-9621",
  phoneE164: "5511991039621",
  phoneIntl: "+55 11 99103-9621",
  street: "R. Luís Juliani, 1023",
  addressLine: "R. Luís Juliani, nº 1023 — Jardim Adutora",
  city: "São Paulo — SP",
  mapsQuery: "R. Luís Juliani, 1023 - Jardim Adutora, São Paulo - SP",
  hours: [
    { days: "Segunda a sexta", time: "09h às 18h30" },
    { days: "Sábado", time: "08h às 17h" },
    { days: "Domingo", time: "Fechado" },
  ],
  instagramHandle: "@garden.rosadodeserto",
  instagramUrl: "https://instagram.com/garden.rosadodeserto",
  facebookUrl: "https://www.facebook.com/garden.rosadodeserto",
  whatsappChannelUrl: "https://whatsapp.com/channel/0029Vb678Vm9Gv7NZJaAmB0K",
  whatsappCatalogUrl: "https://wa.me/c/5511991039621",
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${storeInfo.phoneE164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const mapsLink = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeInfo.mapsQuery)}`;

export const mapsEmbed = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(storeInfo.mapsQuery)}&output=embed`;

export const productOrderMessage = (name: string) =>
  `Olá! Vi no site e tenho interesse em: ${name}. Está disponível?`;

export const GENERIC_ORDER_MESSAGE = "Olá! Vim pelo site e gostaria de fazer um pedido.";
