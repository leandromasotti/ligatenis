import Link from "next/link";
import { EspacioPublicitario } from "@/components/ad-slot";
import { Avatar, tituloCampeon } from "@/components/jugador";
import { AvisoProvisorio, Seccion, TituloSeccion } from "@/components/seccion";
import { TarjetaTorneo } from "@/components/torneo";
import { BotonLink } from "@/components/ui/button";
import { getCategoria } from "@/lib/categorias";
import { listarCuadrosConTenistas, torneoDestacado } from "@/lib/datos";
import { campeones } from "@/lib/datos-liga";

const PASOS = [
  {
    titulo: "Creá tu cuenta",
    detalle: "Con tu email. Te llega un mail para verificar que sos vos.",
  },
  {
    titulo: "Completá tu perfil",
    detalle: "Datos personales, foto y la categoría en la que jugás.",
  },
  {
    titulo: "Aparecés en tu categoría",
    detalle: "El equipo de la liga aprueba el alta y tu ficha se publica.",
  },
];

function Cancha({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
      <rect x="0.5" y="0.5" width="239" height="149" rx="4" className="fill-celeste-soft" />
      <g className="stroke-celeste" strokeWidth="1.2" fill="none" opacity="0.85">
        <rect x="26" y="18" width="188" height="114" />
        <rect x="26" y="32" width="188" height="86" />
        <path d="M120 18v114M46 32v86M194 32v86M46 75h148" />
      </g>
      <path d="M120 8v134" className="stroke-verde" strokeWidth="2.4" opacity="0.5" />
      <circle cx="88" cy="98" r="4.5" className="fill-amarillo" />
    </svg>
  );
}

export default async function Home() {
  const cuadros = await listarCuadrosConTenistas();
  const torneo = await torneoDestacado();

  return (
    <>
      <Seccion className="!pt-10 sm:!pt-14">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col items-start gap-5">
            <span className="eyebrow text-verde bg-verde-soft rounded px-2 py-1">
              Temporada 2026
            </span>
            <h1 className="text-4xl leading-[1.05] font-bold sm:text-5xl">
              El tenis de Dolores, categoría por categoría
            </h1>
            <p className="text-foreground-muted max-w-[52ch] text-lg">
              Cuadros por nivel en damas y caballeros, con tenistas de Dolores, Castelli, Pila,
              Chascomús y la zona. Consultá el ranking y armá tu perfil.
            </p>
            <div className="flex flex-wrap gap-3">
              <BotonLink href="/ranking">Ver el ranking</BotonLink>
              <BotonLink href="/registrarme" variante="secundaria">
                Crear mi cuenta
              </BotonLink>
            </div>
          </div>
          <Cancha className="border-line rounded-card w-full border" />
        </div>
      </Seccion>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <EspacioPublicitario slot="cabecera" clave="home" />
      </div>

      {torneo && (
        <Seccion>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <TituloSeccion
              eyebrow={torneo.estado === "en_progreso" ? "Ahora" : "Lo que viene"}
              titulo={torneo.estado === "en_progreso" ? "Torneo en juego" : "Próximo torneo"}
            />
            <BotonLink href="/torneos" variante="sutil">
              Ver todos los torneos →
            </BotonLink>
          </div>
          <div className="mt-5 max-w-2xl">
            <TarjetaTorneo torneo={torneo} />
          </div>
        </Seccion>
      )}

      <Seccion>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <TituloSeccion eyebrow="1° Torneo 2026" titulo="Campeones" />
          <AvisoProvisorio />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {campeones().map((campeon) => (
            <Link
              key={campeon.nombre}
              href={`/categorias/${campeon.categoriaSlug}`}
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
                <span className="text-muted text-[0.85rem]">
                  {getCategoria(campeon.categoriaSlug)?.nombre}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Seccion>

      <Seccion>
        <TituloSeccion
          eyebrow="Cuadros activos"
          titulo="Categorías"
          bajada="Cada tenista pertenece a un cuadro por temporada. El padrón se está cargando junto con la liga."
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cuadros.map((categoria) => {
            const jugadores = categoria.tenistas;
            const campeon = jugadores.find((jugador) => jugador.campeon);

            return (
              <Link
                key={categoria.slug}
                href={`/categorias/${categoria.slug}`}
                className="border-line bg-surface rounded-card hover:border-verde group flex items-center justify-between gap-3 border p-4 transition-colors"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-display truncate text-[1.05rem] font-semibold">
                    {categoria.nombre}
                  </span>
                  <span className="text-muted truncate text-[0.82rem]">
                    {campeon
                      ? `${tituloCampeon(categoria.slug)}: ${campeon.nombre}`
                      : jugadores.length > 0
                        ? "Con actividad en 2026"
                        : "Padrón en carga"}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end">
                  <span className="text-foreground group-hover:text-verde font-display text-xl font-semibold transition-colors">
                    {jugadores.length > 0 ? jugadores.length : "—"}
                  </span>
                  <span className="text-muted text-[0.68rem] tracking-wide uppercase">
                    tenistas
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Seccion>

      <Seccion className="!py-0">
        <div className="border-line bg-surface rounded-card border p-6 sm:p-8">
          <TituloSeccion eyebrow="Para tenistas de la liga" titulo="Cómo sumarte" />
          <ol className="mt-6 grid gap-5 sm:grid-cols-3">
            {PASOS.map((paso, indice) => (
              <li key={paso.titulo} className="flex flex-col gap-1.5">
                <span className="border-line-strong text-verde font-display grid h-8 w-8 place-items-center rounded-full border text-[0.85rem]">
                  {indice + 1}
                </span>
                <h3 className="font-display text-[1.02rem] font-semibold">{paso.titulo}</h3>
                <p className="text-foreground-muted text-[0.92rem]">{paso.detalle}</p>
              </li>
            ))}
          </ol>
          <div className="mt-7">
            <BotonLink href="/registrarme">Registrarme</BotonLink>
          </div>
        </div>
      </Seccion>

      <Seccion>
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-4">
            <TituloSeccion
              eyebrow="Equipo técnico"
              titulo="Quiénes están detrás de la liga"
              bajada="Profesores, coordinación y organización de las categorías. La sección se carga desde el panel de la liga."
            />
            <BotonLink href="/equipo-tecnico" variante="sutil">
              Ver el equipo técnico →
            </BotonLink>
          </div>
          <EspacioPublicitario
            slot="lateral"
            clave="home"
            className="max-w-[300px] md:justify-self-end"
          />
        </div>
      </Seccion>

      <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <EspacioPublicitario slot="pie" clave="home" />
      </div>
    </>
  );
}
