"use client";

import { useTheme } from "next-themes";

/**
 * Los dos iconos se renderizan siempre y el que se ve lo decide la clase `dark`
 * del <html>. Así no hace falta esperar a que monte el componente para saber el
 * tema, y el HTML del servidor y el del cliente coinciden.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Cambiar entre tema claro y oscuro"
      title="Cambiar tema"
      className="border-line hover:border-line-strong hover:bg-surface-2 text-foreground-muted grid h-9 w-9 place-items-center rounded-md border transition-colors"
    >
      {/* Sol: visible en tema oscuro, porque el clic lleva al claro. */}
      <svg viewBox="0 0 24 24" className="hidden h-[1.05rem] w-[1.05rem] dark:block">
        <circle cx="12" cy="12" r="4.2" className="fill-amarillo" />
        <path
          d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {/* Luna: visible en tema claro. */}
      <svg viewBox="0 0 24 24" className="block h-[1.05rem] w-[1.05rem] dark:hidden">
        <path
          d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}
