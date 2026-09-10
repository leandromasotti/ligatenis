-- ============================================================================
-- Liga Dolorense de Tenis · datos iniciales
-- Sprint 1 · Dev B
-- ----------------------------------------------------------------------------
-- Clubes, cuadros y temporada. Todo esto es administrable desde el panel: acá
-- solo se deja el arranque para no partir de una base vacía.
--
-- CONFIRMADO POR LA ORGANIZACIÓN:
--   * el ranking se calcula con los puntos de los torneos
--   * dobles no lleva ranking propio en esta versión: se juega por torneo, así que
--     solo se cargan los cuadros de singles
--
-- PENDIENTE DE CONFIRMAR:
--   * en caballeros no hay Primera (planilla oficial 2024): quedó inactiva
--   * la lista de cuadros de damas, que sigue sin planilla
--   * cuántos puntos da cada instancia de un torneo
--   * la localidad de cada sede
-- ============================================================================

-- ---------------------------------------------------------------------- clubes
insert into public.clubes (slug, nombre, localidad, es_sede, orden) values
  ('sarmiento',              'Club Sarmiento',            'Dolores', true, 1),
  ('ever-ready',             'Club Atlético Ever Ready',  'Dolores', true, 2),
  ('club-social',            'Club Social',               'Dolores', true, 3),
  ('polideportivo-municipal', 'Polideportivo Municipal',  'Dolores', true, 4),
  ('naytuel',                'Naytuel',                   'Dolores', true, 5)
on conflict (slug) do nothing;

-- ------------------------------------------------------------------- categorías
-- Se cargan los doce cuadros de singles. Quedan activos los que tienen actividad
-- publicada (torneos 2025/2026 de la prensa local y el Facebook de la liga); el
-- resto espera confirmación. El sitio público muestra solo los activos, así que
-- sumar un cuadro es:
--   update public.categorias set activa = true where slug = '2da-damas';
insert into public.categorias (slug, nivel, genero, modalidad, nombre, orden, activa) values
  ('intermedia-caballeros',  'Intermedia',  'caballeros', 'singles', 'Intermedia Caballeros',  1,  true),
  -- Inactiva: la planilla oficial 2024 de la liga no tiene Primera en caballeros.
  ('1ra-caballeros',         '1ra',         'caballeros', 'singles', '1ra Caballeros',         2,  false),
  ('2da-caballeros',         '2da',         'caballeros', 'singles', '2da Caballeros',         3,  true),
  ('3ra-caballeros',         '3ra',         'caballeros', 'singles', '3ra Caballeros',         4,  true),
  ('4ta-caballeros',         '4ta',         'caballeros', 'singles', '4ta Caballeros',         5,  true),
  ('5ta-caballeros',         '5ta',         'caballeros', 'singles', '5ta Caballeros',         6,  true),
  ('1ra-damas',              '1ra',         'damas',      'singles', '1ra Damas',              7,  true),
  ('4ta-damas',              '4ta',         'damas',      'singles', '4ta Damas',              8,  true),
  ('2da-damas',              '2da',         'damas',      'singles', '2da Damas',              9,  false),
  ('3ra-damas',              '3ra',         'damas',      'singles', '3ra Damas',              10, false),
  ('5ta-damas',              '5ta',         'damas',      'singles', '5ta Damas',              11, false),
  ('intermedia-damas',       'Intermedia',  'damas',      'singles', 'Intermedia Damas',       12, false)
on conflict (slug) do nothing;

-- ------------------------------------------------------------------- temporada
insert into public.temporadas (nombre, desde, hasta, activa) values
  ('Temporada 2026', '2026-03-01', '2026-11-30', true)
on conflict (nombre) do nothing;
