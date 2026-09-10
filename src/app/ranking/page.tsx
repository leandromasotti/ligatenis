import type { Metadata } from "next";
import Link from "next/link";
import { EspacioPublicitario } from "@/components/ad-slot";
import { Avatar, tituloCampeon } from "@/components/jugador";
import { AvisoProvisorio, Seccion, TituloSeccion } from "@/components/seccion";
import { getCategoria } from "@/lib/categorias";
import { listarCuadros, listarTenistas } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Ranking y resultados",
  description: "Campeones del 1° Torneo 2026 y padrón por categoría de la Liga Dolorense de Tenis.",
};

export default async function RankingPage() {
  const cuadros = await listarCuadros();
  const padron = await listarTenistas();
  const listaCampeones = padron.filter((tenista) => tenista.campeon);

  return (
    <Seccion>
      <TituloSeccion
        eyebrow="Temporada 2026"
        titulo="Ranking y resultados"
        bajada="El ranking se arma con los puntos que cada tenista suma en los torneos de la liga. Se publica en cuanto la organización pase la tabla de puntos; hasta entonces, acá están los resultados y el padrón por categoría."
      />

      <div className="bg-amarillo-soft text-amarillo-ink rounded-card mt-6 px-4 py-3 text-[0.88rem]">
        <strong className="font-display">Sin puntaje todavía.</strong> Los nombres y los campeones
        salen de la prensa local y del Facebook de la liga. Las posiciones y los puntos se cargan
        cuando la organización pase la tabla de puntos por torneo y la planilla.{" "}
        <Link href="/torneos" className="underline">
          Ver los torneos
        </Link>
        .
      </div>

      <h3 className="eyebrow text-verde mt-10">Campeones del 1° Torneo 2026</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {listaCampeones.map((campeon) => {
          const categoria = getCategoria(campeon.categoriaSlug);
          return (
            <Link
              key={campeon.slug}
              href={`/jugadores/${campeon.slug}`}
              className="border-line bg-surface rounded-card hover:border-verde flex items-center gap-4 border p-4 transition-colors"
            >
              <Avatar nombre={campeon.nombre} className="h-14 w-14 text-[1rem]" />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="eyebrow text-amarillo-ink bg-amarillo-soft w-fit rounded px-1.5 py-0.5">
                  {tituloCampeon(campeon.categoriaSlug)}
                </span>
                <span className="font-display truncate text-lg font-semibold">
                  {campeon.nombre}
                </span>
                <span className="text-muted text-[0.85rem]">{categoria?.nombre}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="eyebrow text-muted">Padrón por categoría</h3>
            <AvisoProvisorio />
          </div>

          <div className="border-line bg-surface rounded-card overflow-x-auto border">
            <table className="w-full min-w-[32rem] border-collapse text-[0.93rem]">
              <caption className="sr-only">
                Tenistas con actividad publicada, por categoría, temporada 2026
              </caption>
              <thead>
                <tr className="border-line-strong border-b">
                  <th scope="col" className="eyebrow text-muted px-3 py-2.5 text-left">
                    Tenista
                  </th>
                  <th scope="col" className="eyebrow text-muted px-3 py-2.5 text-left">
                    Categoría
                  </th>
                  <th scope="col" className="eyebrow text-muted px-3 py-2.5 text-right">
                    Torneo 2026
                  </th>
                </tr>
              </thead>
              <tbody>
                {padron.map((jugador) => (
                  <tr key={jugador.slug} className="border-line border-b last:border-b-0">
                    <td className="px-3 py-2.5 font-semibold">
                      <Link href={`/jugadores/${jugador.slug}`} className="hover:text-verde">
                        {jugador.nombre}
                      </Link>
                    </td>
                    <td className="text-foreground-muted px-3 py-2.5">
                      <Link
                        href={`/categorias/${jugador.categoriaSlug}`}
                        className="hover:text-verde"
                      >
                        {getCategoria(jugador.categoriaSlug)?.nombre}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {jugador.campeon ? (
                        <span className="text-verde font-display font-semibold">
                          {tituloCampeon(jugador.categoriaSlug)}
                        </span>
                      ) : (
                        <span className="text-muted">Participó</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Ir a una categoría" className="mt-3 flex flex-wrap gap-2">
            {cuadros.map((categoria) => (
              <Link
                key={categoria.slug}
                href={`/categorias/${categoria.slug}`}
                className="border-line text-foreground-muted hover:border-line-strong hover:text-foreground rounded-md border px-3 py-1.5 text-[0.85rem] transition-colors"
              >
                {categoria.nombre}
              </Link>
            ))}
          </nav>
        </div>

        <EspacioPublicitario slot="lateral" clave="ranking" />
      </div>
    </Seccion>
  );
}
