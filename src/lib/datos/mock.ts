import { JUGADORES } from "@/lib/datos-liga";
import type { MiembroEquipo, Tenista, Torneo } from "@/lib/datos/tipos";

/**
 * Datos mock, mientras no hay base de datos.
 *
 * Regla que se respeta acá: son personas reales, así que los únicos datos que se
 * cargan son los ya publicados (nombre, categoría y si fueron campeones). Los
 * campos del perfil deportivo quedan vacíos a propósito — los carga cada tenista
 * cuando se registre, y la ficha está diseñada para verse bien así.
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

export const TENISTAS_MOCK: Tenista[] = JUGADORES.map((jugador) => ({
  slug: slugify(jugador.nombre),
  nombre: jugador.nombre,
  categoriaSlug: jugador.categoriaSlug,
  campeon: jugador.campeon,
}));

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
