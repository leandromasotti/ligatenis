import type { Metadata } from "next";
import { EspacioPublicitario } from "@/components/ad-slot";
import { AvisoProvisorio, Seccion, TituloSeccion } from "@/components/seccion";
import { TarjetaTorneo } from "@/components/torneo";
import { BotonLink } from "@/components/ui/button";
import { listarTorneos } from "@/lib/datos";
import { ETIQUETA_ESTADO, type EstadoTorneo } from "@/lib/datos/tipos";

export const metadata: Metadata = {
  title: "Torneos",
  description:
    "Torneos de la Liga Dolorense de Tenis: los que se están jugando, los que vienen y los campeones de los ya terminados.",
};

const GRUPOS: { estado: EstadoTorneo; vacio: string }[] = [
  { estado: "en_progreso", vacio: "Ahora mismo no hay ningún torneo en juego." },
  { estado: "en_camino", vacio: "Todavía no hay torneos anunciados." },
  { estado: "terminado", vacio: "Cuando termine el primer torneo, sus campeones aparecen acá." },
];

export default async function TorneosPage() {
  const torneos = await listarTorneos();
  const hayProvisorios = torneos.some((torneo) => torneo.provisorio);

  return (
    <Seccion>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <TituloSeccion
          eyebrow="Temporada 2026"
          titulo="Torneos"
          bajada="La liga se juega por torneos, de singles y de dobles. Acá está lo que se está jugando, lo que viene y los campeones de cada torneo terminado."
        />
        {hayProvisorios && <AvisoProvisorio />}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-10">
          {GRUPOS.map((grupo) => {
            const delGrupo = torneos.filter((torneo) => torneo.estado === grupo.estado);

            return (
              <section key={grupo.estado} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="eyebrow text-muted">{ETIQUETA_ESTADO[grupo.estado]}</h2>
                  {delGrupo.length > 0 && (
                    <span className="text-muted font-mono text-[0.78rem] tabular-nums">
                      {delGrupo.length}
                    </span>
                  )}
                </div>

                {delGrupo.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {delGrupo.map((torneo) => (
                      <TarjetaTorneo key={torneo.slug} torneo={torneo} />
                    ))}
                  </div>
                ) : (
                  <p className="border-line text-muted rounded-card border border-dashed px-4 py-6 text-center text-[0.9rem]">
                    {grupo.vacio}
                  </p>
                )}
              </section>
            );
          })}

          <EspacioPublicitario slot="listado" clave="torneos" />

          <div className="border-line bg-surface rounded-card flex flex-col items-start gap-2 border p-6">
            <h2 className="font-display text-lg font-semibold">¿Querés jugar el próximo?</h2>
            <p className="text-foreground-muted max-w-[58ch] text-[0.95rem]">
              Creá tu cuenta, elegí tu categoría y escribile a la organización para anotarte en el
              torneo que viene.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <BotonLink href="/registrarme">Crear mi cuenta</BotonLink>
              <BotonLink href="/ranking" variante="secundaria">
                Ver el ranking
              </BotonLink>
            </div>
          </div>
        </div>

        <EspacioPublicitario slot="lateral" clave="torneos" />
      </div>
    </Seccion>
  );
}
