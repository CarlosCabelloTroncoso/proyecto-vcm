# Sistema de Vinculación con el Medio — UCM

Plataforma web para gestionar solicitudes y proyectos de vinculación con el medio de la
Universidad Católica del Maule. Distintos actores institucionales (clientes, encargados,
profesores, autoridades y administradores) participan en el ciclo completo de una
solicitud: **solicitud → planteamiento → proyecto**.

## Integrantes

| Nombre | GitHub |
|---|---|
| Carlos Cabello Troncoso | [@CarlosCabelloTroncoso](https://github.com/CarlosCabelloTroncoso) |
| Benjamin Oviedo Oviedo | [@B-oviedo](https://github.com/B-oviedo) |
| Francisco Sepúlveda Cáceres | [@franciscosepuca02-2002](https://github.com/franciscosepuca02-2002) |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 21 (Standalone Components) |
| Estilos | Tailwind CSS 4 |
| Backend y base de datos | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Despliegue | Vercel |
| Gestor de paquetes | npm 11 |

Es un sistema **100 % web**. No hay un servidor backend propio: **Supabase** cumple ese
rol (datos, autenticación, almacenamiento de archivos y reglas de seguridad RLS).

---

## Roles

| Rol | Función |
|---|---|
| Cliente | Crea y da seguimiento a sus solicitudes |
| Profesor | Plantea y ejecuta proyectos desde solicitudes aprobadas |
| Encargado (Gestor) | Aprueba/rechaza solicitudes y planteamientos de su carrera; gestiona alumnos y reportes |
| Autoridad | Consulta solicitudes y reportes (solo lectura) |
| Administrador | Gestiona facultades, carreras, usuarios, alumnos y solicitudes |

---

## Requisitos previos

| Herramienta | Versión |
|---|---|
| Node.js | 20 LTS o superior |
| npm | 11.x |
| Git | Reciente |

---

## Puesta en marcha (resumen)

```bash
git clone https://github.com/CarlosCabelloTroncoso/proyecto-vcm.git
cd proyecto-vcm
npm install
# crear src/environments/environment.ts con las credenciales de Supabase (ver manual)
npx ng serve        # desarrollo → http://localhost:4200
```

> ⚠️ El archivo `src/environments/environment.ts` está en `.gitignore`, por lo que **no
> viene al clonar** y hay que crearlo con la URL y la clave de Supabase. Los pasos
> completos están en **[manualInstalacion/INSTALACION.md](manualInstalacion/INSTALACION.md)**.

Compilar para producción:

```bash
npm run build       # salida en dist/proyecto-vcm/browser
```

---

## Documentación

- **[Manual de instalación](manualInstalacion/INSTALACION.md)** — cómo montar y ejecutar el proyecto.
- **[Manual de usuario](manualUsuario/MANUAL-USUARIO.md)** — qué puede hacer cada rol, paso a paso.

---

## Despliegue

Vercel reconstruye y publica automáticamente cada *push* a la rama `main`
(configuración en `vercel.json`). Las credenciales se toman de las variables de entorno
`SUPABASE_URL` y `SUPABASE_KEY` definidas en Vercel.

---

## Estructura del proyecto

```txt
proyecto-vcm/
├── public/                       # Assets estáticos
├── src/app/
│   ├── pages/                    # Layout por rol (navbar + router-outlet)
│   ├── components/
│   │   ├── roles-contenido/      # Vistas por rol (admin, cliente, encargado, profesor, autoridad)
│   │   └── shared/               # Componentes reutilizables (modales, perfil)
│   ├── core/                     # Servicios (Supabase, Auth, Data, Catalog), guards, utils
│   └── interfaces/               # Tipos TypeScript
├── manualInstalacion/            # Manual de instalación
├── manualUsuario/                # Manual de usuario
├── scripts/set-env.js            # Genera environment.ts en el build de Vercel
├── vercel.json                   # Configuración de despliegue
└── angular.json
```

Las vistas por rol se cargan con **Lazy Loading** (`loadComponent`) para optimizar el
bundle inicial.
