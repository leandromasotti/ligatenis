import { IconoWhatsapp } from "@/components/icono-whatsapp";
import { enlaceWhatsapp, WHATSAPP } from "@/lib/contacto";

/**
 * Botón flotante de contacto por WhatsApp, abajo a la derecha.
 *
 * En pantallas grandes el texto aparece al pasar el mouse o al recibir el foco,
 * hecho solo con CSS: no necesita estado ni JavaScript. Si la liga todavía no
 * cargó su número, el botón no se dibuja.
 */
export function BotonWhatsapp() {
  if (!WHATSAPP) return null;

  return (
    <a
      href={enlaceWhatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a la liga por WhatsApp"
      className="group fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pr-3 pl-3 text-[#06251A] shadow-lg transition-[padding,box-shadow] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06251A] sm:right-6 sm:bottom-6 sm:group-hover:pr-5 md:hover:pr-5 md:focus-visible:pr-5"
    >
      <IconoWhatsapp className="h-7 w-7 shrink-0" />
      <span className="font-display hidden max-w-0 overflow-hidden text-[0.92rem] font-semibold whitespace-nowrap transition-[max-width] duration-200 group-hover:max-w-[9rem] group-focus-visible:max-w-[9rem] md:inline">
        Escribinos
      </span>
    </a>
  );
}
