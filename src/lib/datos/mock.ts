import { JUGADORES } from "@/lib/datos-liga";
import { PADRON_2024 } from "@/lib/datos/padron-2024";
import type { MiembroEquipo, Tenista, Torneo } from "@/lib/datos/tipos";

/**
 * Datos mock, mientras no hay base de datos.
 *
 * Dos fuentes, y una precedencia clara:
 *   1. el padrón oficial de caballeros 2024 que pasó la liga (`padron-2024.ts`)
 *   2. los nombres que la prensa publicó de los torneos 2026 (`datos-liga.ts`),
 *      que son más recientes y pisan la categoría del padrón viejo
 *
 * Regla que se respeta acá: son personas reales, así que los únicos datos que se
 * cargan son los ya publicados por la liga o por la prensa — nombre, categoría y
 * si fueron campeones. Los campos del perfil deportivo quedan vacíos a propósito:
 * los carga cada tenista cuando se registre, y la ficha está diseñada para verse
 * bien así.
 *
 * Para pasar a Supabase se reemplaza solo `src/lib/datos/index.ts`: este archivo
 * se borra y las pantallas no cambian.
 */

const SIN_ACENTO: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ü: "u",
  ñ: "n",
  à: "a",
  è: "e",
  ì: "i",
  ò: "o",
  ù: "u",
};

/** Mismo criterio que la función `slug_desde` de la migración 0001. */
export function slugify(texto: string): string {
  return texto
    .replace(/"[^"]*"/g, " ")
    .toLowerCase()
    .split("")
    .map((caracter) => SIN_ACENTO[caracter] ?? caracter)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Clave para cruzar las dos fuentes: sin acentos, sin apodos, sin mayúsculas. */
function clave(nombreCompleto: string): string {
  return slugify(nombreCompleto);
}

function construirPadron(): Tenista[] {
  const porClave = new Map<string, Tenista>();

  // 1. El padrón oficial 2024.
  for (const [categoriaSlug, entradas] of Object.entries(PADRON_2024)) {
    for (const [apellido, nombre] of entradas) {
      const nombreCompleto = `${nombre} ${apellido}`;
      porClave.set(clave(nombreCompleto), {
        slug: slugify(nombreCompleto),
        nombre: nombreCompleto,
        apellido,
        categoriaSlug,
      });
    }
  }

  // 2. Los nombres de 2026: si el tenista ya estaba, se le actualiza la categoría
  //    y se le marca el título; si no estaba, se agrega.
  for (const jugador of JUGADORES) {
    const k = clave(jugador.nombre);
    const existente = porClave.get(k);

    if (existente) {
      existente.categoriaSlug = jugador.categoriaSlug;
      existente.campeon = jugador.campeon;
      continue;
    }

    const partes = jugador.nombre
      .replace(/"[^"]*"/g, "")
      .trim()
      .split(/\s+/);
    porClave.set(k, {
      slug: slugify(jugador.nombre),
      nombre: jugador.nombre,
      apellido: partes[partes.length - 1],
      categoriaSlug: jugador.categoriaSlug,
      campeon: jugador.campeon,
    });
  }

  // Dos tenistas distintos podrían caer en el mismo slug: se desempata con un
  // sufijo para que ninguna ficha se pise con otra.
  const usados = new Set<string>();
  for (const tenista of porClave.values()) {
    let candidato = tenista.slug;
    let n = 1;
    while (usados.has(candidato)) {
      n += 1;
      candidato = `${tenista.slug}-${n}`;
    }
    usados.add(candidato);
    tenista.slug = candidato;
  }

  return [...porClave.values()];
}

export const TENISTAS_MOCK: Tenista[] = construirPadron();

/**
 * Equipo técnico. Carlos Lanz es el encargado de la liga; los demás roles son la
 * estructura habitual de una liga y están a confirmar con la organización.
 */
export const EQUIPO_MOCK: MiembroEquipo[] = [
  { slug: "carlos-lanz", nombre: "Carlos Lanz", rol: "Encargado de la liga" },
  { slug: "coordinacion-damas", rol: "Coordinación de damas" },
  { slug: "coordinacion-caballeros", rol: "Coordinación de caballeros" },
  { slug: "fiscalizacion", rol: "Fiscalización de torneos" },
];

/**
 * Torneos de la liga.
 *
 * Los dos terminados salen de la prensa local y del Facebook de la liga. Los que
 * están en juego y en camino son de muestra, marcados como provisorios, para que
 * se vean los tres estados: los reemplaza la liga desde el panel.
 */
export const TORNEOS_MOCK: Torneo[] = [
  {
    slug: "2do-torneo-singles-caballeros-2026",
    nombre: "2° Torneo Singles Caballeros",
    modalidad: "singles",
    estado: "en_progreso",
    periodo: "Septiembre 2026",
    sede: "Club Sarmiento",
    resultados: [],
    orden: 40,
    provisorio: true,
  },
  {
    slug: "1er-torneo-dobles-2026",
    nombre: "1° Torneo de Dobles",
    modalidad: "dobles",
    estado: "en_camino",
    periodo: "Octubre 2026",
    sede: "Polideportivo Municipal",
    resultados: [],
    orden: 30,
    provisorio: true,
  },
  {
    slug: "1er-torneo-singles-damas-2026",
    nombre: "1° Torneo Singles Damas",
    modalidad: "singles",
    estado: "terminado",
    periodo: "Temporada 2026",
    resultados: [{ categoriaSlug: "1ra-damas", puesto: 1, nombres: ["Agustina Díaz"] }],
    orden: 20,
  },
  {
    slug: "1er-torneo-singles-caballeros-2026",
    nombre: "1° Torneo Singles Caballeros",
    modalidad: "singles",
    estado: "terminado",
    periodo: "Abril 2026",
    resultados: [
      { categoriaSlug: "intermedia-caballeros", puesto: 1, nombres: ["Leandro Bordeu"] },
    ],
    orden: 10,
  },
];
