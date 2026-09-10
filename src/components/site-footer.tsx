import Link from "next/link";
import { Raqueta } from "@/components/logo";
import { TiraSponsors } from "@/components/sponsors";
import { CATEGORIAS, CLUBES } from "@/lib/categorias";
import { enlaceWhatsapp, WHATSAPP } from "@/lib/contacto";

export function SiteFooter() {
  return (
    <footer className="border-line bg-surface mt-16 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Raqueta className="h-7 w-7" decorativo />
            <span className="font-display text-[0.95rem] font-semibold">
              Liga Dolorense de Tenis
            </span>
          </div>
          <p className="text-foreground-muted max-w-[38ch] text-[0.9rem]">
            Torneos de singles y dobles en Dolores y la zona, con ranking por categoría. Si jugás en
            la liga, creá tu cuenta y completá tu perfil.
          </p>
          <p className="text-muted max-w-[38ch] text-[0.82rem]">Sedes: {CLUBES.join(" · ")}</p>
        </div>

        <nav aria-label="Categorías" className="flex flex-col gap-2">
          <span className="eyebrow text-muted">Categorías</span>
          {CATEGORIAS.map((categoria) => (
            <Link
              key={categoria.slug}
              href={`/categorias/${categoria.slug}`}
              className="text-foreground-muted hover:text-verde text-[0.88rem]"
            >
              {categoria.nombre}
            </Link>
          ))}
        </nav>

        <nav aria-label="Secciones" className="flex flex-col gap-2">
          <span className="eyebrow text-muted">La liga</span>
          <Link href="/torneos" className="text-foreground-muted hover:text-verde text-[0.88rem]">
            Torneos
          </Link>
          <Link href="/ranking" className="text-foreground-muted hover:text-verde text-[0.88rem]">
            Ranking
          </Link>
          <Link
            href="/equipo-tecnico"
            className="text-foreground-muted hover:text-verde text-[0.88rem]"
          >
            Equipo técnico
          </Link>
          <Link
            href="/registrarme"
            className="text-foreground-muted hover:text-verde text-[0.88rem]"
          >
            Registrarme
          </Link>
          {WHATSAPP && (
            <a
              href={enlaceWhatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-verde text-[0.88rem]"
            >
              WhatsApp de la liga ↗
            </a>
          )}
          <a
            href="https://www.facebook.com/p/Liga-Dolorense-de-Tenis-100090742189864/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-muted hover:text-verde text-[0.88rem]"
          >
            Facebook de la liga ↗
          </a>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <TiraSponsors />
      </div>

      <div className="border-line border-t">
        <div className="text-muted mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[0.8rem] sm:px-6">
          <span>© {new Date().getFullYear()} Liga Dolorense de Tenis</span>
          <span>Dolores, Buenos Aires</span>
        </div>
      </div>
    </footer>
  );
}
