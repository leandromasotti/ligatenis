/**
 * Padrón de caballeros de la temporada 2024, transcripto de la planilla oficial
 * "LISTADO POR CATEGORÍAS AÑO 2024 - L.D.T." que pasó la liga.
 *
 * Dos cosas que confirma esa planilla y que corrigen supuestos anteriores:
 *   1. en caballeros NO hay Primera: las categorías son Intermedia, Segunda,
 *      Tercera, Cuarta y Quinta, y la máxima es Intermedia
 *   2. el grueso de los inscriptos está en Cuarta y Quinta, como decía la prensa
 *
 * Es el padrón de 2024, así que es una foto de una temporada anterior: los
 * nombres que la prensa publicó para 2026 tienen prioridad sobre estos y pueden
 * pisar la categoría (ver la mezcla en `mock.ts`).
 *
 * REVISAR con la liga:
 *   · "Federico Hernandez" (Cuarta) aparece cortado en el borde de la foto
 *   · los ocho nombres de `AGREGADOS_CUARTA` están en un papel pegado sobre la
 *     planilla, al lado de la columna de Cuarta: hay que confirmar que son de
 *     esa categoría
 *   · "Alejo Navarro" figura en Segunda y en Tercera a la vez: acá quedó solo en
 *     Tercera, a confirmar cuál corresponde o si son dos personas distintas
 *   · la planilla dice PICHLER y la prensa escribió "Pickler": se toma PICHLER,
 *     que es el documento de la liga
 *   · no hay listado de damas: esos ocho nombres siguen saliendo de la prensa
 */

/** [apellido, nombre] tal como figuran en la planilla. */
export type EntradaPadron = readonly [string, string];

export const INTERMEDIA: EntradaPadron[] = [
  ["Almagro", "Franco"],
  ["Ciancio", "Francisco"],
  ["Falconnat", "Jonatan"],
  ["Franco", "Gabriel"],
  ["Isaurralde", "Martín"],
  ["Kessler", "Iván"],
  ["Laguandos", "José"],
  ["Lanz", "Francisco"],
  ["Mossi", "Axel"],
  ["Ortiz", "Daniel"],
  ["Pereyra", "Germán"],
  ["Stutz", "Facundo"],
  ["Suzic", "Matías"],
  ["Ulke", "Martín"],
];

export const SEGUNDA: EntradaPadron[] = [
  ["Alegre", "Franco"],
  ["Artillo", "Sebastian"],
  ["Battisttessa", "Lucas"],
  ["Blanco", "Nicolás"],
  ["Caraccioli", "Oscar"],
  ["Cremonte", "Juan Pablo"],
  ["Flores", "Adrián"],
  ["Galdos", "Joaquín"],
  ["Giles", "Marcos"],
  ["Gomez", "Roberto"],
  ["Hernandez", "Gabriel"],
  ["Irazabal", "Bautista"],
  ["Mario", "Francisco"],
  ["Martinez Molard", "Jorge"],
  ["Molina", "Franklin"],
  ["Molina", "Gabriel"],
  ["Navarro", "Diego"],
  ["Obregón", "Marcelo"],
  ["Olguin", "Néstor"],
  ["Orruño", "Juan"],
  ["Panus", "Telemaco"],
  ["Pardo", "Néstor"],
  ["Pichler", "Pablo"],
  ["Soler", "Mauricio"],
  ["Speroni", "Lucas"],
  ["Tamayo", "Cristian"],
  ["Torrez", "Carlos"],
];

