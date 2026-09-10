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
    // Inventario remanente: el sponsor de la casa va solo al pie, la ubicación
    // menos valiosa y la que menos páginas tienen. Las buenas quedan para los
    // anunciantes que pagan.
    slots: ["pie"],
    peso: 1,
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

/**
 * Hash con mezcla final (FNV-1a + finalizador de MurmurHash3).
 *
 * La mezcla no es adorno: con un hash simple, claves parecidas como
 * "cuadro:2da-caballeros" y "cuadro:4ta-caballeros" daban valores contiguos y el
 * sorteo terminaba eligiendo al mismo anunciante en casi todos los cuadros. El
 * finalizador desparrama los bits y hace que claves vecinas den resultados
 * independientes, que es lo que el reparto necesita para respetar los pesos.
 */
function hash(texto: string): number {
  let valor = 2166136261;
  for (let i = 0; i < texto.length; i += 1) {
    valor ^= texto.charCodeAt(i);
    valor = Math.imul(valor, 16777619);
  }
  valor ^= valor >>> 16;
  valor = Math.imul(valor, 2246822507);
  valor ^= valor >>> 13;
  valor = Math.imul(valor, 3266489909);
  valor ^= valor >>> 16;
  return valor >>> 0;
}

/** Los cuatro formatos, en un orden fijo, para repartir de a uno. */
// De la ubicación más frecuente del sitio a la menos: el primero en la lista se
// queda con la mejor posición del sorteo, así el peso se refleja donde más se ve.
const ORDEN_SLOTS: SlotPublicidad[] = ["lateral", "listado", "cabecera", "pie"];

/**
 * El pie es inventario remanente: se reparte al revés, al anunciante de menor
 * peso que quede libre.
 *
 * Es lo que hace un ad server con el aviso de la casa — que exista, pero en la
 * ubicación que nadie más está pagando. Sin esta regla el pie se sortea último y
 * el anunciante liviano no lo gana nunca, así que 4x quedaba en cero ubicaciones.
 */
const SLOT_REMANENTE: SlotPublicidad = "pie";

/**
 * Ordena los anuncios al azar pero determinista, dando más chances de quedar
 * primero a los de mayor peso. Es un sorteo sin reposición: cada anunciante
 * aparece una sola vez en el resultado.
 */
function ordenarPorPagina(semilla: number): Anuncio[] {
  const restantes = [...ANUNCIOS];
  const orden: Anuncio[] = [];
  let estado = (semilla ^ 0x9e3779b9) >>> 0;

  while (restantes.length > 0) {
    const pesoTotal = restantes.reduce((total, anuncio) => total + anuncio.peso, 0);
    estado ^= estado >>> 15;
    estado = Math.imul(estado, 2246822507) >>> 0;
    let posicion = estado % pesoTotal;

    let indice = 0;
    for (; indice < restantes.length - 1; indice += 1) {
      posicion -= restantes[indice].peso;
      if (posicion < 0) break;
    }

    orden.push(restantes.splice(indice, 1)[0]);
  }

  return orden;
}

/**
 * Reparte los avisos de una página: a cada formato le toca un anunciante distinto.
 *
 * El reparto se hace por página y no por hueco, porque si cada espacio eligiera
 * solo, dos huecos de la misma página podrían mostrar el mismo aviso. Se sortea
 * una vez el orden de los anunciantes —ponderado por peso— y después se recorren
 * los cuatro formatos en orden fijo, tomando cada uno el primer anunciante libre
 * que acepte ese formato.
 *
 * Recorrer siempre los cuatro formatos, y no solo los que la página usa, es lo que
 * hace que el resultado no dependa de cuántos huecos tenga cada página: así la
 * función no necesita saberlo y no hay una lista que mantener sincronizada.
 */
function repartirPagina(clave: string): Partial<Record<SlotPublicidad, Anuncio>> {
  const orden = ordenarPorPagina(hash(clave));
  const usados = new Set<string>();
  const asignado: Partial<Record<SlotPublicidad, Anuncio>> = {};

  for (const slot of ORDEN_SLOTS) {
    const libres = orden.filter(
      (anuncio) => anuncio.slots.includes(slot) && !usados.has(anuncio.id),
    );

    // Más formatos que anunciantes: recién ahí se permite repetir.
    const disponibles =
      libres.length > 0 ? libres : orden.filter((anuncio) => anuncio.slots.includes(slot));

    const elegido =
      slot === SLOT_REMANENTE
        ? disponibles.reduce(
            (menor, anuncio) => (anuncio.peso < menor.peso ? anuncio : menor),
            disponibles[0],
          )
        : disponibles[0];

    if (elegido) {
      asignado[slot] = elegido;
      usados.add(elegido.id);
    }
  }

  return asignado;
}

/**
 * El aviso que le toca a un formato en una página.
 *
 * Es reparto por ubicación y no por visita, porque las páginas se generan estáticas
 * y un anuncio elegido al azar quedaría congelado en el build. Rotar en cada carga
 * exige volver la página dinámica o cambiar el banner en el cliente: es una decisión
 * de rendimiento a tomar cuando haya muchos sponsors compitiendo por el mismo espacio.
 */
export function elegirAnuncio(slot: SlotPublicidad, clave: string): Anuncio | undefined {
  return repartirPagina(clave)[slot];
}

export function sponsors(): Anuncio[] {
  return ANUNCIOS.filter((anuncio) => !anuncio.disponible);
}

export function haySponsorsDemo(): boolean {
  return ANUNCIOS.some((anuncio) => anuncio.demo);
}
