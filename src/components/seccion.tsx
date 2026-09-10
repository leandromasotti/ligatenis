import { NOTA_PROVISORIA } from "@/lib/datos-liga";
import type { ReactNode } from "react";

export function Seccion({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 ${className ?? ""}`}>
      {children}
    </section>
  );
}

export function TituloSeccion({
  eyebrow,
  titulo,
  bajada,
  className,
}: {
  eyebrow?: string;
  titulo: string;
  bajada?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {eyebrow && <span className="eyebrow text-verde">{eyebrow}</span>}
      <h2 className="text-2xl font-semibold sm:text-[1.7rem]">{titulo}</h2>
      {bajada && <p className="text-foreground-muted max-w-[62ch]">{bajada}</p>}
    </div>
  );
}

/**
 * Marca los datos tomados de la prensa local y del Facebook de la liga, para que
 * nadie los confunda con el padrón oficial.
 */
export function AvisoProvisorio({ className }: { className?: string }) {
  return (
    <span
      title={NOTA_PROVISORIA}
      className={`text-muted border-line rounded border px-2 py-0.5 text-[0.75rem] ${className ?? ""}`}
    >
      Datos provisorios
    </span>
  );
}

/** Panel para las pantallas que llegan en sprints siguientes. */
export function EnConstruccion({
  titulo,
  detalle,
  sprint,
}: {
  titulo: string;
  detalle: string;
  sprint: string;
}) {
  return (
    <div className="border-line bg-surface rounded-card flex flex-col items-start gap-2 border p-6">
      <span className="eyebrow text-amarillo-ink bg-amarillo-soft rounded px-2 py-1">{sprint}</span>
      <h3 className="text-lg font-semibold">{titulo}</h3>
      <p className="text-foreground-muted max-w-[60ch] text-[0.95rem]">{detalle}</p>
    </div>
  );
}
