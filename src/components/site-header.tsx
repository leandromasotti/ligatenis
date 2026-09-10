"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { BotonLink } from "@/components/ui/button";

const NAVEGACION = [
  { href: "/categorias", texto: "Categorías" },
  { href: "/torneos", texto: "Torneos" },
  { href: "/ranking", texto: "Ranking" },
  { href: "/equipo-tecnico", texto: "Equipo técnico" },
  { href: "/sponsors", texto: "Sponsors" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  const esActivo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="border-line bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="rounded-md" aria-label="Inicio">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 md:flex">
          {NAVEGACION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={esActivo(item.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-[0.9rem] transition-colors ${
                esActivo(item.href)
                  ? "bg-verde-soft text-verde font-semibold"
                  : "text-foreground-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              {item.texto}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {/*
            La visibilidad va en el envoltorio y no en el botón: BotonLink ya trae
            `inline-flex` en sus clases base y le gana a un `hidden` suelto, así que
            los botones no se ocultaban y el header desbordaba en el celular.
          */}
          <span className="hidden items-center gap-2 sm:flex">
            <BotonLink href="/ingresar" variante="secundaria" tamano="sm">
              Ingresar
            </BotonLink>
            <BotonLink href="/registrarme" tamano="sm">
              Registrarme
            </BotonLink>
          </span>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label="Abrir menú"
            className="border-line hover:bg-surface-2 grid h-9 w-9 place-items-center rounded-md border md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d={abierto ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      {abierto && (
        <div id="menu-movil" className="border-line bg-background border-t md:hidden">
          <nav aria-label="Principal (móvil)" className="mx-auto flex max-w-6xl flex-col p-3">
            {NAVEGACION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className={`rounded-md px-3 py-2.5 text-[0.95rem] ${
                  esActivo(item.href)
                    ? "bg-verde-soft text-verde font-semibold"
                    : "text-foreground-muted"
                }`}
              >
                {item.texto}
              </Link>
            ))}
            <div className="border-line mt-2 flex gap-2 border-t pt-3">
              <BotonLink
                href="/ingresar"
                variante="secundaria"
                className="flex-1"
                onClick={() => setAbierto(false)}
              >
                Ingresar
              </BotonLink>
              <BotonLink href="/registrarme" className="flex-1" onClick={() => setAbierto(false)}>
                Registrarme
              </BotonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
