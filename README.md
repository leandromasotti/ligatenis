# Liga Dolorense de Tenis

Aplicación web de la liga: cuadros por nivel (1ra a 5ta e Intermedia) en damas y
caballeros, ranking por categoría, perfiles cargados por los propios tenistas, equipo
técnico y espacios publicitarios. Todo en español, con tema claro y oscuro.

La liga es regional: además de Dolores llegan tenistas de Castelli, Pila, Chascomús y la
zona, y se juega en Club Sarmiento, Club Atlético Ever Ready, Club Social, Polideportivo
Municipal y Naytuel.

### Datos provisorios

Mientras no haya padrón cargado, el sitio muestra nombres y campeones tomados de la prensa
local y del Facebook de la liga. Viven en un solo archivo,
[`src/lib/datos-liga.ts`](src/lib/datos-liga.ts), con las fuentes citadas, y se muestran
siempre con el cartel **Datos provisorios**. No hay puntos ni posiciones inventados, ni
datos deportivos atribuidos a nadie: las fuentes no los publican, y son personas reales.
Las fichas muestran esos campos vacíos hasta que cada tenista los cargue.

### Reglas confirmadas por la organización

- **El ranking se calcula con los puntos de los torneos**, no con una liga corrida por
  temporada. En el MVP las posiciones se cargan del Excel; el cálculo llega en la fase 2.
- **Dobles no lleva ranking propio** en esta versión: se juega por torneo. El modelo
  distingue singles de dobles, así que abrir esos cuadros más adelante no obliga a migrar.

Pendiente de confirmar: la lista definitiva de categorías (hay cuatro cuadros de damas
cargados como inactivos), cuántos puntos da cada instancia de un torneo, y la localidad de
cada sede.

## Stack

| Capa            | Herramienta                                       |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router) + React 19 + TypeScript   |
| Estilos         | Tailwind CSS v4 (tokens en `src/app/globals.css`) |
| Tema claro/osc. | next-themes (clase `dark` en `<html>`)            |
| Datos y auth    | Supabase (Postgres + Auth + Storage con RLS)      |
| Validación      | Zod                                               |
| Formato y lint  | Prettier + ESLint (`eslint-config-next`)          |

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar con los datos del proyecto de Supabase
npm run dev                  # http://localhost:3000
```

El sitio público arranca sin Supabase configurado: las páginas de este sprint no
consultan la base todavía.

### Base de datos

Las migraciones están en `supabase/migrations/`, numeradas y para aplicar en orden.
Se pueden pegar en el **SQL Editor** del proyecto de Supabase o correr con la CLI:

```bash
npx supabase link --project-ref <ref-del-proyecto>
npx supabase db push
```

| Migración          | Qué crea                                                              |
| ------------------ | --------------------------------------------------------------------- |
| `0001_schema.sql`  | Tablas, tipos, triggers y el alta automática de perfil al registrarse |
| `0002_rls.sql`     | Row Level Security, permisos por columna y funciones de admin         |
| `0003_seed.sql`    | Las cinco sedes, los doce cuadros de singles y la temporada 2026      |
| `0004_storage.sql` | Buckets `fotos-perfil`, `equipo` y `anuncios` con sus políticas       |
| `0005_torneos.sql` | Torneos, sus estados y los campeones por cuadro                       |

Después de aplicarlas, para tener el primer administrador hay que registrarse en la
app y ejecutar una vez, desde el SQL Editor:

```sql
update public.profiles set rol = 'admin', estado = 'aprobado' where id = '<uuid-del-usuario>';
```

De ahí en adelante los roles se cambian con `select public.admin_cambiar_rol(...)`.

### Tipos de la base

Cuando el proyecto de Supabase esté creado, conviene generar los tipos:

```bash
npx supabase gen types typescript --project-id <ref> --schema public > src/lib/supabase/database.types.ts
```

## Scripts

| Comando                | Qué hace                          |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Servidor de desarrollo            |
| `npm run build`        | Build de producción               |
| `npm run start`        | Sirve el build                    |
| `npm run lint`         | ESLint                            |
| `npm run typecheck`    | `tsc --noEmit`                    |
| `npm run format`       | Prettier sobre todo el repo       |
| `npm run format:check` | Verifica formato (lo corre el CI) |

## Estructura

```
src/
  app/                      rutas (App Router)
    globals.css             ← paleta, tokens y tema oscuro: se edita acá y en ningún otro lugar
    categorias/[slug]/      un cuadro de categoría, con su padrón
    jugadores/[slug]/       ficha pública del tenista
    torneos/                torneos por estado y sus campeones
    ranking/                campeones y padrón por categoría
    sponsors/               sponsors, medidas y espacios disponibles
    equipo-tecnico/  ingresar/  registrarme/
  components/
    logo.tsx                isotipo de la raqueta y el logotipo con el nombre
    site-header.tsx         cabecera con navegación, tema y accesos de cuenta
    ad-slot.tsx             espacios publicitarios (medidas IAB y reparto)
    sponsors.tsx            tira de apoyo del pie
    padron.tsx              listado de tenistas con buscador
    jugador.tsx             avatar de iniciales, insignia de campeón
    seccion.tsx             contenedor de sección, título y avisos
    ui/button.tsx           botones y botones-link
  lib/
    categorias.ts           los cuadros: fuente de verdad de la navegación
    datos-liga.ts           datos publicados de la liga, con sus fuentes
    datos/                  capa de datos (ver más abajo)
    supabase/               clientes de navegador y de servidor
