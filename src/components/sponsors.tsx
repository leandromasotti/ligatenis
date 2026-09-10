import Link from "next/link";
import { sponsors } from "@/lib/datos/anuncios";

/** Tira de sponsors del pie: el lugar más barato de vender, sin costo de diseño. */
export function TiraSponsors() {
  const lista = sponsors();
  if (lista.length === 0) return null;

  return (
    <div className="border-line flex flex-wrap items-center gap-x-4 gap-y-2 border-t py-4">
      <span className="eyebrow text-muted">Con el apoyo de</span>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {lista.map((sponsor) =>
          sponsor.urlDestino ? (
            <li key={sponsor.id}>
              <a
                href={sponsor.urlDestino}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="font-display text-foreground hover:text-verde text-[0.95rem] font-semibold transition-colors"
              >
                {sponsor.titulo}
              </a>
            </li>
          ) : (
            <li
              key={sponsor.id}
              className="font-display text-foreground text-[0.95rem] font-semibold"
            >
              {sponsor.titulo}
            </li>
          ),
        )}
      </ul>
      <Link href="/sponsors" className="text-celeste ml-auto text-[0.82rem] hover:underline">
        Ser sponsor →
      </Link>
    </div>
  );
}
