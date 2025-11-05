# Construcción del proyecto ApiProject

Este documento describe cómo fue construido el proyecto `ApiProject` (Angular), las decisiones de arquitectura, estructura de carpetas, cómo correrlo localmente y recomendaciones de mantenimiento.

## Resumen rápido
- Framework: Angular CLI (Angular v20)
- Proyecto generado con Angular CLI v20.3.8
- Estructura principal: aplicación standalone con componentes dentro de `src/app`.
- Objetivo del documento: dejar constancia de la estructura, componentes clave, cómo levantar el proyecto, decisiones de diseño y próximos pasos.

---

## Entorno y dependencias
- Node.js (recomendado: 18+ LTS). Verifica con `node -v`.
- npm (o pnpm/yarn) para instalar dependencias. Verifica con `npm -v`.
- Angular CLI (se generó con la versión 20.3.8). No es obligatorio instalar globalmente pero se puede usar `npx` o `npm run`.

Comandos importantes:

- Instalar dependencias:

  ```powershell
  npm install
  ```

- Ejecutar servidor de desarrollo (dev server):

  ```powershell
  ng serve
  # o, si prefieres usar el script package.json:
  npm start
  ```

- Compilar para producción:

  ```powershell
  ng build
  ```

- Ejecutar tests (si están configurados):

  ```powershell
  ng test
  ```

---

## Estructura del proyecto (resumen relevante)
- `angular.json` — Configuración del proyecto y entradas de build/serve.
- `package.json` — Scripts y dependencias.
- `src/` — Código fuente de la aplicación.
  - `main.ts`, `main.server.ts`, `server.ts` — puntos de entrada.
  - `index.html` — HTML raíz.
  - `styles.scss` — estilos globales (si se usa).
  - `app/` — carpeta principal de la app:
    - `app.html` — plantilla de la app principal (contiene el layout placeholder y el grupo de "pills").
    - `app.ts` / `app.routes.ts` — configuración y rutas.
    - `core/models/` — modelos (ej. `ciudad.model.ts`).
    - `features/home/` — componente Home:
      - `home.ts` — `HomeComponent` (standalone) que contiene la lógica y la plantilla inline.
      - `home.spec.ts` — tests (si los hay).

> Nota: Algunas plantillas usan sintaxis placeholder tipo `@for` / `@if` en versiones de ejemplo; en el componente `home.ts` se corrigió y adaptó a `*ngFor` y `*ngIf` de Angular.

---

## Archivos y decisiones clave
### `src/app/features/home/home.ts`
- Actualmente es un componente `standalone: true` que importa `CommonModule` (necesario para directivas como `ngFor`/`ngClass`).
- Contiene una tarjeta principal con listado de `ciudades` (tipo `Ciudad` desde `core/models/ciudad.model.ts`).
- Se aplicaron estilos embebidos (inline `styles`) para mantener los estilos locales aislados del layout principal.
- Observación: si el proyecto crece, conviene mover estilos a archivos SCSS separados o a un `shared` style para reutilización.

### `src/app/app.html`
- Contiene la estructura placeholder del proyecto (logo, agrupación de enlaces/recomendaciones en `pill-group`, y `social-links`).
- Usa variables CSS modernas (oklch, color-mix, gradientes) para un look moderno. Ten en cuenta compatibilidad si apuntas a navegadores antiguos.
- Durante el trabajo reciente se hicieron cambios visuales para centrar contenidos; posteriormente se restableció el layout original porque el usuario prefirió el diseño anterior.

---

## Cómo se construyó (pasos y decisiones)
1. Creación inicial con Angular CLI (generación del scaffold estándar).
2. Organización por características (feature folders): por ahora sólo `home` dentro de `features/`.
3. Uso de componentes standalone para simplicidad y menor necesidad de NgModules en una app pequeña; permite imports directos en la metadata del componente.
4. Tipado estricto en modelos: `core/models/ciudad.model.ts` mantiene la interfaz `Ciudad` para tipar los datos.
5. Estilos: mezcla de estilos globales en `app.html` (variables y layout) y estilos locales en componentes (inline `styles`). Decisión temporal para rapidez; extraer a SCSS recomendado.
6. Compatibilidad: se emplearon propiedades CSS modernas (oklch, color-mix). Si necesitas compatibilidad amplia (IE/Edge Legacy), habrá que adaptar.

---

## Recomendaciones y próximos pasos
- Extraer estilos globales y variables a `src/styles.scss` o a `src/app/styles/_variables.scss` para mantener consistencia.
- Convertir estilos inline en `home.ts` a archivos `home.component.scss` si prefieres separar presentación/lógica.
- Crear un archivo `CONTRIBUTING.md` con guías básicas (formatos de commit, linters y pruebas)
- Añadir linters y pre-commit hooks (ESLint, stylelint, Husky) para mantener calidad.
- Añadir tests (unitarios y e2e) si la app va a crecer.
- Revisar compatibilidad de CSS moderno y reemplazar `color-mix` / `oklch` por alternativas si se necesita soporte amplio.

---

## Resumen de comandos útiles (PowerShell / Windows)
```powershell
# instalar dependencias
npm install

# levantar dev server
ng serve
# o npm start (si package.json lo mapea)
npm start

# build producción
ng build --configuration production

# ejecutar tests
ng test
```

---

## Cambios recientes (nota de la sesión)
- Se mejoró el `HomeComponent` para usar `*ngFor` y `*ngIf` y se aplicaron estilos para centrar su tarjeta. Esa mejora se mantuvo.
- Se hicieron cambios temporales a `app.html` para centrar el layout y modificar el aspecto de las "pills"; luego el usuario solicitó restaurarlo al diseño anterior y se revirtió la mayor parte de esos cambios.

---

Si quieres, puedo:
- Generar un `CONTRIBUTING.md` y un `CHANGELOG.md` con un resumen de cambios.
- Extraer los estilos modernos a un archivo SCSS y convertir variables CSS a una versión más compatible.
- Crear una rama con estos cambios y abrir un PR con el documento y las recomendaciones.

Dime qué prefieres que haga ahora y lo aplico.
