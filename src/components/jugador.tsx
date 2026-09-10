import { iniciales, type JugadorReferencia } from "@/lib/datos-liga";

/** Avatar con iniciales, mientras el tenista no haya subido su foto. */
export function Avatar({ nombre, className }: { nombre: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`bg-verde-soft text-verde font-display grid shrink-0 place-items-center rounded-full text-[0.8rem] font-semibold ${className ?? "h-10 w-10"}`}
    >
      {iniciales(nombre)}
    </span>
  );
}

/** El título concuerda con el cuadro: campeona en damas, campeón en caballeros. */
export function tituloCampeon(categoriaSlug: string) {
  return categoriaSlug.endsWith("-damas") ? "Campeona 2026" : "Campeón 2026";
}

export function InsigniaCampeon({ categoriaSlug }: { categoriaSlug: string }) {
  return (
    <span className="bg-amarillo-soft text-amarillo-ink eyebrow rounded px-1.5 py-0.5">
      {tituloCampeon(categoriaSlug)}
    </span>
  );
}

/** Fila del padrón de una categoría. */
export function FilaJugador({ jugador }: { jugador: JugadorReferencia }) {
  return (
    <li className="border-line flex items-center gap-3 border-b py-3 last:border-b-0">
      <Avatar nombre={jugador.nombre} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-display truncate text-[0.98rem] font-semibold">{jugador.nombre}</span>
        <span className="text-muted text-[0.8rem]">Perfil sin completar</span>
      </span>
      {jugador.campeon && (
        <span className="ml-auto">
          <InsigniaCampeon categoriaSlug={jugador.categoriaSlug} />
        </span>
      )}
    </li>
  );
}
