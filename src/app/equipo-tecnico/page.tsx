import type { Metadata } from "next";
import { EspacioPublicitario } from "@/components/ad-slot";
import { Avatar } from "@/components/jugador";
import { Seccion, TituloSeccion } from "@/components/seccion";
import { listarEquipoTecnico } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Equipo técnico",
  description: "Organización y coordinación de la Liga Dolorense de Tenis.",
};

export default async function EquipoTecnicoPage() {
  const equipo = await listarEquipoTecnico();

  return (
    <Seccion>
      <TituloSeccion
        eyebrow="La liga"
        titulo="Equipo técnico"
        bajada="Quiénes organizan los torneos y coordinan las categorías. Las fichas se cargan desde el panel de la liga."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-5">
          <ul className="grid gap-3 sm:grid-cols-2">
            {equipo.map((miembro) => (
              <li
                key={miembro.slug}
                className="border-line bg-surface rounded-card flex items-center gap-4 border p-4"
              >
                {miembro.nombre ? (
                  <Avatar nombre={miembro.nombre} className="h-14 w-14 text-[1rem]" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="border-line-strong text-muted grid h-14 w-14 shrink-0 place-items-center rounded-full border border-dashed text-lg"
                  >
                    ?
                  </span>
                )}
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="eyebrow text-verde">{miembro.rol}</span>
                  <span
                    className={`font-display truncate text-[1.05rem] font-semibold ${
                      miembro.nombre ? "" : "text-muted font-normal"
                    }`}
                  >
                    {miembro.nombre ?? "A cargar"}
                  </span>
                  {miembro.bio && (
                    <span className="text-foreground-muted text-[0.88rem]">{miembro.bio}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-muted max-w-[62ch] text-[0.88rem]">
            Los roles sin nombre son la estructura habitual de una liga y están a confirmar con la
            organización. Se editan desde el panel, sin tocar código.
          </p>
        </div>

        <EspacioPublicitario slot="lateral" clave="equipo-tecnico" />
      </div>
    </Seccion>
  );
}
