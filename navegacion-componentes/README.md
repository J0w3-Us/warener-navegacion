# 🧮 Navegación y Componentes Angular

Un proyecto educativo y funcional desarrollado con **Angular 20** que demuestra conceptos fundamentales del framework: navegación por rutas, componentes reutilizables, directivas incorporadas, ciclo de vida de componentes y una calculadora web interactiva con diseño moderno y accesible.

## 🎯 Descripción del Proyecto

Este proyecto sirve como una aplicación de demostración completa que cubre:

- **Navegación entre componentes** usando Angular Router
- **Componentes reutilizables** con `@Input()` properties y tipado TypeScript
- **Directivas incorporadas** de Angular (`@if`, `@for`, `@switch`, `ngStyle`, `ngClass`)
- **Ciclo de vida de componentes** con hooks completos (OnInit, OnDestroy, etc.)
- **Calculadora funcional** con operaciones básicas y diseño responsivo
- **Sistema de estilos consistente** con paleta suave y variables SCSS compartidas

## 🏗️ Arquitectura del Proyecto

### Estructura de Componentes

```
src/app/
├── app.routes.ts          # Configuración de rutas
├── app.config.ts          # Configuración de la aplicación
├── home/                  # Página principal con navegación
├── directiva/             # Información sobre directivas
├── directiva-incorporada/ # Ejemplos de directivas built-in
├── mi-boton/              # Componente de botón reutilizable
├── card/                  # Componente de tarjeta reutilizable
└── suma/                  # Calculadora interactiva
```

### Sistema de Rutas

El proyecto utiliza **Angular Standalone Components** con las siguientes rutas:

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'directivas/incorporadas', component: DirectivaIncorporadaComponent },
  { path: 'suma/:primerNumero/:segundoNumero', component: SumaComponent },
  { path: 'suma', component: SumaComponent },
];
```

## 🎨 Sistema de Estilos y Temas

### Paleta de Colores

El proyecto implementa un **sistema de diseño suave y no chillón** basado en variables SCSS:

```scss
// src/styles/_theme.scss
$bg: #fbfbfc; // Fondo principal
$surface: #ffffff; // Superficies de tarjetas
$muted-surface: #f3f6f9; // Fondos secundarios
$display-bg: #f1f5f9; // Fondo de display
$text: #102a43; // Texto principal
$text-muted: #4b6475; // Texto secundario
$accent: #6aa89a; // Color de acento (verde suave)
$accent-dark: #3b8f80; // Acento oscuro
```

### Variables CSS Globales

```css
:root {
  --bg: #fbfbfc;
  --surface: #ffffff;
  --accent: #6aa89a;
  --text: #102a43;
  /* ... más variables */
}
```

### Mixins Reutilizables

```scss
@mixin card-base {
  background: $surface;
  color: $text;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(16, 42, 67, 0.06);
}
```

## 📦 Componentes Principales

### 1. HomeComponent (`/`)

**Página de bienvenida y navegación principal**

- Muestra información sobre Angular y el proyecto
- Banner con imagen de fondo y overlay suave
- Navegación a todos los componentes
- Demostración de componentes `Card` y `MiBoton`

**Características:**

- Responsive design
- Integración con `CardComponent` para mostrar información modular
- Botones de navegación hacia otras secciones

### 2. SumaComponent (`/suma` o `/suma/:a/:b`)

**Calculadora interactiva con funcionalidad completa**

- Operaciones básicas: suma, resta, multiplicación, división
- Manejo de decimales y validación de entrada
- Compatibilidad con parámetros de URL para cálculos iniciales
- Diseño tipo calculadora con rejilla de botones

**Funcionalidades técnicas:**

```typescript
// Métodos principales
pressDigit(d: string)     // Entrada de números
setOperator(op: string)   // Operadores matemáticos
calculate()               // Ejecutar operación
clear()                   // Limpiar pantalla
backspace()               // Borrar último carácter
```

**Estado interno:**

```typescript
display: string = '0';           // Pantalla visible
private firstValue: number | null = null;
private operator: string | null = null;
private waitingForSecond = false;
```

### 3. CardComponent

**Componente reutilizable para mostrar información estructurada**

```typescript
@Input() titulo: string = 'Título por Defecto';
@Input() descripcion: string = 'Descripción por defecto';
@Input() pie: string = 'Pie de página por defecto';
```

**Uso:**

```html
<app-card
  [titulo]="'CONTRATOS API'"
  [descripcion]="'Los componentes reutilizables...'"
  [pie]="'Sección: Tipado'"
