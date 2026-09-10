import type { IconoAnuncio } from "@/lib/datos/anuncios";

/**
 * Pictogramas dibujados para este sitio, uno por rubro de anunciante. No son logos
 * de marca: le dan identidad visual al banner sin usar propiedad de terceros.
 */
export function MarcaIcono({
  nombre,
  color,
  className = "h-8 w-8",
}: {
  nombre: IconoAnuncio;
  color: string;
  className?: string;
}) {
  const comun = {
    className,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (nombre) {
    case "raqueta":
      return (
        <svg {...comun}>
          <ellipse cx="15" cy="11.5" rx="8" ry="9.5" />
          <path d="M9 6.5c3.6 2.4 7.8 6.6 10.2 10.2M21 6.5c-3.6 2.4-7.8 6.6-10.2 10.2" />
          <path d="M12.8 20.6 11.5 29h7l-1.3-8.4z" />
        </svg>
      );
    case "helado":
      return (
        <svg {...comun}>
          <path d="M10.5 13.5a5.5 5.5 0 0 1 11 0" />
          <path d="M10 13.5h12L16.5 29z" />
          <path d="M12.5 19h8M14 24h5" />
        </svg>
      );
    case "zapatilla":
      return (
        <svg {...comun}>
          <path d="M3 21.5h20.5c3 0 5.5-1.4 5.5-3.4 0-1.7-1.6-2.4-3.6-2.9l-5.3-1.4-3.3-3.3H8L3 15.5z" />
          <path d="M3 21.5v3h26M9.5 10.5l3 4M13.5 10.5l3 4" />
        </svg>
      );
    case "pelota":
      return (
        <svg {...comun}>
          <circle cx="16" cy="16" r="11.5" />
          <path d="M5.6 10.8A11.5 11.5 0 0 1 16 27.5M26.4 10.8A11.5 11.5 0 0 0 16 27.5" />
        </svg>
      );
    case "remera":
      return (
        <svg {...comun}>
          <path d="M12 4.5 6 8l2 5 3-1.2V28h10V11.8L24 13l2-5-6-3.5z" />
          <path d="M12 4.5c0 2.4 1.8 3.8 4 3.8s4-1.4 4-3.8" />
        </svg>
      );
    case "codigo":
      return (
        <svg {...comun}>
          <path d="M11.5 9 4 16l7.5 7M20.5 9 28 16l-7.5 7M18.5 6.5l-5 19" />
        </svg>
      );
  }
}
