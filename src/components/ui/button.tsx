import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primaria" | "secundaria" | "sutil";
type Tamano = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

const variantes: Record<Variante, string> = {
  primaria: "bg-verde text-verde-contrast hover:bg-verde-hover",
  secundaria: "border border-line-strong text-foreground hover:bg-surface-2",
  sutil: "text-celeste hover:text-celeste-hover hover:underline",
};

const tamanos: Record<Tamano, string> = {
  md: "h-10 px-4 text-[0.9rem]",
  sm: "h-8 px-3 text-[0.82rem]",
};

function clases(variante: Variante, tamano: Tamano, extra?: string) {
  const padding = variante === "sutil" ? "" : tamanos[tamano];
  return [base, variantes[variante], padding, extra].filter(Boolean).join(" ");
}

type BotonProps = {
  children: ReactNode;
  variante?: Variante;
  tamano?: Tamano;
  className?: string;
};

export function BotonLink({
  href,
  children,
  variante = "primaria",
  tamano = "md",
  className,
  ...rest
}: BotonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={clases(variante, tamano, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Boton({
  children,
  variante = "primaria",
  tamano = "md",
  className,
  ...rest
}: BotonProps & ComponentProps<"button">) {
  return (
    <button className={clases(variante, tamano, className)} {...rest}>
      {children}
    </button>
  );
}
