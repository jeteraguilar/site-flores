"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { GENERIC_ORDER_MESSAGE, whatsappLink } from "@/lib/store-info";
import { Monogram, WhatsappIcon } from "./Icons";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/canais-oficiais", label: "Canais oficiais" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="Rosa do Deserto — página inicial">
          <Monogram />
          <span className="brand-text">
            <span className="brand-name">Rosa do Deserto</span>
            <span className="micro">Garden | Floricultura</span>
          </span>
        </Link>

        <nav id="site-nav" className="site-nav" data-open={open} aria-label="Principal">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="nav-link" aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
          <a className="btn btn-primary btn-sm" href={whatsappLink(GENERIC_ORDER_MESSAGE)} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon size={16} /> Pedir pelo WhatsApp
          </a>
        </nav>

        <button
          type="button"
          className="btn btn-ghost btn-icon menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
