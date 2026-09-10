import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EspacioPublicitario } from "@/components/ad-slot";
import { Avatar, InsigniaCampeon, tituloCampeon } from "@/components/jugador";
import { Seccion } from "@/components/seccion";
import { BotonLink } from "@/components/ui/button";
import { ETIQUETA_GENERO } from "@/lib/categorias";
import { getCuadro, getTenista, listarCompanerosDeCuadro, listarTenistas } from "@/lib/datos";
import { ETIQUETA_MANO, ETIQUETA_REVES, perfilCompleto } from "@/lib/datos/tipos";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const tenistas = await listarTenistas();
  return tenistas.map((tenista) => ({ slug: tenista.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tenista = await getTenista(slug);
  if (!tenista) return { title: "Tenista no encontrado" };

  const cuadro = await getCuadro(tenista.categoriaSlug);
  return {
    title: tenista.nombre,
    description: `${tenista.nombre} juega en ${cuadro?.nombre ?? "la liga"} de la Liga Dolorense de Tenis.`,
  };
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <div className="border-line flex flex-col gap-0.5 border-b py-2.5 last:border-b-0 sm:border-b-0">
      <dt className="eyebrow text-muted">{etiqueta}</dt>
      <dd className={valor ? "text-foreground" : "text-muted"}>{valor ?? "Sin cargar"}</dd>
    </div>
  );
}

export default async function TenistaPage({ params }: Props) {
  const { slug } = await params;
  const tenista = await getTenista(slug);
  if (!tenista) notFound();

  const cuadro = await getCuadro(tenista.categoriaSlug);
  const companeros = await listarCompanerosDeCuadro(tenista);
  const completo = perfilCompleto(tenista);

  return (
    <Seccion>
      <nav aria-label="Ruta" className="text-muted mb-5 text-[0.85rem]">
        <Link href="/categorias" className="hover:text-verde">
          Categorías
        </Link>
        <span aria-hidden="true" className="mx-1.5">
          /
        </span>
        {cuadro && (
          <>
            <Link href={`/categorias/${cuadro.slug}`} className="hover:text-verde">
              {cuadro.nombre}
            </Link>
            <span aria-hidden="true" className="mx-1.5">
              /
            </span>
          </>
        )}
        <span className="text-foreground-muted">{tenista.nombre}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-8">
          <header className="flex flex-wrap items-center gap-5">
            <Avatar nombre={tenista.nombre} className="h-24 w-24 text-2xl" />
            <div className="flex flex-col gap-1.5">
              {tenista.campeon && <InsigniaCampeon categoriaSlug={tenista.categoriaSlug} />}
              <h1 className="text-3xl font-bold sm:text-4xl">{tenista.nombre}</h1>
              {cuadro && (
                <p className="text-foreground-muted">
                  <Link href={`/categorias/${cuadro.slug}`} className="hover:text-verde">
                    {cuadro.nombre}
                  </Link>
                  <span className="text-muted"> · {ETIQUETA_GENERO[cuadro.genero]} singles</span>
                </p>
              )}
            </div>
          </header>

          <section className="border-line bg-surface rounded-card border p-5 sm:p-6">
            <h2 className="eyebrow text-muted">Ficha deportiva</h2>
            <dl className="mt-3 grid gap-x-8 sm:grid-cols-3">
              <Dato
                etiqueta="Mano hábil"
                valor={tenista.mano ? ETIQUETA_MANO[tenista.mano] : undefined}
              />
              <Dato
                etiqueta="Revés"
                valor={tenista.reves ? ETIQUETA_REVES[tenista.reves] : undefined}
              />
              <Dato etiqueta="Club" valor={tenista.club} />
              <Dato etiqueta="Localidad" valor={tenista.localidad} />
              <Dato
                etiqueta="Torneo 2026"
                valor={tenista.campeon ? tituloCampeon(tenista.categoriaSlug) : "Participó"}
              />
              <Dato etiqueta="Instagram" valor={tenista.instagram} />
            </dl>

            {tenista.bio && (
              <p className="text-foreground-muted border-line mt-4 border-t pt-4 text-[0.95rem]">
                {tenista.bio}
              </p>
            )}

            {!completo && (
              <div className="border-line mt-5 flex flex-col items-start gap-2 border-t pt-5">
                <p className="text-foreground-muted max-w-[58ch] text-[0.93rem]">
                  Esta ficha la completa el propio tenista: la foto, la mano hábil, el revés, el
                  club y una breve reseña. Hasta entonces se muestra solo lo que ya es público.
                </p>
                <BotonLink href="/registrarme" tamano="sm">
                  Es mi ficha, quiero completarla
                </BotonLink>
              </div>
            )}
          </section>

          {companeros.length > 0 && cuadro && (
            <section>
              <h2 className="eyebrow text-muted">También juegan en {cuadro.nombre}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {companeros.map((companero) => (
                  <li key={companero.slug}>
                    <Link
                      href={`/jugadores/${companero.slug}`}
                      className="border-line bg-surface hover:border-verde flex items-center gap-2 rounded-full border py-1 pr-3.5 pl-1 text-[0.88rem] transition-colors"
                    >
                      <Avatar nombre={companero.nombre} className="h-7 w-7 text-[0.66rem]" />
                      {companero.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <EspacioPublicitario slot="lateral" clave={`jugador:${tenista.slug}`} />
      </div>
    </Seccion>
  );
}