supabase/migrations/        esquema, RLS, datos fijos y storage
```

## Sistema de diseño

Los colores se definen una sola vez en `src/app/globals.css`: `:root` para el tema claro,
`.dark` para el oscuro, y `@theme inline` los expone como utilidades de Tailwind. Los
componentes usan nombres semánticos (`bg-surface`, `text-verde`, `border-line`) y nunca
un hex suelto, así que cambiar la paleta de la liga es editar ese archivo.

| Token                    | Claro                 | Oscuro                | Uso                         |
| ------------------------ | --------------------- | --------------------- | --------------------------- |
| `background` / `surface` | `#ffffff` / `#f7faf8` | `#0b1310` / `#121d18` | fondos                      |
| `verde`                  | `#157a4a`             | `#5cc98c`             | color principal de la liga  |
| `celeste`                | `#0d7391`             | `#63c6e2`             | enlaces y datos secundarios |
| `amarillo`               | `#f2c200`             | `#f5ce3a`             | acentos, avisos, la pelota  |

Tipografías: **Archivo** para títulos (`font-display`) y **Source Sans 3** para el texto,
cargadas con `next/font`.

## Capa de datos

Todas las pantallas leen de [`src/lib/datos/`](src/lib/datos/), nunca de un archivo de
datos directamente. Las funciones ya son asincrónicas, así que pasar a Supabase es
reescribir el cuerpo de [`src/lib/datos/index.ts`](src/lib/datos/index.ts) con consultas y
borrar `mock.ts`: ninguna página cambia.

```
src/lib/datos/
  index.ts      ← la única puerta de entrada; acá se reemplaza el mock por Supabase
  tipos.ts      Tenista, MiembroEquipo (espejo de las tablas)
  mock.ts       datos de hoy, derivados de datos-liga.ts
  anuncios.ts   sponsors, medidas de los espacios y reparto por ubicación
```

## Publicidad

Cuatro ubicaciones con medidas IAB y **rotación por ubicación**: cada combinación de
espacio y página recibe siempre el mismo sponsor, ponderado por peso. Es reparto estable y
no por visita, porque las páginas se generan estáticas y un anuncio al azar quedaría
congelado en el build; rotar en cada carga exige volver la página dinámica.

Los espacios "disponible" solo aparecen en los formatos grandes (cabecera y pie): la
ubicación que es el único aviso de una página nunca se gasta en una invitación. Los
anunciantes se editan en [`src/lib/datos/anuncios.ts`](src/lib/datos/anuncios.ts) y en el
sprint 5 pasan a la tabla `anuncios`.

