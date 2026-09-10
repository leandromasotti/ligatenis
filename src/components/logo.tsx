type LogoProps = {
  className?: string;
  /** Oculta el isotipo para el lector de pantalla cuando el nombre ya está al lado. */
  decorativo?: boolean;
};

/**
 * Isotipo de la liga: raqueta de perfil con el encordado en celeste y la pelota
 * en amarillo. Toma los colores de los tokens, así que funciona en los dos temas.
 */
export function Raqueta({ className = "h-8 w-8", decorativo = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={decorativo ? "presentation" : "img"}
      aria-hidden={decorativo || undefined}
      aria-label={decorativo ? undefined : "Liga Dolorense de Tenis"}
    >
      <ellipse
        cx="16"
        cy="12"
        rx="9"
        ry="10.5"
        fill="none"
        strokeWidth="2"
        className="stroke-verde"
      />
      <path
        d="M8.6 6.2c4.6 3 9.9 8.3 12.9 12.9M23.4 6.2c-4.6 3-9.9 8.3-12.9 12.9M7.2 12h17.6M16 2.2v19.6"
        fill="none"
        strokeWidth="1"
        className="stroke-celeste opacity-70"
      />
      <path d="M13.6 21.4 12 30h8l-1.6-8.6z" fill="none" strokeWidth="2" className="stroke-verde" />
      <circle cx="26" cy="24.5" r="3" className="fill-amarillo" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Raqueta className="h-8 w-8 shrink-0" decorativo />
      <span className="font-display leading-none">
        <span className="block text-[0.95rem] font-semibold tracking-tight">Liga Dolorense</span>
        <span className="text-verde block text-[0.66rem] font-semibold tracking-[0.16em] uppercase">
          de Tenis
        </span>
      </span>
    </span>
  );
}
