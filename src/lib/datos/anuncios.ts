export type SlotPublicidad = "cabecera" | "listado" | "lateral" | "pie";

export type IconoAnuncio = "raqueta" | "helado" | "zapatilla" | "pelota" | "remera" | "codigo";

export type Anuncio = {
  id: string;
  titulo: string;
  bajada?: string;
  /** Dominio tal como se muestra en el banner. */
  dominio?: string;
  urlDestino?: string;
  /** Imagen del banner. Cuando el sponsor la manda, reemplaza al logotipo de texto. */
  imagenUrl?: string;
  icono?: IconoAnuncio;
  /** Colores del aviso. Son del anunciante, no del sitio: no salen de los tokens. */
  marca?: { fondo: string; texto: string; acento: string };
  slots: SlotPublicidad[];
  /** A mayor peso, más ubicaciones le tocan en el reparto. */
  peso: number;
  /** Espacio libre a la venta: no es un sponsor, es una invitación a serlo. */
  disponible?: boolean;
  /**
   * Anunciante de muestra: marca real con la que la liga todavía no tiene acuerdo.
   * Está para que el sitio se vea como se va a ver en producción.
   */
  demo?: boolean;
};

/**
 * ATENCIÓN antes de publicar el sitio: poner en `false`.
 *
 * Los avisos marcados como `demo` usan nombres de marcas reales sin acuerdo con la
 * liga. Sirven para la demo y para probar el reparto entre ubicaciones, pero
 * publicarlos afirmaría un patrocinio que no existe. Con el switch en `false`
 * quedan solo los sponsors reales y los espacios a la venta, sin tocar nada más.
 *
 * Ninguno usa el logo de la marca: el banner es un logotipo de texto con un ícono
 * dibujado para este sitio. Cuando haya acuerdo, el sponsor manda su imagen y se
 * carga en `imagenUrl`.
 */
const INCLUIR_DEMO = true;

const TODOS: Anuncio[] = [
  {
    id: "4x",
    titulo: "4x",
    bajada: "Desarrollo de software",
    dominio: "4x.com.ar",
    urlDestino: "https://www.4x.com.ar",
    icono: "codigo",
    marca: { fondo: "#101820", texto: "#F5F7F6", acento: "#5CC98C" },
    slots: ["cabecera", "listado", "lateral", "pie"],
    peso: 4,
  },
  {
    id: "escuela-fernando-calvo",
    titulo: "Fernando Calvo",
    bajada: "Escuela de tenis",
    icono: "raqueta",
    marca: { fondo: "#0E4D2E", texto: "#F2F8F4", acento: "#F2C200" },
    slots: ["cabecera", "listado", "lateral", "pie"],
    peso: 3,
    demo: true,
  },
  {
    id: "grido",
    titulo: "Grido",
    bajada: "Helados",
    icono: "helado",
    marca: { fondo: "#B3122B", texto: "#FFF6F2", acento: "#FFD400" },
    slots: ["cabecera", "listado", "lateral", "pie"],
    peso: 3,
    demo: true,
  },
  {
    id: "match-point",
    titulo: "Match Point",
    bajada: "Todo para tu juego",
    icono: "pelota",
    marca: { fondo: "#1B2A6B", texto: "#F3F5FF", acento: "#63C6E2" },
    slots: ["cabecera", "listado", "lateral", "pie"],
    peso: 3,
    demo: true,
  },
  {
    id: "alpine-skate",
    titulo: "Alpine Skate",
    bajada: "Calzado deportivo",
    icono: "zapatilla",
    marca: { fondo: "#14161A", texto: "#F4F4F5", acento: "#E8452C" },
    slots: ["cabecera", "listado", "lateral", "pie"],
    peso: 2,
    demo: true,
  },
  {
    id: "topper",
    titulo: "Topper",
    bajada: "Indumentaria deportiva",
    icono: "remera",
    marca: { fondo: "#0E2A47", texto: "#EEF4FA", acento: "#F5CE3A" },
    slots: ["cabecera", "listado", "lateral", "pie"],
    peso: 2,
    demo: true,
  },
  {
    id: "disponible-1",
    titulo: "Este espacio está disponible",
    bajada: "Acompañá a la liga y llegá a los tenistas de Dolores y la zona",
    // Solo en los formatos grandes: la ubicación que suele ser el único aviso de
    // una página nunca se gasta en una invitación, va siempre a un sponsor.
    slots: ["cabecera", "pie"],
    peso: 2,
    disponible: true,
  },
];

/**
 * Sponsors de la liga.
 *
 * Hoy es una constante; en el panel del sprint 5 esto pasa a la tabla `anuncios`
 * de Supabase, con vigencia desde/hasta y orden. La forma de los datos es la misma,
 * así que el cambio es reemplazar este archivo por una consulta.
 */
export const ANUNCIOS: Anuncio[] = TODOS.filter((anuncio) => INCLUIR_DEMO || !anuncio.demo);

/**
 * Medidas de los espacios. `medida` es el formato IAB que se le pide al
 * anunciante, y `alto` la altura real del hueco en el layout.
 *
 * Son alturas fijas y no `aspect-ratio` a propósito. Un banner real no se encoge
 * en proporción: un leaderboard mide 90 px de alto siempre, y el creativo se
 * centra. Además, combinar un aspect-ratio ancho con un alto mínimo hace que el
 * navegador calcule el ANCHO a partir del alto — 970/90 con min-height 128px daba
 * una caja de 1380 px que desbordaba la página de costado.
 */
export const MEDIDAS: Record<SlotPublicidad, { medida: string; alto: string }> = {
  cabecera: { medida: "970 × 90", alto: "h-[90px]" },
  listado: { medida: "728 × 90", alto: "h-[90px]" },
  lateral: { medida: "300 × 600", alto: "h-[132px] lg:h-[600px]" },
  pie: { medida: "970 × 250", alto: "h-[140px] sm:h-[250px]" },
};

function hash(texto: string): number {
  let valor = 0;
  for (let i = 0; i < texto.length; i += 1) {
    valor = (valor * 31 + texto.charCodeAt(i)) % 100000;
  }
  return valor;
}

/**
 * Reparte los avisos entre las ubicaciones del sitio: cada combinación de slot y
 * página recibe siempre el mismo anuncio, ponderado por peso.
 *
 * Es reparto por ubicación y no por visita, porque las páginas se generan estáticas
 * y un anuncio elegido al azar quedaría congelado en el build. Rotar en cada carga
 * exige volver la página dinámica o cambiar el banner en el cliente: es una decisión
 * de rendimiento a tomar cuando haya muchos sponsors compitiendo por el mismo espacio.
 */
export function elegirAnuncio(slot: SlotPublicidad, clave: string): Anuncio | undefined {
  const candidatos = ANUNCIOS.filter((anuncio) => anuncio.slots.includes(slot));
  if (candidatos.length === 0) return undefined;

  const pesoTotal = candidatos.reduce((total, anuncio) => total + anuncio.peso, 0);
  let posicion = hash(`${slot}:${clave}`) % pesoTotal;

  for (const anuncio of candidatos) {
    posicion -= anuncio.peso;
    if (posicion < 0) return anuncio;
  }

  return candidatos[0];
}

export function sponsors(): Anuncio[] {
  return ANUNCIOS.filter((anuncio) => !anuncio.disponible);
}

export function haySponsorsDemo(): boolean {
  return ANUNCIOS.some((anuncio) => anuncio.demo);
}
