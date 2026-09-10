import type { Metadata } from "next";
import { EspacioPublicitario } from "@/components/ad-slot";
import { Seccion, TituloSeccion } from "@/components/seccion";
import { BotonWhatsappEnlace } from "@/components/icono-whatsapp";
import { MarcaIcono } from "@/components/marca-icono";
import { enlaceWhatsapp, WHATSAPP } from "@/lib/contacto";
import { haySponsorsDemo, MEDIDAS, sponsors, type SlotPublicidad } from "@/lib/datos/anuncios";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Sponsors de la Liga Dolorense de Tenis y espacios publicitarios disponibles en el sitio.",
};

const UBICACIONES: { slot: SlotPublicidad; nombre: string; donde: string }[] = [
  { slot: "cabecera", nombre: "Cabecera", donde: "Arriba de la portada, primera cosa que se ve" },
  { slot: "listado", nombre: "Listado", donde: "Dentro de los cuadros de categoría y el ranking" },
  { slot: "lateral", nombre: "Lateral", donde: "Al costado de las fichas, el ranking y el padrón" },
  { slot: "pie", nombre: "Pie", donde: "Al final de la portada" },
];

export default function SponsorsPage() {
  const lista = sponsors();

  return (
    <Seccion>
      <TituloSeccion
        eyebrow="Publicidad"
        titulo="Sponsors de la liga"
        bajada="El sitio se sostiene con el apoyo de comercios y empresas de Dolores y la zona. Los espacios se venden por temporada y el aviso se ve en todas las páginas del sitio."
      />

      <h2 className="eyebrow text-verde mt-10">Nos acompañan</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((sponsor) => {
          const marca = sponsor.marca ?? { fondo: "#101820", texto: "#F5F7F6", acento: "#5CC98C" };
          const contenido = (
            <>
              <span
                style={{ backgroundColor: marca.fondo }}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-md"
              >
                {sponsor.icono && (
                  <MarcaIcono nombre={sponsor.icono} color={marca.acento} className="h-7 w-7" />
                )}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-display truncate text-[1.05rem] font-semibold">
                  {sponsor.titulo}
                </span>
                {sponsor.bajada && (
                  <span className="text-foreground-muted truncate text-[0.88rem]">
                    {sponsor.bajada}
                  </span>
                )}
                {sponsor.dominio && (
                  <span className="text-celeste font-mono text-[0.78rem]">{sponsor.dominio} ↗</span>
                )}
              </span>
            </>
          );

          const clases =
            "border-line bg-surface rounded-card flex items-center gap-3.5 border p-4 h-full";

          return (
            <li key={sponsor.id}>
              {sponsor.urlDestino ? (
                <a
                  href={sponsor.urlDestino}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className={`${clases} hover:border-verde transition-colors`}
                >
                  {contenido}
                </a>
              ) : (
                <span className={clases}>{contenido}</span>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="eyebrow text-verde mt-12">Espacios y medidas</h2>
      <p className="text-foreground-muted mt-2 max-w-[62ch]">
        Cuatro ubicaciones, con las medidas estándar de la industria: si el comercio ya tiene un
        banner diseñado, entra sin rehacerse. Nunca se muestran más de tres avisos por página, para
        que el sitio siga siendo cómodo de leer.
      </p>
      <div className="mt-4">
        <div className="border-line bg-surface rounded-card overflow-x-auto border">
          <table className="w-full min-w-[30rem] border-collapse text-[0.93rem]">
            <thead>
              <tr className="border-line-strong border-b">
                <th className="eyebrow text-muted px-3 py-2.5 text-left">Ubicación</th>
                <th className="eyebrow text-muted px-3 py-2.5 text-left">Dónde se ve</th>
                <th className="eyebrow text-muted px-3 py-2.5 text-right">Medida</th>
              </tr>
            </thead>
            <tbody>
              {UBICACIONES.map((ubicacion) => (
                <tr key={ubicacion.slot} className="border-line border-b last:border-b-0">
                  <td className="px-3 py-2.5 font-semibold">{ubicacion.nombre}</td>
                  <td className="text-foreground-muted px-3 py-2.5">{ubicacion.donde}</td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                    {MEDIDAS[ubicacion.slot].medida}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="eyebrow text-verde mt-12">Así se ve un aviso</h2>
      <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <EspacioPublicitario slot="cabecera" clave="sponsors:demo-cabecera" />
          <EspacioPublicitario slot="pie" clave="sponsors:demo-pie" />
        </div>
        <EspacioPublicitario slot="lateral" clave="sponsors:demo-lateral" />
      </div>

      <div className="border-line bg-surface rounded-card mt-12 border p-6">
        <h2 className="font-display text-lg font-semibold">Quiero acompañar a la liga</h2>
        <p className="text-foreground-muted mt-1.5 max-w-[60ch] text-[0.95rem]">
          Escribile a la organización de la liga y te pasan los valores de la temporada y las
          medidas del banner.
        </p>
        {WHATSAPP && (
          <BotonWhatsappEnlace
            href={enlaceWhatsapp(
              "¡Hola! Escribo desde la web de la Liga Dolorense de Tenis. Quería consultar por un espacio publicitario.",
            )}
            className="mt-4 mr-4"
          >
            Consultar por WhatsApp
          </BotonWhatsappEnlace>
        )}
        <a
          href="https://www.facebook.com/p/Liga-Dolorense-de-Tenis-100090742189864/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-celeste hover:text-celeste-hover font-display mt-4 inline-block text-[0.9rem] font-semibold"
        >
          Facebook de la liga ↗
        </a>
      </div>

      {haySponsorsDemo() && (
        <p className="border-line text-muted mt-8 border-l-2 pl-3 text-[0.82rem]">
          Nota para la liga: algunos avisos son de muestra, para ver cómo queda la tanda completa.
          Son nombres de marcas reales sin acuerdo todavía y no usan su logo. Se quitan todos con un
          solo cambio en <code className="font-mono">src/lib/datos/anuncios.ts</code>.
        </p>
      )}
    </Seccion>
  );
}
