import type { GeneroCategoria, ModalidadCategoria } from "@/lib/categorias";

export type Mano = "derecha" | "izquierda";
export type Reves = "una_mano" | "dos_manos";

/**
 * Un tenista tal como lo ve el sitio público. Los campos opcionales son los que
 * carga cada uno en su perfil: mientras no lo hagan, la ficha los muestra vacíos.
 * Se corresponde uno a uno con la tabla `profiles` de Supabase.
 */
export type Tenista = {
  slug: string;
  /** Nombre completo, como se muestra: "Martín Isaurralde". */
  nombre: string;
  /** Solo el apellido, para ordenar el padrón como lo lista la liga. */
  apellido?: string;
  categoriaSlug: string;
  /** Campeón del 1° Torneo 2026 de su cuadro. */
  campeon?: boolean;
  fotoUrl?: string;
  mano?: Mano;
  reves?: Reves;
  club?: string;
  localidad?: string;
  bio?: string;
  instagram?: string;
};

export type MiembroEquipo = {
  slug: string;
  nombre?: string;
  rol: string;
  fotoUrl?: string;
  bio?: string;
};

export type CuadroConTenistas = {
  slug: string;
  nombre: string;
  nivel: string;
  genero: GeneroCategoria;
  modalidad: ModalidadCategoria;
  tenistas: Tenista[];
};

export const ETIQUETA_MANO: Record<Mano, string> = {
  derecha: "Diestro",
  izquierda: "Zurdo",
};

export const ETIQUETA_REVES: Record<Reves, string> = {
  una_mano: "Revés a una mano",
  dos_manos: "Revés a dos manos",
};

/** El perfil está completo cuando el tenista cargó al menos foto, mano y club. */
export function perfilCompleto(tenista: Tenista): boolean {
  return Boolean(tenista.fotoUrl && tenista.mano && tenista.club);
}

export type EstadoTorneo = "en_progreso" | "en_camino" | "terminado";

/** Campeones o subcampeones de un cuadro: un nombre en singles, dos en dobles. */
export type ResultadoTorneo = {
  categoriaSlug: string;
  puesto: 1 | 2;
  nombres: string[];
};

export type Torneo = {
  slug: string;
  nombre: string;
  modalidad: ModalidadCategoria;
  estado: EstadoTorneo;
  /** Etiqueta libre que escribe la liga: "Abril 2026", "Del 12 al 20 de octubre". */
  periodo: string;
  sede?: string;
  /** Cargados por el admin al terminar el torneo. */
  resultados: ResultadoTorneo[];
  /** Mayor primero: el orden lo decide la liga, no una fecha. */
  orden: number;
  /** Dato tomado de la prensa o puesto de muestra, a confirmar. */
  provisorio?: boolean;
};

export const ETIQUETA_ESTADO: Record<EstadoTorneo, string> = {
  en_progreso: "En juego",
  en_camino: "En camino",
  terminado: "Terminado",
};

export const ETIQUETA_MODALIDAD: Record<ModalidadCategoria, string> = {
  singles: "Singles",
  dobles: "Dobles",
};
