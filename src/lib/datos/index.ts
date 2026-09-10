import { CATEGORIAS, getCategoria, type Categoria } from "@/lib/categorias";
import { EQUIPO_MOCK, TENISTAS_MOCK, TORNEOS_MOCK } from "@/lib/datos/mock";
import type {
  CuadroConTenistas,
  EstadoTorneo,
  MiembroEquipo,
  Tenista,
  Torneo,
} from "@/lib/datos/tipos";

/**
 * Única puerta de entrada a los datos del sitio.
 *
 * Hoy responde desde `mock.ts`. Cuando exista el proyecto de Supabase, se cambia
 * el cuerpo de estas funciones por consultas con `crearClienteServidor()` y nada
 * más: las pantallas ya las consumen como asincrónicas, así que no se tocan.
 *
 *   export async function listarTenistasDeCuadro(categoriaSlug: string) {
 *     const supabase = await crearClienteServidor();
 *     const { data } = await supabase
 *       .from("inscripciones")
 *       .select("profiles(*)")
 *       .eq("categoria_id", ...);
 *     return data ?? [];
 *   }
 */

/** Campeones primero y después por apellido, que es como la liga lista el padrón. */
function porNombre(a: Tenista, b: Tenista) {
  if (a.campeon !== b.campeon) return a.campeon ? -1 : 1;
  const claveA = a.apellido ?? a.nombre;
  const claveB = b.apellido ?? b.nombre;
  return claveA.localeCompare(claveB, "es-AR") || a.nombre.localeCompare(b.nombre, "es-AR");
}

export async function listarCuadros(): Promise<Categoria[]> {
  return [...CATEGORIAS].sort((a, b) => a.orden - b.orden);
}

export async function getCuadro(slug: string): Promise<Categoria | undefined> {
  return getCategoria(slug);
}

export async function listarTenistasDeCuadro(categoriaSlug: string): Promise<Tenista[]> {
  return TENISTAS_MOCK.filter((tenista) => tenista.categoriaSlug === categoriaSlug).sort(porNombre);
}

export async function getTenista(slug: string): Promise<Tenista | undefined> {
  return TENISTAS_MOCK.find((tenista) => tenista.slug === slug);
}

export async function listarTenistas(): Promise<Tenista[]> {
  return [...TENISTAS_MOCK].sort((a, b) => {
    const ordenA = getCategoria(a.categoriaSlug)?.orden ?? 99;
    const ordenB = getCategoria(b.categoriaSlug)?.orden ?? 99;
    return ordenA - ordenB || porNombre(a, b);
  });
}

export async function listarCuadrosConTenistas(): Promise<CuadroConTenistas[]> {
  const cuadros = await listarCuadros();
  return Promise.all(
    cuadros.map(async (cuadro) => ({
      slug: cuadro.slug,
      nombre: cuadro.nombre,
      nivel: cuadro.nivel,
      genero: cuadro.genero,
      modalidad: cuadro.modalidad,
      tenistas: await listarTenistasDeCuadro(cuadro.slug),
    })),
  );
}

export async function listarEquipoTecnico(): Promise<MiembroEquipo[]> {
  return EQUIPO_MOCK;
}

/** Rivales del mismo cuadro, para el bloque "también juegan acá". */
export async function listarCompanerosDeCuadro(tenista: Tenista): Promise<Tenista[]> {
  const delCuadro = await listarTenistasDeCuadro(tenista.categoriaSlug);
  return delCuadro.filter((otro) => otro.slug !== tenista.slug);
}

const ORDEN_ESTADOS: EstadoTorneo[] = ["en_progreso", "en_camino", "terminado"];

export async function listarTorneos(): Promise<Torneo[]> {
  return [...TORNEOS_MOCK].sort(
    (a, b) =>
      ORDEN_ESTADOS.indexOf(a.estado) - ORDEN_ESTADOS.indexOf(b.estado) || b.orden - a.orden,
  );
}

export async function listarTorneosPorEstado(estado: EstadoTorneo): Promise<Torneo[]> {
  const torneos = await listarTorneos();
  return torneos.filter((torneo) => torneo.estado === estado);
}

/** El que la liga está jugando ahora o, si no hay ninguno, el próximo. */
export async function torneoDestacado(): Promise<Torneo | undefined> {
  const torneos = await listarTorneos();
  return (
    torneos.find((torneo) => torneo.estado === "en_progreso") ??
    torneos.find((torneo) => torneo.estado === "en_camino")
  );
}
