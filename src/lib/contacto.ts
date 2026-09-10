/**
 * Datos de contacto de la liga.
 *
 * El número va en formato internacional, sin el signo + y sin espacios ni guiones,
 * porque así lo espera wa.me. Si se deja vacío, el botón flotante no se dibuja.
 */
export const WHATSAPP = "5492241688446";

/** Se muestra como +54 9 2241 68-8446 cuando hace falta leerlo. */
export const WHATSAPP_LEGIBLE = "+54 9 2241 68-8446";

export const WHATSAPP_MENSAJE =
  "¡Hola! Escribo desde la web de la Liga Dolorense de Tenis. Quería consultar por";

export const FACEBOOK = "https://www.facebook.com/p/Liga-Dolorense-de-Tenis-100090742189864/";

export function enlaceWhatsapp(mensaje: string = WHATSAPP_MENSAJE): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}
