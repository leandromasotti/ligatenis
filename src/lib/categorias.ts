export type GeneroCategoria = "damas" | "caballeros";
export type ModalidadCategoria = "singles" | "dobles";

export type Categoria = {
  slug: string;
  /** Texto libre: la liga usa 1ra a 5ta e Intermedia, y la lista la define la organización. */
  nivel: string;
  genero: GeneroCategoria;
  modalidad: ModalidadCategoria;
  nombre: string;
  orden: number;
};

/**
 * Cuadros activos, como stand-in hasta que se lean de la tabla `categorias` de
 * Supabase. Coincide con lo que carga la migración 0003.
 *
 * En caballeros NO hay Primera: la planilla oficial 2024 de la liga lista
 * Intermedia, Segunda, Tercera, Cuarta y Quinta, y la máxima es Intermedia. Los
 * cuadros de damas sin actividad publicada quedan inactivos hasta confirmarlos.
 */
export const CATEGORIAS: Categoria[] = [
  {
    slug: "intermedia-caballeros",
    nivel: "Intermedia",
    genero: "caballeros",
    modalidad: "singles",
    nombre: "Intermedia Caballeros",
    orden: 1,
  },
  {
    slug: "2da-caballeros",
    nivel: "2da",
    genero: "caballeros",
    modalidad: "singles",
    nombre: "2da Caballeros",
    orden: 3,
  },
  {
    slug: "3ra-caballeros",
    nivel: "3ra",
    genero: "caballeros",
    modalidad: "singles",
    nombre: "3ra Caballeros",
    orden: 4,
  },
  {
    slug: "4ta-caballeros",
    nivel: "4ta",
    genero: "caballeros",
    modalidad: "singles",
    nombre: "4ta Caballeros",
    orden: 5,
  },
  {
    slug: "5ta-caballeros",
    nivel: "5ta",
    genero: "caballeros",
    modalidad: "singles",
    nombre: "5ta Caballeros",
    orden: 6,
  },
  {
    slug: "1ra-damas",
    nivel: "1ra",
    genero: "damas",
    modalidad: "singles",
    nombre: "1ra Damas",
    orden: 7,
  },
  {
    slug: "4ta-damas",
    nivel: "4ta",
    genero: "damas",
    modalidad: "singles",
    nombre: "4ta Damas",
    orden: 8,
  },
];

export function getCategoria(slug: string): Categoria | undefined {
  return CATEGORIAS.find((categoria) => categoria.slug === slug);
}

export const ETIQUETA_GENERO: Record<GeneroCategoria, string> = {
  damas: "Damas",
  caballeros: "Caballeros",
};

/** Sedes de la liga, según la migración 0003. Stand-in hasta el sprint 3. */
export const CLUBES = [
  "Club Sarmiento",
  "Club Atlético Ever Ready",
  "Club Social",
  "Polideportivo Municipal",
  "Naytuel",
] as const;

/** Localidades de las que llegan tenistas a la liga. */
export const LOCALIDADES = ["Dolores", "Castelli", "Pila", "Chascomús"] as const;
