import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EspacioPublicitario } from "@/components/ad-slot";
import { Padron } from "@/components/padron";
import { AvisoProvisorio, Seccion, TituloSeccion } from "@/components/seccion";
import { BotonLink } from "@/components/ui/button";
import { ETIQUETA_GENERO } from "@/lib/categorias";
import { getCuadro, listarCuadros, listarTenistasDeCuadro } from "@/lib/datos";
import { CUADROS_SIN_PADRON } from "@/lib/datos-liga";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cuadros = await listarCuadros();
  return cuadros.map((cuadro) => ({ slug: cuadro.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cuadro = await getCuadro(slug);
  if (!cuadro) return { title: "Categoría no encontrada" };

  return {
    title: cuadro.nombre,
    description: `Tenistas y resultados de ${cuadro.nombre} en la Liga Dolorense de Tenis.`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const cuadro = await getCuadro(slug);
  if (!cuadro) notFound();

  const tenistas = await listarTenistasDeCuadro(cuadro.slug);
  const sinPadron = CUADROS_SIN_PADRON[cuadro.slug];

  return (
    <Seccion>
      <nav aria-label="Ruta" className="text-muted mb-5 text-[0.85rem]">
        <Link href="/categorias" className="hover:text-verde">
          Categorías
        </Link>
        <span aria-hidden="true" className="mx-1.5">
          /
        </span>
        <span className="text-foreground-muted">{cuadro.nombre}</span>
      </nav>

      <TituloSeccion
        eyebrow={`${ETIQUETA_GENERO[cuadro.genero]} · ${cuadro.modalidad === "singles" ? "Singles" : "Dobles"}`}
        titulo={cuadro.nombre}
        bajada={
          tenistas.length > 0
            ? "Tenistas con actividad en el cuadro. Tocá un nombre para ver su ficha; cuando cada uno complete su perfil, se llena con su foto, su mano hábil y su club."
            : "Todavía no hay padrón publicado para este cuadro."
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-5">
          {tenistas.length > 0 ? (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="eyebrow text-muted">
                  {tenistas.length} {tenistas.length === 1 ? "tenista" : "tenistas"}
                </h2>
                <AvisoProvisorio />
              </div>
              <Padron tenistas={tenistas} />
            </>
          ) : (
            <div className="border-line bg-surface rounded-card border p-6">
              <h2 className="font-display text-[1.02rem] font-semibold">Padrón sin publicar</h2>
              <p className="text-foreground-muted mt-1.5 max-w-[60ch] text-[0.93rem]">
                {sinPadron ?? "El cuadro se juega, pero todavía no hay nombres publicados."} Si
                jugás en esta categoría, creá tu cuenta y aparecés acá.
              </p>
              <div className="mt-4">
                <BotonLink href="/registrarme" tamano="sm">
                  Registrarme
                </BotonLink>
              </div>
            </div>
          )}

          <EspacioPublicitario slot="listado" clave={`cuadro:${cuadro.slug}`} />
        </div>

        <EspacioPublicitario slot="lateral" clave={`cuadro:${cuadro.slug}`} />
      </div>
    </Seccion>
  );
}
