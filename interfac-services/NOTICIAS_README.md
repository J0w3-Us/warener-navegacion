# Warner News - Sistema de Gestión de Noticias

Sistema profesional de noticias estilo noticiero con diseño tipo CNN/BBC, desarrollado en Angular 20.

## ✅ ¿Problema del `ng server`?

El comando correcto es:

```bash
ng serve
```

o simplemente:

```bash
npm start
```

**Error común:** `ng server` NO existe, debe ser `ng serve` (con "e").

## 🎯 Características Implementadas

### 📱 Pantallas Creadas

1. **Lista de Noticias** (`/noticias`)

   - Grid de noticias destacadas con imágenes
   - Lista completa de todas las noticias
   - Diseño responsive tipo noticiero profesional
   - Categorías visuales con badges
   - Metadatos (autor, fecha)

2. **Detalle de Noticia** (`/noticias/:id`)

   - Vista de artículo periodístico completo
   - Imagen principal a pantalla completa
   - Formato de lectura profesional
   - Botones de compartir y navegación
   - Metadatos detallados

3. **Navegación Principal**
   - Menú superior fijo con enlaces
   - Enlaces a Noticias y Estados
   - Diseño con gradientes y efectos

### 🏗️ Arquitectura

```
src/app/
├── interface/
│   ├── estado.interface.ts
│   └── noticia.interface.ts          ← Nueva interfaz
├── services/
│   ├── estado.ts
│   └── noticias.ts                    ← Nuevo servicio
├── components/
│   ├── listas-estado/
│   ├── lista-noticias/                ← Nuevo componente
│   │   ├── lista-noticias.ts
│   │   ├── lista-noticias.html
│   │   └── lista-noticias.css
│   └── detalle-noticia/               ← Nuevo componente
│       ├── detalle-noticia.ts
│       ├── detalle-noticia.html
│       └── detalle-noticia.css
├── app.ts
├── app.html                           ← Actualizado con navegación
├── app.css                            ← Estilos globales nuevos
└── app.routes.ts                      ← Rutas actualizadas
```

### 🎨 Diseño

- **Paleta de colores profesional:**

  - Azul corporativo: `#1e3c72`, `#2a5298`
  - Naranja distintivo: `#ff6b35`, `#f7931e`
  - Fondos neutros: `#f8f9fa`

- **Tipografía:** Segoe UI, sans-serif
- **Responsive:** Diseño adaptable desde 320px hasta pantallas 4K
- **Efectos:** Sombras, transiciones, hover states profesionales

## 🚀 Iniciar la Aplicación

```bash
# Instalar dependencias (si aún no lo hiciste)
npm install

# Iniciar servidor de desarrollo
npm start
# o
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

## 🌐 Rutas Disponibles

- `/` → Redirige a `/noticias`
- `/noticias` → Lista completa de noticias
- `/noticias/:id` → Detalle de una noticia específica
- `/estados` → Lista de estados (implementación anterior)

## 📡 API y Datos

### URL del API (Render)

```typescript
https://newapi-rjc0.onrender.com/api/noticias
```

### Datos de Ejemplo

El sistema incluye datos de prueba para visualizar la interfaz mientras el endpoint de API no esté disponible. Cuando el API responda 404, automáticamente carga 6 noticias de ejemplo con:

- 3 noticias destacadas
- 6 noticias totales
- Diferentes categorías (Tecnología, Salud, Medio Ambiente, Economía, Deportes, Educación)

### Métodos del Servicio

```typescript
// GET - Todas las noticias
obtenerNoticias(): Observable<Noticia[]>

// GET - Una noticia por ID
obtenerNoticiaPorId(id: string): Observable<Noticia>

// POST - Crear noticia
crearNoticia(noticia: Noticia): Observable<Noticia>

// PUT - Actualizar noticia
actualizarNoticia(id: string, noticia: Noticia): Observable<Noticia>

// DELETE - Eliminar noticia
eliminarNoticia(id: string): Observable<Noticia>
```

## 🔐 Autenticación

El servicio incluye un token Bearer en los headers:

```typescript
headers: {
  "Authorization": "Bearer eyJhbGciOiJI..."
}
```

## 📋 Interfaz Noticia

```typescript
export interface Noticia {
  id?: string;
  titulo: string;
  contenido: string;
  autor: string;
  fecha: string;
  categoria: string;
  imagenUrl?: string;
  destacada: boolean;
  UserAlta: string;
  FechaAlta: string;
  UserMod: string;
  FechaMod: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## 🎓 Uso de los Componentes

### En el Componente TypeScript

```typescript
// Cargar noticias
ngOnInit() {
  this.noticiasService.obtenerNoticias().subscribe({
    next: (data) => {
      this.noticias = data;
    },
    error: (err) => {
      // Fallback a datos de ejemplo
      this.noticias = this.obtenerNoticiasDeEjemplo();
    }
  });
}

// Navegar al detalle
verDetalle(id: string) {
  this.router.navigate(['/noticias', id]);
}
```

### En el Template HTML

```html
<!-- Iterar noticias con trackBy -->
<article *ngFor="let noticia of noticias; trackBy: trackByNoticiaId">
  <h3>{{ noticia.titulo }}</h3>
  <p>{{ noticia.contenido }}</p>
  <span>{{ noticia.fecha | date:'fullDate' }}</span>
</article>
```

## 🐛 Solución de Problemas

### ❌ Error: `ng server` no existe

**Solución:** Usar `ng serve` o `npm start`

### ❌ Error: Cannot GET /api/noticias (404)

**Solución:** El endpoint aún no existe en el servidor. La app muestra automáticamente datos de ejemplo.

### ❌ Error: Missing locale data

**Solución:** Ya corregido. Se usa `date:'fullDate'` sin especificar locale.

### ❌ La página está en blanco

**Solución:** Revisa la consola del navegador (F12) y verifica que `ng serve` esté corriendo sin errores.

## 📦 Dependencias Principales

- Angular 20.3.0
- Angular Router
- Angular Common (pipes, directivas)
- RxJS 7.8.0
- HttpClient

## 🔄 Próximos Pasos

1. **Backend:** Implementar el endpoint `/api/noticias` en el servidor Render
2. **CRUD Completo:** Agregar formularios para crear/editar noticias
3. **Búsqueda:** Implementar filtros por categoría y búsqueda por texto
4. **Paginación:** Agregar paginación para listas grandes
5. **Autenticación:** Sistema de login real en lugar de token hardcodeado
6. **Imágenes:** Subida de imágenes para las noticias
7. **Comentarios:** Sistema de comentarios por noticia

## 📝 Notas Importantes

- ✅ Todos los componentes son **standalone** (no requieren módulos)
- ✅ Usa **HttpClient** con observables (RxJS)
- ✅ Diseño **responsive** mobile-first
- ✅ **Manejo de errores** con fallback a datos de ejemplo
- ✅ **TypeScript** estricto con interfaces tipadas
- ✅ **Routing** con parámetros dinámicos

## 👨‍💻 Autor

Desarrollado para Warner News System
© 2025 - Todos los derechos reservados
