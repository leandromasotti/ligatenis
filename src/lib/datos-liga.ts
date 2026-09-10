/**
 * Datos de referencia de la liga, tomados de la prensa local y del Facebook oficial.
 *
 * Fuentes:
 *   · https://www.facebook.com/p/Liga-Dolorense-de-Tenis-100090742189864/
 *   · https://www.criterioonline.com/2026/04/se-jugo-el-1-torneo-de-tenis-de-la-liga-dolorense-singles-caballeros/
 *   · https://2245.com.ar/se-jugo-el-1-torneo-de-tenis-de-la-liga-dolorense-singles-caballeros/
 *
 * PROVISORIO. Sirve para que el sitio no se vea vacío mientras se arma, y se
 * reemplaza en el sprint 3 por la tabla `profiles` de Supabase, con los datos que
 * cargue cada tenista. Acá solo hay información ya publicada: nombre, categoría y
 * si fue campeón. No se registran puntos ni posiciones, porque las fuentes no los
 * dan y no se inventan datos de personas reales.
 */

export type JugadorReferencia = {
  nombre: string;
  categoriaSlug: string;
  /** Campeón del 1° Torneo de la liga, temporada 2026. */
  campeon?: boolean;
};

export const NOTA_PROVISORIA =
  "Datos publicados por la prensa local y el Facebook de la liga. Se reemplazan cuando cada tenista cargue su perfil.";

export const JUGADORES: JugadorReferencia[] = [
  // Singles caballeros · Intermedia
  { nombre: "Leandro Bordeu", categoriaSlug: "intermedia-caballeros", campeon: true },
  { nombre: "Gabriel Franco", categoriaSlug: "intermedia-caballeros" },
  { nombre: "Nicolás Piazza", categoriaSlug: "intermedia-caballeros" },
  { nombre: "Germán Pereyra", categoriaSlug: "intermedia-caballeros" },
  { nombre: "Martín Isaurralde", categoriaSlug: "intermedia-caballeros" },
  { nombre: "Marcelo Obregón", categoriaSlug: "intermedia-caballeros" },

  // Singles caballeros · 2da
  // La prensa escribió "Pickler"; la planilla oficial de la liga dice PICHLER.
  { nombre: "Pablo Pichler", categoriaSlug: "2da-caballeros" },
  { nombre: "Daniel Gutiérrez", categoriaSlug: "2da-caballeros" },
  { nombre: 'Francisco "Pancho" Mario', categoriaSlug: "2da-caballeros" },
  { nombre: "Fernando Castillo", categoriaSlug: "2da-caballeros" },
  { nombre: "Ezequiel Bravo", categoriaSlug: "2da-caballeros" },
  { nombre: "Carlos Torrez", categoriaSlug: "2da-caballeros" },

  // Singles caballeros · 3ra
  { nombre: "Marcos Acosta", categoriaSlug: "3ra-caballeros" },
  { nombre: "Guillermo Laborde", categoriaSlug: "3ra-caballeros" },
  { nombre: "Juan Merino", categoriaSlug: "3ra-caballeros" },

  // Singles damas · 1ra
  { nombre: "Agustina Díaz", categoriaSlug: "1ra-damas", campeon: true },
  { nombre: "Celeste Dangelo", categoriaSlug: "1ra-damas" },
  { nombre: "Natalia Ale", categoriaSlug: "1ra-damas" },
  { nombre: "Ana Roncoroni", categoriaSlug: "1ra-damas" },

  // Singles damas · 4ta
  { nombre: "Irina Ortiz", categoriaSlug: "4ta-damas" },
  { nombre: "Miranda Molina", categoriaSlug: "4ta-damas" },
  { nombre: "Mariela Alam", categoriaSlug: "4ta-damas" },
  { nombre: "Natalia Cornaglia", categoriaSlug: "4ta-damas" },
];

/**
 * Cuadros que la liga juega pero para los que todavía no hay nombres publicados.
 * Con el padrón 2024 de caballeros cargado, solo quedarían cuadros de damas si se
 * activaran los que están inactivos.
 */
export const CUADROS_SIN_PADRON: Record<string, string> = {};

export function jugadoresDe(categoriaSlug: string): JugadorReferencia[] {
  return JUGADORES.filter((jugador) => jugador.categoriaSlug === categoriaSlug).sort((a, b) => {
    if (a.campeon !== b.campeon) return a.campeon ? -1 : 1;
    return a.nombre.localeCompare(b.nombre, "es-AR");
  });
}

export function campeones(): JugadorReferencia[] {
  return JUGADORES.filter((jugador) => jugador.campeon);
}

export function iniciales(nombre: string): string {
  return nombre
    .replace(/"[^"]*"/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}
