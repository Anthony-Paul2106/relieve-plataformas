# SEO y medición

## Configuración preparada

- Metadata de Next.js con título y descripción aprobados, `lang="es"`,
  directivas de indexación y etiquetas Open Graph/Twitter.
- La imagen social usa el Hero existente:
  `/images/hero/hero-plataformas.webp`.
- `app/sitemap.ts` publica la portada cuando se configure el dominio.
- `app/robots.ts` permite rastrear la landing y excluye `/api/`.
- Schema.org `Service` usa solo servicio, marca y zona Arequipa, datos que ya
  aparecen en el contenido del proyecto.
- GA4 carga una sola vez si existe un ID válido. `generate_lead` se emite tras
  la confirmación de la API y solo envía `form_name: "contact"`.
- Search Console añadirá la meta etiqueta solo cuando exista un token real.

## Dominio y URL canónica

El dominio público no está confirmado, así que la metadata omite las URL
canónicas y absolutas hasta configurarlo. Añadir al entorno privado de
producción cuando el cliente confirme el dominio:

```dotenv
SITE_URL=https://dominio-confirmado
```

Esto habilita la URL canónica, las URL absolutas Open Graph/Twitter, el sitemap
con la portada y la referencia al sitemap en robots.txt. No usar un dominio de
ejemplo.

## Google Analytics 4

Crear una propiedad web GA4 y configurar el ID real (formato `G-…`) en el
entorno de compilación/producción:

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ID_REAL
```

No hay ID configurado actualmente. Tras añadirlo, reiniciar o recompilar la
aplicación. Sin el ID no se carga Analytics ni se emite el evento de conversión.
El evento no lleva nombre, teléfono, correo ni descripción del proyecto.

## Google Search Console

Crear una propiedad de dominio o prefijo URL y obtener el token de “Etiqueta
HTML”. Configurarlo en el entorno privado del servidor:

```dotenv
GOOGLE_SITE_VERIFICATION=TOKEN_REAL_DE_SEARCH_CONSOLE
```

La verificación se incorpora al `<head>` desde metadata de Next.js. Después de
desplegar al dominio confirmado, completar la verificación y enviar
`https://dominio-confirmado/sitemap.xml`.

## Verificación manual

1. Revisar el HTML generado: un solo `<h1>`, title, descripción, idioma español
   y JSON-LD.
2. Con `SITE_URL`, abrir `/robots.txt` y `/sitemap.xml` y confirmar que usan el
   dominio real.
3. Con el ID GA4, revisar Network/Tag Assistant y GA4 DebugView/Realtime. Debe
   haber una instancia y un `generate_lead` tras el éxito del formulario.
4. Confirmar que los parámetros de Analytics no contienen datos personales.
5. Usar la inspección de URL de Search Console después de verificar el sitio.

No hay páginas de prueba o rutas privadas adicionales en la landing actual;
`/api/` queda excluido del rastreo.
