import Link from "next/link";
import { BotonWhatsappEnlace } from "@/components/icono-whatsapp";
import { Avatar } from "@/components/jugador";
import { getCategoria } from "@/lib/categorias";
import { enlaceWhatsapp, WHATSAPP } from "@/lib/contacto";
import { slugify } from "@/lib/datos/mock";
import {
  ETIQUETA_ESTADO,
  ETIQUETA_MODALIDAD,
  type EstadoTorneo,
  type Torneo,
} from "@/lib/datos/tipos";

/** Un color por estado: verde lo cerrado, amarillo lo que se juega, celeste lo que viene. */
const COLOR_ESTADO: Record<EstadoTorneo, string> = {
  terminado: "bg-verde-soft text-verde",
  en_progreso: "bg-amarillo-soft text-amarillo-ink",
  en_camino: "bg-celeste-soft text-celeste",
};

export function InsigniaEstado({ estado }: { estado: EstadoTorneo }) {
  return (
    <span className={`eyebrow rounded px-1.5 py-0.5 ${COLOR_ESTADO[estado]}`}>
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}

/** Campeones de un cuadro. En dobles son dos nombres, así que van los dos. */
function Campeones({ nombres, cuadro }: { nombres: string[]; cuadro?: string }) {
  return (
    <li className="border-line flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b py-2.5 last:border-b-0">
      <span className="flex items-center gap-2">
        {nombres.map((nombre) => (
          <Link
            key={nombre}
            href={`/jugadores/${slugify(nombre)}`}
            className="hover:text-verde flex items-center gap-2 transition-colors"
          >
            <Avatar nombre={nombre} className="h-8 w-8 text-[0.7rem]" />
            <span className="font-display text-[0.95rem] font-semibold">{nombre}</span>
          </Link>
        ))}
      </span>
      {cuadro && <span className="text-muted ml-auto text-[0.82rem]">{cuadro}</span>}
    </li>
  );
}

/** El mensaje llega con el torneo ya nombrado: la liga no tiene que preguntar cuál. */
function mensajeInscripcion(torneo: Torneo): string {
  const cuando = torneo.periodo ? ` (${torneo.periodo})` : "";
  return `¡Hola! Escribo desde la web de la Liga Dolorense de Tenis. Quería inscribirme en el ${torneo.nombre}${cuando}.`;
}

export function TarjetaTorneo({ torneo }: { torneo: Torneo }) {
  const campeones = torneo.resultados.filter((resultado) => resultado.puesto === 1);

  return (
    <article className="border-line bg-surface rounded-card flex flex-col gap-3 border p-5">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <InsigniaEstado estado={torneo.estado} />
          <span className="eyebrow text-muted border-line rounded border px-1.5 py-0.5">
            {ETIQUETA_MODALIDAD[torneo.modalidad]}
          </span>
          {torneo.provisorio && (
            <span className="text-muted text-[0.72rem]">· dato a confirmar</span>
          )}
        </div>
        <h3 className="font-display text-[1.15rem] font-semibold">{torneo.nombre}</h3>
        <p className="text-foreground-muted text-[0.88rem]">
          {torneo.periodo}
          {torneo.sede && <span className="text-muted"> · {torneo.sede}</span>}
        </p>
      </header>

      {torneo.estado === "terminado" ? (
        campeones.length > 0 ? (
          <div className="border-line border-t pt-3">
            <h4 className="eyebrow text-verde">
              {campeones.length === 1 ? "Campeón" : "Campeones por cuadro"}
            </h4>
            <ul className="mt-1">
              {campeones.map((resultado) => (
                <Campeones
                  key={resultado.categoriaSlug}
                  nombres={resultado.nombres}
                  cuadro={getCategoria(resultado.categoriaSlug)?.nombre}
                />
              ))}
            </ul>
          </div>
        ) : (
          <p className="border-line text-muted border-t pt-3 text-[0.88rem]">
            Terminado, con los campeones pendientes de carga.
          </p>
        )
      ) : torneo.estado === "en_progreso" ? (
        <p className="border-line text-foreground-muted border-t pt-3 text-[0.88rem]">
          Se está jugando. Los campeones se publican al terminar.
        </p>
      ) : (
        <div className="border-line flex flex-col items-start gap-3 border-t pt-3">
          <p className="text-foreground-muted text-[0.88rem]">
            Todavía no arrancó: las inscripciones se hacen por WhatsApp con la organización.
          </p>
          {WHATSAPP && (
            <BotonWhatsappEnlace href={enlaceWhatsapp(mensajeInscripcion(torneo))}>
              Inscribirme
            </BotonWhatsappEnlace>
          )}
        </div>
      )}
    </article>
  );
}
