import type { Metadata } from "next";
import Link from "next/link";
import { EspacioPublicitario } from "@/components/ad-slot";
import { Seccion, TituloSeccion } from "@/components/seccion";
import { tituloCampeon } from "@/components/jugador";
import { ETIQUETA_GENERO } from "@/lib/categorias";
import { listarCuadrosConTenistas } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Los cuadros de la Liga Dolorense de Tenis por nivel, en damas y caballeros.",
};

export default async function CategoriasPage() {
  const cuadros = await listarCuadrosConTenistas();
  const grupos = (["caballeros", "damas"] as const).map((genero) => ({
    genero,
    categorias: cuadros.filter((categoria) => categoria.genero === genero),
  }));

  return (
    <Seccion>
      <TituloSeccion
        eyebrow="Padrón"
        titulo="Categorías"
        bajada="La liga se juega por nivel en damas y caballeros. Elegí un cuadro para ver a sus tenistas y la tabla de posiciones."
      />

      <div className="mt-8 flex flex-col gap-10">
        {grupos.map((grupo) => (
          <div key={grupo.genero} className="flex flex-col gap-3">
            <h3 className="eyebrow text-muted">{ETIQUETA_GENERO[grupo.genero]}</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {grupo.categorias.map((categoria) => {
                const jugadores = categoria.tenistas;
                const campeon = jugadores.find((jugador) => jugador.campeon);

                return (
                  <Link
                    key={categoria.slug}
                    href={`/categorias/${categoria.slug}`}
                    className="border-line bg-surface rounded-card hover:border-verde flex flex-col gap-1 border p-5 transition-colors"
                  >
                    <span className="font-display text-xl font-semibold">{categoria.nivel}</span>
                    <span className="text-foreground-muted text-[0.9rem]">
                      {ETIQUETA_GENERO[categoria.genero]}
                    </span>
                    <span className="text-muted mt-2 text-[0.82rem]">
                      {jugadores.length > 0
                        ? `${jugadores.length} ${jugadores.length === 1 ? "tenista" : "tenistas"}`
                        : "Padrón en carga"}
                    </span>
                    {campeon && (
                      <span className="text-verde text-[0.82rem]">
                        {tituloCampeon(categoria.slug)}: {campeon.nombre}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <EspacioPublicitario slot="listado" clave="categorias" />
      </div>
    </Seccion>
  );
}