Los banners son **logotipos de texto**: nombre del anunciante, bajada, dominio, un ícono
dibujado para este sitio ([`marca-icono.tsx`](src/components/marca-icono.tsx)) y los colores
del aviso, que son del anunciante y no salen de los tokens del sitio. Ninguno reproduce el
logo de la marca. Cuando el sponsor manda su imagen se carga en `imagenUrl` y reemplaza al
logotipo.

### Marcas de muestra — leer antes de publicar

Varios anunciantes están marcados con `demo: true`: son **marcas reales con las que la liga
todavía no tiene acuerdo**, puestas para que el sitio se vea como se va a ver en producción.
Publicarlos afirmaría un patrocinio que no existe.

```ts
// src/lib/datos/anuncios.ts
const INCLUIR_DEMO = false; // ← antes de publicar
```

Con el switch en `false` quedan solo los sponsors reales y los espacios a la venta. Sponsor
real cargado hoy: **4x · Desarrollo de software**.

## Torneos

La liga se juega por torneos y de ahí van a salir los puntos del ranking. El modelo es
deliberadamente simple: cada torneo tiene **modalidad** (singles o dobles), un **estado**
que mueve el admin — `en_camino` → `en_progreso` → `terminado` — y un **periodo** de texto
libre ("Abril 2026") en lugar de fechas, porque así los anuncia la liga y no hay nada que
calcular.

Al terminar, el admin carga los campeones por cuadro en `torneo_resultados`: un nombre en
singles, dos en dobles. Se guardan **por nombre** y opcionalmente por `profile_id`, así se
puede publicar el resultado de alguien que todavía no se registró y enlazar su ficha cuando
lo haga.

Los dos torneos terminados que están cargados son los publicados por la prensa local. Los
que aparecen en juego y en camino son de muestra, marcados como provisorios, para que se
vean los tres estados.

## Contacto

Botón flotante de WhatsApp abajo a la derecha en todas las páginas, más enlaces en el pie y
un CTA propio en `/sponsors`. El número de la liga es **+54 9 2241 68-8446** y está en
[`src/lib/contacto.ts`](src/lib/contacto.ts), junto con el mensaje que va pre-cargado en el
chat. Si se deja vacío, el botón no se dibuja.

## Documentos del proyecto

En [`docs/`](docs/) están los dos documentos en PDF, listos para reenviar, con sus fuentes y
las instrucciones para regenerarlos:

- **Planificación y estimación del MVP** — alcance, stack, modelo de datos, épicas, sprints
  y riesgos. [PDF](docs/Liga-Dolorense-Planificacion-MVP.pdf) ·
  [web](https://claude.ai/code/artifact/39452c9d-46da-40d0-b2da-2b5a86eeb1be)
- **Después del MVP** — propuestas de mejoras y productos publicitarios, nada comprometido.
  [PDF](docs/Liga-Dolorense-Despues-del-MVP.pdf) ·
  [web](https://claude.ai/code/artifact/14a3c077-5748-4afd-93e3-5ef9863837be)

## Estado

| Sprint                              | Estado                                          |
| ----------------------------------- | ----------------------------------------------- |
| **1** · Fundaciones                 | Terminado                                       |
| **2** · Cuentas y perfil            | Pendiente — necesita el proyecto de Supabase    |
| **3** · Sitio público               | Terminado con datos mock                        |
| **4** · Ranking e import de Excel   | Pendiente — necesita el Excel de la liga        |
| **5** · Admin y publicidad          | Publicidad hecha; el panel necesita auth y base |
| **6** · Tests, legales, lanzamiento | Pendiente                                       |

Lo que el sprint 3 dejó andando: listado de cuadros con cantidad de tenistas y campeón,
padrón por categoría con buscador, ficha pública de cada tenista con sus estados vacíos, y
equipo técnico. Lo del sprint 5: los avisos reales con enlace, el reparto entre
ubicaciones, la página `/sponsors` con medidas y la tira de apoyo en el pie.

Falta del sprint 5, y depende de la base: el CRUD del panel, la vigencia desde/hasta y el
conteo de impresiones y clics.
