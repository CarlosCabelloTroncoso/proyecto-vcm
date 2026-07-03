# Manual de Instalación — Sistema de Vinculación con el Medio (UCM)

Guía para levantar el proyecto en un equipo de desarrollo, desde cero, y dejarlo
funcionando conectado a la base de datos existente en Supabase.

> **Público:** desarrolladores que van a ejecutar, modificar o desplegar el sistema.
> No es un manual de uso para el usuario final.

---

## 1. ¿Qué es este sistema? (arquitectura)

Es un sistema **100 % web** compuesto por dos capas:

| Capa | Tecnología | Dónde vive |
|---|---|---|
| **Frontend** | Angular 21 (Standalone Components) + Tailwind CSS 4 | Corre en el navegador; en tu equipo se sirve en desarrollo |
| **Backend / Base de datos** | **Supabase** (PostgreSQL + Autenticación + Storage + RLS) | En la nube — **no se instala nada localmente** |

**No existe un servidor backend propio que instalar o levantar.** Supabase cumple
ese rol: guarda los datos, gestiona el inicio de sesión, almacena los archivos y
aplica las reglas de seguridad (RLS). Por eso "instalar" aquí significa, en la
práctica, **preparar el frontend y conectarlo a la Supabase que ya está creada**.

---

## 2. Requisitos previos

Instala estas herramientas antes de empezar:

