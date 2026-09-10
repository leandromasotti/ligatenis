/**
 * Envuelve el HTML de un artifact en un documento completo, listo para imprimir a
 * PDF. El artifact no trae doctype ni <head> porque los agrega la plataforma al
 * publicarlo, y sin eso Chrome imprime con el ancho de pantalla y recorta.
 *
 *   node armar-imprimible.js entrada.html salida.html
 */
const fs = require("fs");

const [, , entrada, salida] = process.argv;
if (!entrada || !salida) {
  console.error("uso: node armar-imprimible.js entrada.html salida.html");
  process.exit(1);
}

const contenido = fs.readFileSync(entrada, "utf8");
const titulo = (contenido.match(/<title>([^<]*)<\/title>/) || [, "Documento"])[1];

// El artifact es: <title>, <link>, <style>… y después el cuerpo, que en estos
// documentos arranca en <header class="top">. Ahí se corta.
const corte = contenido.search(/<header\b/);
if (corte < 0) {
  console.error("no se encontró el <header> que separa cabecera de cuerpo");
  process.exit(1);
}

const cabecera = contenido.slice(0, corte).replace(/<title>[^<]*<\/title>\s*/, "");
const cuerpo = contenido.slice(corte);

const estilosImpresion = `<style>
  @page { size: A4; margin: 13mm 12mm; }
  @media print {
    :root { --maxw: 100%; }
    html, body { background: #FFFFFF !important; }
    .wrap { max-width: 100% !important; padding: 0 !important; }
    body { font-size: 10.2pt; line-height: 1.5; }
    h1 { font-size: 24pt; }
    h2 { font-size: 14pt; }
    h3 { font-size: 11pt; }

    /* Las tablas se muestran completas: en pantalla scrollean, en papel no pueden. */
    .tbl-scroll { overflow: visible !important; box-shadow: none !important; }
    table { min-width: 0 !important; font-size: 8.8pt; }
    tbody td, thead th, tfoot td { padding: .38rem .5rem; }

    /* Dos columnas en A4 quedan angostas: en papel va todo en una. */
    .grid2 { display: block !important; }
    .grid2 > * + * { margin-top: 1.1rem; }
    .paquetes { grid-template-columns: 1fr 1fr !important; }

    /* Nada se corta por la mitad. */
    tr, .paq, .note, .epic, .sprint, .fact, .checks li, .sw { break-inside: avoid; }
    .tbl-scroll, .epics, .paquetes { break-inside: auto; }
    h1, h2, h3, .sec-head { break-after: avoid; }
    section { padding-top: 9mm; }
    header.top { border-bottom-width: 2px; }
    footer { break-before: avoid; }

    main { padding-bottom: 0; }
    a { text-decoration: none; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>`;

const documento = `<!doctype html>
<html lang="es" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<style>html{color-scheme:light}body{margin:0}img{max-width:100%}</style>
${cabecera}
${estilosImpresion}
</head>
<body>
${cuerpo}
</body>
</html>
`;

fs.writeFileSync(salida, documento);
console.log(`${salida} · ${(documento.length / 1024).toFixed(0)} KB · "${titulo}"`);