export const TERCERA: EntradaPadron[] = [
  ["Aguirrezabala", "Guillermo"],
  ["Almada", "Sergio"],
  ["Aranciaga", "Federico"],
  ["Casco", "Daniel"],
  ["Duarte", "Pedro"],
  ["Farias", "Matías"],
  ["Garcia", "Cesar"],
  ["Lamacchia", "Gustavo"],
  ["Lanz", "Carlos"],
  ["Mario", "Agustín"],
  ["Meckievi", "Cesar"],
  ["Mendoza", "Daniel"],
  ["Moreni", "Fernando"],
  ["Moreni", "Osvaldo"],
  ["Moroni", "Julián"],
  ["Navarro", "Alejo"],
  ["Pivano", "José"],
  ["Solis", "Ignacio"],
  ["Soto", "Gonzalo"],
  ["Teisera", "Hernán"],
  ["Velazquez", "Marcelo"],
  ["Vincent", "Marcelo"],
];

export const CUARTA: EntradaPadron[] = [
  ["Acosta", "Marcos"],
  ["Akino", "Mariano"],
  ["Andrade", "Santiago"],
  ["Azar", "Elio"],
  ["Baraglia", "Juan"],
  ["Barbosa", "Pedro"],
  ["Barroca", "Camilo"],
  ["Cejas", "Matías"],
  ["Dejneka", "Gian"],
  ["Diaz", "Mauricio"],
  ["Espinosa", "Martín"],
  ["Estrada", "Gustavo"],
  ["Eyherabide", "Matías"],
  ["Ferreyra", "Walter"],
  ["Gabotto", "Matías"],
  ["Gonzalez", "Diego"],
  ["Hernandez", "Federico"],
  ["Iglesias", "Pablo"],
  ["Lamacchia", "Nicolás"],
  ["Larrouy", "Roberto"],
  ["León", "Diego"],
  ["Luca", "Marcelo"],
  ["Manias", "Carlos"],
  ["Martin", "Emanuel"],
  ["Medina", "Federico"],
  ["Mena", "Ulises"],
  ["Mene", "Marcelo"],
  ["Merino", "Juan"],
  ["Nazer", "Ariel"],
  ["Rodriguez", "Julio"],
  ["Suarez", "Pablo"],
  ["Tamayo", "Santiago"],
  ["Vallejos", "Juan"],
];

/** Papel pegado sobre la planilla, al lado de la columna de Cuarta. */
export const AGREGADOS_CUARTA: EntradaPadron[] = [
  ["Bacalov", "Pedro"],
  ["Belarra", "Hernán"],
  ["Lafuente", "Rodrigo"],
  ["Maldonado", "Ruben"],
  ["Navarro", "Víctor"],
  ["Pettinari", "Leopoldo"],
  ["Siste", "Juan"],
  ["Wolcheff", "Pablo"],
];

export const QUINTA: EntradaPadron[] = [
  ["Benitez", "Juan de Dios"],
  ["Cellillo", "Ayrton"],
  ["Cellillo", "Marcos"],
  ["Ciancio", "Leonardo"],
  ["Cuenca", "Ariel"],
  ["Eyherabide", "Javier"],
  ["Eyherabide", "Joaquin"],
  ["Eyherabide", "Nicolás"],
  ["Fontana", "Cristian"],
  ["Franco", "Marcelo"],
  ["Galarraga", "Juan"],
  ["Grande", "Roberto"],
  ["Guerra", "Cristian"],
  ["Isaurralde", "Adrián"],
  ["Lima", "Pablo"],
  ["Maggio", "Matías"],
  ["Martin", "Nicolás"],
  ["Morales", "Marcelo"],
  ["Orellano", "Paul"],
  ["Oroz", "Gonzalo"],
  ["Ortiz", "Marcos"],
  ["Quintana", "Matías"],
  ["Rossi", "Nicolás"],
  ["Tami", "Cristian"],
  ["Villagra", "Maximiliano"],
];

/** El padrón completo, por slug de cuadro. */
export const PADRON_2024: Record<string, EntradaPadron[]> = {
  "intermedia-caballeros": INTERMEDIA,
  "2da-caballeros": SEGUNDA,
  "3ra-caballeros": TERCERA,
  "4ta-caballeros": [...CUARTA, ...AGREGADOS_CUARTA],
  "5ta-caballeros": QUINTA,
};
