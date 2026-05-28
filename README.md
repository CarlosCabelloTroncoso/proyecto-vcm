# Sistema de Vinculación con el Medio — UCM

Plataforma web para gestionar proyectos y solicitudes de vinculación con el medio de la Universidad Católica del Maule. Permite a distintos actores institucionales (clientes, encargados, gestores, profesores, autoridades y administradores) interactuar con el ciclo completo de una solicitud de proyecto.

## Integrantes

| Nombre | GitHub |
|---|---|
| Carlos Cabello Troncoso | [@CarlosCabelloTroncoso](https://github.com/CarlosCabelloTroncoso) |
| Benjamin Oviedo Oviedo | [@B-oviedo] |
| Francisco Sepúlveda Cáceres | [@franciscosepuca02-2002]|

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 21 (Standalone Components) |
| Estilos | Tailwind CSS 4 |
| Base de datos | Supabase |
| Backend | En desarrollo |
| Gestor de paquetes | npm 11 |

---

## Estructura del Proyecto

```txt
proyecto-vcm/
├── public/                        # Assets estáticos (imágenes, íconos)
├── src/
│   └── app/
│       ├── pages/                 # Layout shells por rol (contienen navbar + router-outlet)
│       │   ├── admin/
│       │   ├── autoridad/
│       │   ├── cliente/
│       │   ├── encargado/
│       │   ├── gestor/
│       │   ├── home/
│       │   ├── login/
│       │   ├── profesor/
│       │   └── registro/
│       │
│       ├── components/
│       │   ├── roles-contenido/   # Vistas lazy-loaded por rol
│       │   │   ├── admin/         # Gestión de usuarios, carreras, facultades, solicitudes
│       │   │   ├── autoridad/     # Ver solicitudes, reportes
│       │   │   ├── cliente/       # Crear y ver mis solicitudes
│       │   │   ├── encargado/     # Ver solicitudes, gestión de planteamiento/proyecto, alumnos
│       │   │   ├── gestor/        # Ver solicitudes
│       │   │   └── profesor/      # Solicitudes, planteamientos, proyectos
│       │   │
│       │   ├── shared/            # Componentes reutilizables (modales de confirmación)
│       │   ├── content-home/      # Contenido de la página pública principal
│       │   ├── content-login/     # Formulario de login
│       │   ├── content-registro/  # Formulario de registro
│       │   ├── navbar/            # Navbar público
│       │   └── footer/            # Footer global
│       │
│       └── interfaces/            # Tipos e interfaces TypeScript
│
├── angular.json                   # Configuración Angular CLI
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración TypeScript base
├── tsconfig.app.json              # TypeScript para la app
└── tsconfig.spec.json             # TypeScript para tests
```

---

## Requisitos Previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20.x LTS |
| npm | 11.x |
| Angular CLI | 21.x |
| Git | cualquier versión reciente |

---

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/CarlosCabelloTroncoso/proyecto-vcm.git
cd proyecto-vcm/proyecto-vcm
```

### 2. Instalar dependencias

```bash
npm install
```

---

## Levantar el entorno de desarrollo

```bash
ng serve
```

La app queda disponible en `http://localhost:4200`.  
El servidor recarga automáticamente ante cambios en los archivos fuente.

---

## Backend

El backend del proyecto se encuentra actualmente **en desarrollo**.

---

## Arquitectura de Routing

Cada rol funciona como un **layout shell** (`pages/<rol>/<rol>.ts`) que renderiza:

```html
<app-navbar-ROL />
<router-outlet />
```

Las vistas internas se cargan con **Lazy Loading** (`loadComponent`) para optimizar el bundle inicial. Ejemplo de ruta:

```ts
{
  path: 'encargado',
  component: Encargado,
  children: [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', loadComponent: () => import('...').then(m => m.HomeEncargado) },
    // ...
  ]
}
```

---

*Última actualización: 27 de Mayo de 2026*