>
</app-card>
```

### 4. MiBotonComponent

**Botón de navegación con ciclo de vida completo**

- Implementa **todos los hooks del ciclo de vida** de Angular
- Logging detallado para propósitos educativos
- Navegación por `routerLink`

**Hooks implementados:**

```typescript
ngOnChanges,
  ngOnInit,
  ngDoCheck,
  ngAfterContentInit,
  ngAfterContentChecked,
  ngAfterViewInit,
  ngAfterViewChecked,
  ngOnDestroy;
```

### 5. DirectivaComponent y DirectivaIncorporadaComponent

**Documentación y ejemplos de directivas Angular**

- Explicación teórica de las directivas
- Ejemplos prácticos de directivas incorporadas:
  - `@if` - Renderizado condicional
  - `@for` - Iteración de listas
  - `@switch` - Condicionales múltiples
  - `ngStyle` - Estilos dinámicos
  - `ngClass` - Clases CSS dinámicas

## 🛠️ Instalación y Configuración

### Requisitos Previos

- **Node.js** 18+
- **npm** o **pnpm** o **yarn**
- **Angular CLI** 20+

### Instalación

1. **Clonar el repositorio:**

```bash
git clone <url-del-repositorio>
cd navegacion-componentes
```

2. **Instalar dependencias:**

```bash
npm install
# o
pnpm install
# o
yarn install
```

3. **Instalar Angular CLI globalmente (si no está instalado):**

```bash
npm install -g @angular/cli
```

### Scripts Disponibles

```json
{
  "start": "ng serve", // Servidor de desarrollo
  "build": "ng build", // Construcción de producción
  "watch": "ng build --watch", // Construcción en modo observación
  "test": "ng test", // Pruebas unitarias
  "lint": "ng lint" // Análisis estático de código
}
```

## 🚀 Desarrollo

### Servidor de Desarrollo

```bash
npm start
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente al modificar archivos.

### Construcción para Producción

```bash
npm run build
```

Los artefactos se almacenan en `dist/`. La construcción está optimizada para rendimiento.

### Verificación de Tipos

```bash
npx tsc --noEmit
```

## 🧪 Testing

### Pruebas Unitarias

```bash
npm test
```

Ejecuta las pruebas usando **Karma** y **Jasmine**.

### Análisis de Código

```bash
npm run lint
```

Utiliza **ESLint** con configuración específica para Angular.

## 📱 Responsive Design

El proyecto está completamente optimizado para dispositivos móviles:

- **Calculadora:** Adaptable hasta pantallas de 380px
- **Tarjetas:** Layout flexible con `inline-block`
- **Navegación:** Botones responsivos
- **Tipografía:** Escalado apropiado para diferentes tamaños

### Breakpoints CSS

```scss
@media (max-width: 380px) {
  .calculator {
    width: 100%;
  }
}
```

## 🎨 Personalización de Estilos

### Cambiar la Paleta de Colores

1. **Editar variables SCSS:**

```scss
// src/styles/_theme.scss
$accent: #nuevo-color; // Cambiar color de acento
$bg: #nuevo-fondo; // Cambiar fondo principal
```

2. **Actualizar variables CSS:**

```css
:root {
  --accent: #nuevo-color;
  --bg: #nuevo-fondo;
}
```

### Añadir Nuevos Componentes

```bash
ng generate component nuevo-componente
```

## 🔧 Configuración Avanzada

### Angular Material (Integrado)

El proyecto incluye **Angular Material** configurado con:

- Paleta de colores magenta y violeta
- Tipografía Roboto
- Soporte para temas claros y oscuros

### TypeScript Estricto

```json
// tsconfig.json configurado con:
"strict": true,
"noImplicitReturns": true,
"noFallthroughCasesInSwitch": true
```

### Prettier (Configurado)

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": { "parser": "angular" }
    }
  ]
}
```

## 🌟 Características Destacadas

### Accesibilidad

- **ARIA labels** en la calculadora
- **Navegación por teclado** funcional
- **Contraste de colores** optimizado
- **Texto alternativo** en elementos interactivos

### Performance

- **Standalone Components** para optimización de bundle
- **OnPush Change Detection** donde aplicable
- **Lazy loading** preparado para futuras extensiones

### Arquitectura Escalable

- **Separación de responsabilidades** clara
- **Tipado TypeScript** completo
- **Componentes reutilizables** y modulares
- **Sistema de estilos** consistente y mantenible

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🔗 Referencias Útiles

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation/)

---

**Desarrollado con ❤️ usando Angular 20 y las mejores prácticas de desarrollo frontend.**
