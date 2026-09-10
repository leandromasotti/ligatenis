import type { Metadata, Viewport } from "next";
import { Archivo, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { BotonWhatsapp } from "@/components/boton-whatsapp";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { urlDelSitio } from "@/lib/sitio";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(urlDelSitio()),
  title: {
    default: "Liga Dolorense de Tenis",
    template: "%s · Liga Dolorense de Tenis",
  },
  description:
    "Categorías por nivel en damas y caballeros, ranking, tenistas y equipo técnico de la Liga Dolorense de Tenis, en Dolores y la zona.",
  openGraph: {
    title: "Liga Dolorense de Tenis",
    description: "Categorías, ranking y tenistas de la liga, en Dolores y la zona.",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1310" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${archivo.variable} ${sourceSans.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a
            href="#contenido"
            className="bg-verde text-verde-contrast sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-2"
          >
            Saltar al contenido
          </a>
          <SiteHeader />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <BotonWhatsapp />
        </ThemeProvider>
      </body>
    </html>
  );
}
