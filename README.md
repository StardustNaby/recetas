# Ricetta 🍽️

Aplicación web moderna para compartir y descubrir recetas de cocina. Desarrollada con Angular Material, siguiendo un diseño simple, moderno y con colores crema neutros con acentos verdes.

## Características

- 📝 **Gestión de Recetas**: Crea, visualiza y guarda recetas favoritas
- 💬 **Publicaciones**: Comparte opiniones y referencias a recetas
- 👤 **Perfiles de Usuario**: Gestiona tu perfil con foto y nivel (novato/intermedio/profesional)
- ❤️ **Favoritos**: Guarda tus recetas y publicaciones favoritas
- 💬 **Comentarios**: Comenta en publicaciones
- 👍 **Sistema de Votos**: Vota (upvote/downvote) en publicaciones
- 🔒 **Autenticación**: Sistema de login/registro con validación robusta

## Tecnologías

- Angular 18+
- Angular Material
- TypeScript
- SCSS

## Modelo de Datos

La aplicación maneja 14 entidades principales:
- Usuario
- Receta
- Publicación
- Ingrediente
- Categoría
- Unidad de Medida
- Información Nutricional
- Receta-Ingrediente (relación N:M)
- Receta-Categoría (relación N:M)
- Comentario
- Respuesta Comentario
- Calificación
- Favorito
- Voto

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

# La aplicación estará disponible en http://localhost:4200
```

## Requisitos de Contraseña

Las contraseñas deben tener:
- Mínimo 6 caracteres
- Al menos un número
- Al menos un carácter especial

## Estructura del Proyecto

```
src/app/
├── auth/              # Autenticación (login, registro)
├── recipes/           # Gestión de recetas
├── publications/      # Publicaciones y comentarios
├── profile/           # Perfil de usuario
├── favorites/         # Favoritos
├── pages/             # Páginas públicas (landing)
└── core/
    ├── layouts/       # Layouts principales
    ├── guards/        # Guards de autenticación
    ├── models/        # Modelos/interfaces
    └── services/      # Servicios (Auth, Recipes, Publications, etc.)
```

## Estado

Actualmente la aplicación utiliza localStorage para persistencia de datos. Para producción, se recomienda conectar con una API REST backend.

## Desarrollo

Este proyecto fue creado siguiendo las mejores prácticas de Angular y Material Design, con un enfoque en:
- Componentes reutilizables
- Servicios modulares
- Validación de formularios robusta
- Diseño responsive
- UX intuitiva

---

Desarrollado con ❤️ usando Angular Material
