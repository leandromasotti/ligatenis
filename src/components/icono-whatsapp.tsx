/** Glifo de WhatsApp: teléfono dentro del globo de chat. */
export function IconoWhatsapp({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.79c2.17 0 4.2.84 5.74 2.38a8.07 8.07 0 0 1 2.38 5.74c0 4.48-3.65 8.12-8.13 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.07.81.82-3-.19-.31a8.07 8.07 0 0 1-1.24-4.31c0-4.48 3.65-8.12 8.12-8.12z" />
      <path d="M9.36 7.24c-.19-.43-.39-.44-.57-.44l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.02 2.6c.13.16 1.74 2.79 4.22 3.8 2.06.84 2.35.67 2.77.63.43-.04 1.38-.56 1.57-1.11.19-.55.19-1.02.14-1.11-.06-.1-.23-.16-.48-.28-.25-.13-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.15.25-.6.78-.73.94-.14.16-.27.18-.5.06-.23-.13-.98-.36-1.87-1.15-.69-.61-1.15-1.37-1.29-1.61-.13-.25-.01-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.53-1.28-.72-1.74z" />
    </svg>
  );
}

/** Botón de contacto por WhatsApp, en el verde de la marca. */
export function BotonWhatsappEnlace({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-display inline-flex h-9 items-center gap-2 rounded-md bg-[#25D366] px-3.5 text-[0.88rem] font-semibold text-[#06251A] transition-opacity hover:opacity-90 ${className ?? ""}`}
    >
      <IconoWhatsapp className="h-[1.05rem] w-[1.05rem]" />
      {children}
    </a>
  );
}
