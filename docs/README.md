# Documentos del proyecto

| PDF                                                                          | Qué es                                                             |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Liga-Dolorense-Planificacion-MVP.pdf](Liga-Dolorense-Planificacion-MVP.pdf) | Alcance, stack, modelo de datos, épicas, sprints y riesgos del MVP |
| [Liga-Dolorense-Despues-del-MVP.pdf](Liga-Dolorense-Despues-del-MVP.pdf)     | Propuestas de mejoras y productos publicitarios. Nada comprometido |

Los dos están publicados también como páginas web, con el mismo contenido:

- Planificación — https://claude.ai/code/artifact/39452c9d-46da-40d0-b2da-2b5a86eeb1be
- Después del MVP — https://claude.ai/code/artifact/14a3c077-5748-4afd-93e3-5ef9863837be

## Regenerar los PDF

Las fuentes son los HTML de [`fuentes/`](fuentes/). Editar el HTML y volver a generar:

```bash
cd docs/fuentes

# 1. Envolver el HTML en un documento con estilos de impresión
node armar-imprimible.js planificacion-mvp.html /tmp/print.html

# 2. Imprimir con Chrome en modo headless
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="../Liga-Dolorense-Planificacion-MVP.pdf" \
  "file:///tmp/print.html"
```

`armar-imprimible.js` existe porque los HTML de origen no traen `<!doctype>` ni `<head>`
—los agrega la plataforma al publicarlos— y sin eso Chrome imprime con ancho de pantalla y
recorta las tablas. El script agrega el envoltorio y una hoja de estilos de impresión: A4,
tablas completas en lugar de scroll horizontal, una sola columna donde en pantalla hay dos,
y nada que se corte por la mitad entre páginas.

Para revisar cómo va a salir sin generar el PDF, se reemplaza `@media print` por
`@media all` en el imprimible y se abre en el navegador con la ventana en 703 px de ancho,
que es el ancho útil de una A4 con estos márgenes.