| Herramienta | Versión | Para qué |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20 LTS o superior (20 o 22 recomendado) | Ejecutar y compilar la app |
| npm | 11.x (viene con Node; si no, `npm install -g npm@11`) | Gestor de paquetes |
| [Git](https://git-scm.com/) | Reciente | Clonar el repositorio |
| Editor de código | Ej. [VS Code](https://code.visualstudio.com/) | Editar el proyecto |
| Navegador | Chrome, Edge o Firefox actual | Abrir la app |

Angular CLI es **opcional** instalarlo global; en esta guía usamos `npx ng` para no
depender de una instalación global. Si prefieres tenerlo global:

```bash
npm install -g @angular/cli@21
```

Verifica que Node y npm quedaron bien instalados:

```bash
node -v
npm -v
```

---

## 3. Clonar el repositorio

```bash
git clone https://github.com/CarlosCabelloTroncoso/proyecto-vcm.git
```

```bash
cd proyecto-vcm
```

> El `package.json` está en la raíz del repositorio, así que **no** hay que entrar a
> ninguna subcarpeta adicional.

---

## 4. Instalar las dependencias

Desde la carpeta `proyecto-vcm`:

```bash
npm install
```

Esto descarga todo lo que necesita el proyecto (Angular, Supabase, Tailwind, etc.)
en la carpeta `node_modules/`. Puede tardar un par de minutos la primera vez.

---

## 5. Configurar las credenciales de Supabase ⚠️ (paso obligatorio)

Este es el paso más importante y el que más se olvida.

El archivo con las credenciales, `src/environments/environment.ts`, **está en
`.gitignore`**, es decir, **no viene incluido al clonar el proyecto**. Si intentas
ejecutar la app sin crearlo, fallará con un error de compilación.

### 5.1. Crear el archivo

Crea el archivo:

```
src/environments/environment.ts
```

Con este contenido:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://hnrybsoglzfltoasaudc.supabase.co',
  supabaseKey: 'sb_publishable_QkOSGZgyBMF41kccXovFqA_C_cg22RC'
};
```

Con eso el proyecto queda conectado a la base de datos existente y ya puedes
ejecutarlo.

### 5.2. ¿De dónde salen esos valores?

- `supabaseUrl` y `supabaseKey` corresponden al proyecto de Supabase del equipo.
- Se obtienen en el panel de Supabase: **Project Settings → API**
  (o pídeselos a un integrante del equipo).
- La clave usada aquí es la **clave publicable / anon** (empieza con
  `sb_publishable_`). Es **pública por diseño**: viaja al navegador en cada visita,
  por lo que no es un secreto y puede ir en este manual.

> 🔒 **Nunca** compartas ni subas al repositorio la clave **`service_role`** (la
> clave secreta con permisos totales). Esa sí es privada.

---

## 6. Ejecutar en modo desarrollo

```bash
npx ng serve
```

(o `ng serve` si instalaste Angular CLI global)

Cuando termine de compilar, abre en el navegador:

```
http://localhost:4200
```

El servidor recarga la página automáticamente cada vez que guardas un cambio en el
código.

Para detenerlo, presiona `Ctrl + C` en la terminal.

---

## 7. Compilar para producción (opcional)

Si quieres generar los archivos estáticos listos para publicar:

```bash
npm run build
```

El resultado queda en:

```
dist/proyecto-vcm/browser/
```

Esa carpeta contiene el sitio web ya optimizado (HTML, CSS y JS), que puede
subirse a cualquier hosting de archivos estáticos.

---

## 8. Despliegue en Vercel

El proyecto se despliega en **Vercel**, que reconstruye y publica automáticamente
cada vez que se hace *push* a la rama `main`. El código vive en un repositorio de
GitHub y Vercel se conecta a ese repositorio.

La configuración de build ya está en `vercel.json`:

- **Build command:** `npm run build`
- **Output directory:** `dist/proyecto-vcm/browser`
- **Rewrites:** todas las rutas redirigen a `index.html` (necesario para que
  funcione el enrutamiento de una SPA).

A continuación se describe el flujo completo, desde subir el código a GitHub hasta
dejar la app publicada.

### 8.1. Crear el repositorio en GitHub y subir el código

1. Crea un repositorio **nuevo y vacío** en GitHub (sin README, sin `.gitignore`,
   sin licencia), por ejemplo `mi-usuario/mi-repositorio`.

2. Desde la carpeta del proyecto (`proyecto-vcm`), apunta el remoto `origin` a la
   URL de tu nuevo repositorio. Reemplaza la URL de ejemplo por la tuya:

   ```bash
   git remote set-url origin https://github.com/mi-usuario/mi-repositorio.git
   ```

   > Si el proyecto todavía no tiene un remoto `origin`, usa `git remote add origin ...`
   > en lugar de `set-url`.

3. Confirma que quedó apuntando al repositorio correcto:

   ```bash
   git remote -v
   ```

   Debe verse algo así (con tu propia URL):

   ```text
   origin  https://github.com/mi-usuario/mi-repositorio.git (fetch)
   origin  https://github.com/mi-usuario/mi-repositorio.git (push)
   ```

4. Sube el código. Primero la rama **`main`**, que es la que Vercel usa para
   desplegar:

   ```bash
   git push -u origin main
   ```

   Después sube la rama de trabajo **`supabase`**:

   ```bash
   git push -u origin supabase
   ```

   Con esto quedan ambas ramas publicadas en GitHub.

### 8.2. Crear el proyecto en Vercel

1. Entra a [Vercel](https://vercel.com/) e inicia sesión (el plan **Hobby**,
   gratuito, es suficiente).
2. Crea un **New Project** y elige **Import Git Repository**.
3. Conecta tu cuenta de GitHub (**Install**) y otorga acceso al repositorio que
   acabas de crear.
4. Selecciona ese repositorio para importarlo. Vercel detecta automáticamente la
   configuración de `vercel.json` (build command y output directory), así que no
   hace falta cambiarlos.

### 8.3. Configurar las variables de entorno en Vercel

En producción, las credenciales **no** se toman de `environment.ts` (ese archivo no
está en Git). En su lugar, el script `scripts/set-env.js` genera el archivo durante
el build a partir de dos variables de entorno que debes configurar en Vercel, antes
del primer despliegue (**Project Settings → Environment Variables**):

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | La URL del proyecto de Supabase |
| `SUPABASE_KEY` | La clave publicable (`sb_publishable_...`) |

Si esas variables faltan, el build falla con un error de `set-env`.

Con las variables cargadas, lanza el despliegue (**Deploy**). Vercel compilará y
publicará la app en una URL del tipo `https://mi-repositorio.vercel.app`.

### 8.4. Registrar las URLs en Supabase

Para que el inicio de sesión y los enlaces por correo funcionen en la app ya
publicada, hay que decirle a Supabase cuál es la URL del sitio. En el panel de
Supabase, ve a tu proyecto → **Authentication → URL Configuration** y agrega la
URL de Vercel:

- **Site URL:** la URL principal de tu despliegue, por ejemplo
  `https://mi-repositorio.vercel.app`.
- **Redirect URLs:** agrega esa misma URL (y, si las usas, las de vistas previas
  de Vercel) para permitir las redirecciones de autenticación.

Guarda los cambios. Con esto la aplicación queda **desplegada y funcionando**: cada
nuevo *push* a `main` disparará automáticamente un nuevo despliegue en Vercel.

---

## 9. Solución de problemas comunes

| Problema | Causa probable | Solución |
|---|---|---|
| Error de compilación: no encuentra `environment` | No creaste `src/environments/environment.ts` | Repite el **Paso 5** |
| La app carga pero no inicia sesión ni muestra datos | URL o clave de Supabase incorrectas | Revisa los valores del **Paso 5** |
| `ng: command not found` | No tienes Angular CLI global | Usa `npx ng serve` en vez de `ng serve` |
| Errores raros tras actualizar dependencias | Caché o `node_modules` inconsistente | Borra `node_modules` y `package-lock.json`, y vuelve a `npm install` |
| El puerto 4200 está ocupado | Otra instancia corriendo | `npx ng serve --port 4300` |

---

## 10. Comandos útiles (resumen)

```bash
git clone https://github.com/CarlosCabelloTroncoso/proyecto-vcm.git
cd proyecto-vcm
npm install
# crear src/environments/environment.ts (ver Paso 5)
npx ng serve          # desarrollo  → http://localhost:4200
npm run build         # producción  → dist/proyecto-vcm/browser
```

---

*Manual de instalación — Sistema de Vinculación con el Medio, Universidad Católica del Maule.*
