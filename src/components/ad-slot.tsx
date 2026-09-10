import { MarcaIcono } from "@/components/marca-icono";
import { elegirAnuncio, MEDIDAS, type Anuncio, type SlotPublicidad } from "@/lib/datos/anuncios";

export type { SlotPublicidad };

const MARCA_POR_DEFECTO = { fondo: "#101820", texto: "#F5F7F6", acento: "#5CC98C" };

/**
 * Tamaños y disposición por formato. En el celular todos los avisos son
 * horizontales y más chicos; el lateral se vuelve vertical recién en `lg`, que es
 * cuando pasa a la columna angosta.
 */
const ESCALA: Record<
  SlotPublicidad,
  { titulo: string; icono: string; bajada: string; layout: string }
> = {
  cabecera: {
    titulo: "text-xl sm:text-3xl",
    icono: "h-8 w-8 sm:h-9 sm:w-9",
    bajada: "text-[0.85rem] sm:text-[0.9rem]",
    layout: "flex-row text-left",
  },
  listado: {
    titulo: "text-xl sm:text-3xl",
    icono: "h-8 w-8 sm:h-9 sm:w-9",
    bajada: "text-[0.85rem] sm:text-[0.9rem]",
    layout: "flex-row text-left",
  },
  lateral: {
    titulo: "text-2xl lg:text-3xl",
    icono: "h-10 w-10 lg:h-14 lg:w-14",
    bajada: "text-[0.88rem] lg:text-[0.95rem]",
    layout: "flex-row text-left lg:flex-col lg:text-center",
  },
  pie: {
    titulo: "text-2xl sm:text-5xl",
    icono: "h-10 w-10 sm:h-16 sm:w-16",
    bajada: "text-[0.9rem] sm:text-base",
    layout: "flex-row text-left",
  },
};

/**
 * Logotipo de texto del anunciante. Se usa mientras no manda su imagen, y evita
 * depender de un logo de marca que la liga no tiene derecho a reproducir.
 * Deliberadamente distinto del resto del sitio: tiene que leerse como publicidad.
 */
function Banner({ anuncio, slot }: { anuncio: Anuncio; slot: SlotPublicidad }) {
  const marca = anuncio.marca ?? MARCA_POR_DEFECTO;
  const escala = ESCALA[slot];

  return (
    <span
      style={{ backgroundColor: marca.fondo, color: marca.texto }}
      className={`flex h-full w-full items-center justify-center gap-x-4 gap-y-2 px-4 py-3 ${escala.layout}`}
    >
      {anuncio.icono && (
        <MarcaIcono nombre={anuncio.icono} color={marca.acento} className={escala.icono} />
      )}
      <span className="flex flex-col gap-0.5">
        <span className={`font-display leading-none font-bold tracking-tight ${escala.titulo}`}>
          {anuncio.titulo}
        </span>
        {anuncio.bajada && (
          <span className={`leading-snug opacity-90 ${escala.bajada}`}>{anuncio.bajada}</span>
        )}
        {anuncio.dominio && (
          <span
            style={{ color: marca.acento }}
            className="mt-0.5 font-mono text-[0.8rem] tracking-wide"
          >
            {anuncio.dominio}
          </span>
        )}
      </span>
    </span>
  );
}

function EspacioLibre({ anuncio }: { anuncio: Anuncio }) {
  return (
    <span className="text-foreground-muted flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
      <span className="font-display text-[0.95rem] font-semibold">{anuncio.titulo}</span>
      {anuncio.bajada && (
        <span className="text-muted max-w-[34ch] text-[0.82rem]">{anuncio.bajada}</span>
      )}
      <span className="text-celeste mt-1 font-mono text-[0.78rem]">Consultar en la liga</span>
    </span>
  );
}

/**
 * Espacio publicitario. Recibe la clave de la ubicación (la ruta o el cuadro) para
 * que el reparto de sponsors sea estable y no cambie entre renders.
 */
export function EspacioPublicitario({
  slot,
  clave,
  className,
}: {
  slot: SlotPublicidad;
  clave: string;
  className?: string;
}) {
  const anuncio = elegirAnuncio(slot, clave);
  const { medida, alto } = MEDIDAS[slot];

  if (!anuncio) return null;

  const contenedor = `rounded-card w-full overflow-hidden ${alto}`;

  return (
    <aside aria-label="Publicidad" className={`flex w-full flex-col gap-1 ${className ?? ""}`}>
      {anuncio.disponible ? (
        <span
          className={`border-line bg-surface flex border border-dashed ${contenedor}`}
          title={`Espacio de ${medida}`}
        >
          <EspacioLibre anuncio={anuncio} />
        </span>
      ) : anuncio.urlDestino ? (
        <a
          href={anuncio.urlDestino}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className={`border-line flex border ${contenedor}`}
        >
          <Banner anuncio={anuncio} slot={slot} />
        </a>
      ) : (
        <span className={`border-line flex border ${contenedor}`}>
          <Banner anuncio={anuncio} slot={slot} />
        </span>
      )}
      <span className="eyebrow text-muted self-end text-[0.6rem]">Publicidad</span>
    </aside>
  );
}
