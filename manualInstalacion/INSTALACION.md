# Manual de Instalación — Sistema de Vinculación con el Medio (UCM)

Guía **paso a paso, desde cero**, para dejar el proyecto funcionando: primero en tu
computador (modo local) y después publicado en internet (producción con Vercel).

Está escrita para que la pueda seguir cualquier persona, **incluso sin experiencia
previa**. Cada paso indica **qué hacer, dónde hacerlo y con qué enlace**. Sigue los
pasos en orden y no te saltes ninguno.

> **Índice rápido**
>
> - **Parte A — Instalación local** → pasos 1 al 11
> - **Parte B — Publicar en producción (Vercel)** → pasos 12 al 18
> - **Parte C — Referencia** → comandos útiles y solución de problemas

---

## 0. ¿Qué es este sistema? (para entender lo que vas a instalar)

Es un sistema **100 % web** con dos partes:

| Parte | Tecnología | ¿Dónde vive? |
|---|---|---|
| **Frontend** (lo que se ve) | Angular 21 + Tailwind CSS 4 | Corre en el navegador; en desarrollo se sirve desde tu computador |
| **Backend / Base de datos** | **Supabase** (PostgreSQL + Autenticación + Archivos + Seguridad RLS) | En la nube — **no se instala nada en tu computador** |

**No hay un servidor propio que instalar.** Supabase hace ese trabajo: guarda los
datos, gestiona el inicio de sesión, almacena archivos y aplica las reglas de
seguridad. Por eso "instalar" aquí significa, en la práctica:

1. Preparar tu computador (programas y cuentas).
2. Crear tu propia base de datos en Supabase y cargarle la estructura.
3. Conectar el frontend a esa base de datos.

---
---

# PARTE A — INSTALACIÓN LOCAL (en tu computador)

## 1. Instalar los programas necesarios

Antes de tocar el proyecto, instala estos 4 programas. Hazlo **en orden** y sigue
las indicaciones literales de cada uno.

| Programa | ¿Para qué sirve? |
|---|---|
| **Node.js** | Ejecutar y compilar la app |
| **Git** | Descargar el código y subir cambios |
| **Visual Studio Code (VS Code)** | Editor para ver y modificar el código |
| **Google Chrome** | Abrir y probar la app |

### 1.1. Instalar Node.js

1. Entra a: https://nodejs.org/
2. Verás dos botones grandes. Presiona el de la **izquierda**, el que dice **"LTS"**
   (es la versión estable; sirve la 20 o la 22). Se descargará un archivo
   `.msi` (Windows) o `.pkg` (Mac).
3. Abre el archivo descargado (doble clic).
4. En el instalador presiona: **Next → acepta los términos (I accept) → Next → Next
   → Next → Install**. Si Windows pregunta *"¿Permitir que esta app haga cambios?"*,
   presiona **Sí**.
5. Cuando diga *"Completed"*, presiona **Finish**. No necesitas abrir nada; Node.js
   funciona por debajo.

### 1.2. Instalar Git

1. Entra a: https://git-scm.com/downloads
2. Presiona el logo de tu sistema (**Windows** o **macOS**) y luego el botón de
   descarga (**"Click here to download"** / *64-bit Setup*).
3. Abre el archivo descargado.
4. **Windows:** el instalador tiene muchas pantallas. **No cambies nada**: solo
   presiona **Next** en todas hasta llegar a **Install**, y al final **Finish**.
   (Las opciones por defecto son las correctas.)
5. No hay que abrir Git; se usa desde la terminal.

### 1.3. Instalar Visual Studio Code

1. Entra a: https://code.visualstudio.com/
2. Presiona el botón azul **"Download for Windows"** (o Mac, según tu equipo).
3. Abre el archivo descargado.
4. En el instalador: acepta el acuerdo (**I accept the agreement**) → **Next**.
   **Importante:** en la pantalla de *"Additional Tasks"* marca la casilla
   **"Add to PATH"** y también **"Open with Code"** (si aparecen). Luego **Next →
   Install → Finish**.
5. Se abrirá VS Code. Puedes cerrarlo por ahora; lo usarás en el paso 3.

### 1.4. Instalar Google Chrome

1. Entra a: https://www.google.com/chrome/
2. Presiona **"Descargar Chrome"** → abre el archivo → sigue los pasos hasta
   terminar. (Si ya tienes Chrome, Edge o Firefox, puedes saltarte esto.)

### 1.5. Verificar que Node y Git quedaron bien instalados

Abre una terminal:

- **Windows:** presiona la tecla `Windows`, escribe **PowerShell** y ábrelo.
- **Mac:** abre la app **Terminal**.

Escribe estos comandos (uno, Enter; el otro, Enter). Deben responder con un número
de versión:

```bash
node -v
npm -v
git --version
```

Si cada uno responde algo como `v22.11.0`, `11.5.1`, `git version 2.4x`, ¡vas bien!
Si alguno dice "no se reconoce el comando", **cierra y vuelve a abrir la terminal**;
si sigue fallando, reinstala ese programa.

---

## 2. Crear las cuentas que necesitas

Necesitas 4 cuentas. Créalas antes de continuar. Todas son **gratuitas**.

### 2.1. Correo electrónico

Si ya tienes un correo (Gmail, Outlook, etc.), úsalo y salta al 2.2. Si no:

- Crear un Gmail: https://accounts.google.com/signup

> Usa **el mismo correo** para GitHub, Vercel y Supabase. Así todo queda ordenado.

### 2.2. GitHub (para guardar y compartir el código)

1. Entra a: https://github.com/signup
2. Escribe tu correo, crea una contraseña y elige un nombre de usuario.
3. Confirma el correo (GitHub te enviará un código).

### 2.3. Supabase (la base de datos en la nube)

1. Entra a: https://supabase.com/dashboard/sign-up
2. Lo más fácil: presiona **"Continue with GitHub"** para entrar con la cuenta que
   acabas de crear.
3. Acepta los permisos.

### 2.4. Vercel (para publicar la app en internet) — solo si harás producción

1. Entra a: https://vercel.com/signup
2. Presiona **"Continue with GitHub"** y acepta los permisos.
3. Elige el plan **Hobby** (gratis).

> Vercel lo usarás en la **Parte B**. Puedes crear la cuenta ahora o dejarla para
> ese momento.

### 2.5. Conectar Git (tu computador) con tu cuenta de GitHub

Para que Git sepa **quién eres** al guardar cambios, y para poder **subir código**
más adelante, hay que hacer dos cosas: poner tu identidad y, la primera vez, iniciar
sesión.

> ℹ️ **¿Necesito login para clonar?** Este repositorio es **público**, así que para
> *clonar* (paso 3) **no** hace falta iniciar sesión. El login se necesita cuando
> **subes** cambios a tu propio repositorio (push, paso 14). Aun así, deja tu
> identidad configurada desde ahora.

**a) Poner tu identidad** (aparecerá como autor de tus cambios). En la terminal —
sirve la de VS Code o PowerShell— escribe estos dos comandos, reemplazando por tus
datos de GitHub (el correo debe ser el mismo con el que creaste la cuenta):

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tucorreo@ejemplo.com"
```

Puedes comprobar que quedaron guardados con:

```bash
git config --global user.name
git config --global user.email
```

**b) Iniciar sesión en GitHub (la primera vez que subes código).** No hay un comando
"login" que escribir: la primera vez que hagas una operación que lo requiera (por
ejemplo `git push` en el paso 14), **Git for Windows abre una ventana automáticamente**
llamada **"Sign in to GitHub"** / *Git Credential Manager*. Ahí:

1. Elige la pestaña **"Browser"** y presiona **"Sign in with your browser"**
   (Iniciar sesión con el navegador).
2. Se abrirá GitHub en el navegador. Inicia sesión con tu usuario y contraseña
   (los del paso 2.2).
3. Presiona **"Authorize git-ecosystem"** (Autorizar) para dar permiso.
4. Aparecerá *"Authentication Succeeded"*. Cierra el navegador y vuelve a VS Code:
   el push continuará solo.

> Tu computador **recuerda** esa sesión, así que solo tendrás que hacerlo **una vez**.
> Si en el futuro clonas un repositorio **privado**, esa misma ventana aparecerá al
> clonar; se resuelve igual.

> 💡 **Alternativa (opcional):** si prefieres, puedes iniciar sesión de antemano con
> la herramienta oficial **GitHub CLI** (https://cli.github.com/): tras instalarla,
> ejecuta `gh auth login` y sigue las preguntas. No es obligatorio; el método de la
> ventana automática (arriba) es suficiente.

---

## 3. Clonar (descargar) el repositorio usando VS Code

"Clonar" = descargar una copia del código a tu computador. Lo haremos cómodo, desde
VS Code.

### 3.1. Crear una carpeta para el proyecto

1. Ve a tu **Escritorio** (o donde prefieras guardarlo).
2. Clic derecho en un espacio vacío → **Nuevo → Carpeta**.
3. Ponle un nombre, por ejemplo `VINCULACION`, y presiona Enter.

### 3.2. Abrir esa carpeta con VS Code

1. Abre **Visual Studio Code**.
2. En el menú de arriba: **File (Archivo) → Open Folder (Abrir carpeta…)**.
3. Busca y selecciona la carpeta que creaste (`VINCULACION`) y presiona
   **"Seleccionar carpeta"**.
4. Si VS Code pregunta *"¿Confías en los autores de esta carpeta?"*, presiona
   **"Yes, I trust the authors"** (Sí, confío).

### 3.3. Abrir la terminal dentro de VS Code

1. En el menú de arriba: **Terminal → New Terminal (Nueva terminal)**.
2. Se abrirá una terminal en la parte de abajo de VS Code, **ya ubicada dentro de tu
   carpeta**. Ahí escribirás los comandos.

### 3.4. Clonar el proyecto

En esa terminal, escribe (o copia y pega) este comando y presiona Enter:

```bash
git clone https://github.com/CarlosCabelloTroncoso/proyecto-vcm.git
```

Espera a que termine de descargar. Se creará una subcarpeta llamada `proyecto-vcm`.
Ahora **entra** en ella:

```bash
cd proyecto-vcm
```

> A partir de aquí, la terminal está parada **dentro de `proyecto-vcm`**. Sabrás que
> es así porque la línea de la terminal termina en `...\proyecto-vcm>`. **Todos** los
> comandos siguientes se ejecutan desde ahí. El archivo `package.json` está en esa
> raíz, así que **no** hay que entrar a ninguna subcarpeta adicional.

💡 Para ver el código dentro de VS Code, en el menú **File → Open Folder** puedes
abrir ahora la carpeta `proyecto-vcm`. (Al hacerlo, vuelve a abrir la terminal con
**Terminal → New Terminal**, que quedará ya dentro de `proyecto-vcm`.)

---

## 4. Instalar las dependencias

Las "dependencias" son las piezas que el proyecto necesita para funcionar (Angular,
Supabase, Tailwind, etc.). Se instalan con un solo comando.

**Dónde:** en la **misma terminal de VS Code** que abriste en el paso 3, parada
dentro de `proyecto-vcm` (la línea termina en `...\proyecto-vcm>`).

Escribe y presiona Enter:

```bash
npm install
```

Esto crea la carpeta `node_modules/` con todo lo necesario. La **primera vez** puede
tardar un par de minutos (verás muchas líneas moverse; es normal). Cuando termine y
la terminal te devuelva la línea para escribir, ya está listo.

---

## 5. Crear tu proyecto en Supabase y cargar la base de datos

Aquí crearás tu **propia** base de datos y le cargarás la estructura (tablas,
datos iniciales y reglas de seguridad).

> 📁 **Necesitas 3 archivos SQL** (te los entrega el equipo o están dentro del
> proyecto): el del **esquema** (las tablas), el de los **insert** (datos iniciales)
> y el de las **policies** (reglas de seguridad RLS). Da igual dónde estén guardados;
> lo que importa es abrir cada uno, copiar su contenido y pegarlo en Supabase.

### 5.1. Crear el proyecto en Supabase

1. Entra al panel: https://supabase.com/dashboard
2. Presiona **"New project"** (o entra directo a https://supabase.com/dashboard/new).
3. Completa:
   - **Name:** un nombre, por ejemplo `proyecto-vcm`.
   - **Database Password:** inventa una contraseña **fuerte** y **guárdala** (la
     necesitarás si algún día conectas por base de datos directa).
   - **Region:** elige la más cercana (por ejemplo *South America (São Paulo)*).
4. Presiona **"Create new project"** y espera 1–2 minutos mientras Supabase lo
   prepara.

### 5.2. Cargar los scripts SQL (en orden)

Vas a usar el **SQL Editor** de Supabase, que es como una hoja donde pegas comandos
y los ejecutas.

1. En el menú lateral izquierdo, entra a **SQL Editor**
   (o directo: `https://supabase.com/dashboard/project/_/sql`).
2. Presiona **"New query"** (nueva consulta).

Ahora ejecuta los 3 archivos **en este orden exacto**. Para cada uno: abre el
archivo `.sql`, **copia todo su contenido**, **pégalo** en el editor y presiona el
botón **"Run"** (o `Ctrl + Enter`). Espera a que diga *Success* antes de pasar al
siguiente.

| Orden | Archivo | Qué hace |
|---|---|---|
| **1º** | Esquema (schema) | Crea las tablas y su estructura |
| **2º** | Insert (seed/datos) | Carga datos iniciales (facultades, carreras, roles, etc.) |
| **3º** | Policies (RLS) | Aplica las reglas de seguridad por rol |

> ⚠️ **El orden importa.** Si ejecutas los insert antes que el esquema, fallará
> porque las tablas todavía no existen. Si algo sale en rojo, lee el mensaje de
> error: casi siempre es porque se ejecutó fuera de orden o se pegó solo una parte
> del archivo.

3. Para comprobar que quedó bien, entra en el menú lateral a **Table Editor**:
   deberías ver la lista de tablas creadas.

---

## 6. Obtener las credenciales de Supabase

Tu app necesita 2 datos para conectarse a la base que acabas de crear: la **URL** y
la **clave publicable**.

1. En el panel de tu proyecto, ve a **Project Settings → API**
   (directo: `https://supabase.com/dashboard/project/_/settings/api`).
2. Anota estos dos valores:

   | Dato | Dónde aparece | Ejemplo |
   |---|---|---|
   | **Project URL** | Sección *Project URL* | `https://abcdxyz.supabase.co` |
   | **Clave publicable / anon** | Sección *API Keys*, la clave **`anon` / `public`** (empieza con `sb_publishable_` o es la `anon key`) | `sb_publishable_XXXXXXXX` |

> 🔒 **Muy importante:** usa **solo** la clave **publicable / anon**. **NUNCA** uses
> ni compartas la clave **`service_role`** (la secreta con permisos totales). Esa
> jamás debe ir en el código ni en este manual.

---

## 7. Crear el archivo `environment.ts` (conectar la app a Supabase)

Este es el paso más importante y el que más se olvida.

El archivo con las credenciales **no viene incluido** al clonar el proyecto (está
oculto a propósito en `.gitignore`). **Tienes que crearlo tú.** Si intentas ejecutar
la app sin él, fallará con un error de compilación.

### 7.1. Crear el archivo

Crea un archivo nuevo en esta ruta exacta, dentro del proyecto:

```
src/environments/environment.ts
```

> Si la carpeta `environments` no existe, créala. En VS Code: clic derecho sobre la
> carpeta `src` → **New Folder** → `environments`; luego clic derecho sobre ella →
> **New File** → `environment.ts`.

### 7.2. Qué va dentro del archivo

Pega esto **y reemplaza los dos valores** por los que anotaste en el paso 6:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'PEGA_AQUI_TU_PROJECT_URL',
  supabaseKey: 'PEGA_AQUI_TU_CLAVE_PUBLICABLE',
};
```

Ejemplo ya completado (los valores son de muestra, usa los tuyos):

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://abcdxyz.supabase.co',
  supabaseKey: 'sb_publishable_XXXXXXXXXXXXXXXX',
};
```

Guarda el archivo (`Ctrl + S`).

### 7.3. ¿De dónde salieron esos valores?

- `supabaseUrl` → es el **Project URL** del paso 6.
- `supabaseKey` → es la **clave publicable / anon** del paso 6.
- Es una clave **pública por diseño**: viaja al navegador en cada visita, por lo que
  no es un secreto. Aun así, la `service_role` **nunca** se pone aquí.

---

## 8. Configurar las URLs de autenticación en Supabase (para local)

La app envía **correos con enlaces** en tres situaciones. Para que esos enlaces
lleven de vuelta a tu app, hay que decirle a Supabase cuáles son las direcciones
permitidas. Si no haces esto, el registro y la recuperación de contraseña **no
funcionarán**.

Las tres funciones y la dirección a la que vuelve cada una:

| Función (correo) | A dónde debe volver el enlace |
|---|---|
| **Confirmar registro / Activar cuenta** | `http://localhost:4200/auth/callback` |
| **Recuperar contraseña** | `http://localhost:4200/auth/reset-password` |
| **Reactivar cuenta** | `http://localhost:4200/auth/reactivar` |

### 8.1. Registrar las URLs

1. En Supabase, ve a **Authentication → URL Configuration**
   (directo: `https://supabase.com/dashboard/project/_/auth/url-configuration`).
2. En **Site URL**, escribe:

   ```
   http://localhost:4200
   ```

3. En **Redirect URLs**, presiona el botón verde **"Add URL"** (arriba a la derecha)
   y agrega esta única dirección:

   ```
   http://localhost:4200/**
   ```

4. Presiona **"Save"**.

> ✅ **¿Qué significa el `/**`?** Es un **comodín**: quiere decir "cualquier ruta que
> empiece con `http://localhost:4200/`". Por eso, con esa **sola** línea quedan
> autorizadas de una vez las tres rutas de autenticación (`/auth/callback`,
> `/auth/reset-password` y `/auth/reactivar`). **No** necesitas agregarlas una por
> una.

### 8.2. (Opcional) Revisar los textos de los correos

En **Authentication → Emails** (o *Email Templates*) puedes ver y editar el texto de
cada correo: **Confirm signup** (registro), **Reset Password** (contraseña) y **Magic
Link** (reactivación). No es obligatorio tocarlos para que funcione.

> 💡 En desarrollo, Supabase permite un número **limitado de correos por hora**. Si
> dejan de llegar, es por ese límite (rate limit): espera un rato y reintenta.

---

## 9. Ejecutar la app en modo desarrollo

Parado dentro de `proyecto-vcm`:

```bash
npm start
```

(equivale a `ng serve`; también puedes usar `npx ng serve`)

Espera a que compile. Cuando veas un mensaje como *"Compiled successfully"*, abre el
navegador en:

```
http://localhost:4200
```

La página se **recarga sola** cada vez que guardas un cambio en el código.

Para **detener** el servidor, vuelve a la terminal y presiona `Ctrl + C`.

---

## 10. Comprobar que todo funciona

1. La página de inicio carga en `http://localhost:4200`.
2. Puedes **registrarte** con un correo y te llega el correo de confirmación.
3. Al abrir el enlace del correo, vuelves a la app ya confirmado.

Si algo falla aquí, salta a la **Parte C → Solución de problemas** al final.

Con esto tu **entorno local está completo**. 🎉

---
---

# PARTE B — PUBLICAR EN PRODUCCIÓN (Vercel)

En producción no se usa `npm start`: se **compila** el proyecto y se **publica** en
Vercel, que lo reconstruye automáticamente cada vez que subes cambios a GitHub.

## 11. Compilar para producción (probar en tu computador)

Este paso es **opcional** pero recomendado para verificar que el proyecto compila sin
errores antes de publicarlo.

**Dónde:** parado dentro de `proyecto-vcm`.

```bash
npm run build
```

El resultado (el sitio ya optimizado: HTML, CSS y JS) queda en la carpeta:

```
dist/proyecto-vcm/browser/
```

Vercel hará esta misma compilación por ti en la nube, así que **no** tienes que subir
esa carpeta a mano. Con que compile sin errores, basta.

---

## 12. Crear un repositorio nuevo en GitHub

Vas a subir el código a **tu propio** repositorio para que Vercel lo tome desde ahí.

1. Entra a: https://github.com/new
2. Completa:
   - **Repository name:** por ejemplo `proyecto-vcm`.
   - **Public** o **Private:** cualquiera sirve.
   - **NO** marques "Add a README", "Add .gitignore" ni "Choose a license". El
     repositorio debe quedar **vacío**.
3. Presiona **"Create repository"**.
4. GitHub te mostrará la URL del repositorio. Cópiala; se ve así:

   ```
   https://github.com/TU-USUARIO/proyecto-vcm.git
   ```

---

## 13. Apuntar tu proyecto local al nuevo repositorio

Ahora le dices a tu copia local que suba a **tu** repositorio (y no al original).

**Dónde:** parado dentro de `proyecto-vcm`. Reemplaza la URL por la tuya del paso 12.

```bash
git remote set-url origin https://github.com/TU-USUARIO/proyecto-vcm.git
```

> Si diera error diciendo que no existe `origin`, usa `add` en lugar de `set-url`:
> ```bash
> git remote add origin https://github.com/TU-USUARIO/proyecto-vcm.git
> ```

### 13.1. Verificar que quedó bien apuntado

```bash
git remote -v
```

Debe mostrarte **exactamente** algo así (con tu usuario), apuntando a **tu**
repositorio en `fetch` y en `push`:

```text
origin  https://github.com/TU-USUARIO/proyecto-vcm.git (fetch)
origin  https://github.com/TU-USUARIO/proyecto-vcm.git (push)
```

Si ahí aún aparece `CarlosCabelloTroncoso`, el `set-url` no se aplicó: repite el
paso 13.

---

## 14. Subir el código (push)

**Dónde:** parado dentro de `proyecto-vcm`. Sube la rama `main`, que es la que Vercel
usa para publicar:

```bash
git push -u origin main
```

La **primera vez** que subes código, se abrirá la ventana **"Sign in to GitHub"**
para que inicies sesión. Sigue los pasos del **2.5 (b)**: pestaña **"Browser"** →
**"Sign in with your browser"** → inicia sesión → **"Authorize"**. Tu computador lo
recordará, así que no volverá a pedírtelo.

Cuando termine, entra a `https://github.com/TU-USUARIO/proyecto-vcm` en el navegador
y confirma que ahí aparecen los archivos del proyecto.

> A partir de ahora, cada vez que hagas cambios: los guardas con
> `git add .` → `git commit -m "descripción del cambio"` → `git push`. Cada push a
> `main` disparará una nueva publicación en Vercel (paso 18).

---

## 15. Crear el proyecto en Vercel

1. Entra a: https://vercel.com/new
2. En **Import Git Repository**, si es la primera vez, presiona **"Install"** /
   **"Add GitHub Account"** y autoriza a Vercel a ver tu repositorio.
3. Busca tu repositorio `proyecto-vcm` en la lista y presiona **"Import"**.
4. Vercel detecta solo la configuración desde el archivo `vercel.json` del proyecto:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/proyecto-vcm/browser`

   No cambies esos valores.

⛔ **Todavía no presiones "Deploy".** Primero configura las variables de entorno
(paso 16), o el primer despliegue fallará.

---

## 16. Configurar las variables de entorno en Vercel

En producción, las credenciales **no** salen de `environment.ts` (ese archivo no se
sube a Git). En su lugar, el script `scripts/set-env.js` genera ese archivo
**durante la compilación** usando dos variables que debes cargar en Vercel.

1. En la misma pantalla de importación, abre la sección **"Environment Variables"**.
   (Si ya creaste el proyecto, ve a **Project → Settings → Environment Variables**:
   `https://vercel.com/TU-USUARIO/proyecto-vcm/settings/environment-variables`).
2. Agrega estas **dos** variables. Son **exactamente los mismos dos valores** que
   pusiste en `environment.ts` en el paso 7, y que obtuviste del paso 6 en Supabase
   (**Project Settings → API**:
   `https://supabase.com/dashboard/project/_/settings/api`):

   | Name (nombre) | Value (valor) | ¿De dónde lo saco? |
   |---|---|---|
   | `SUPABASE_URL` | Tu **Project URL** (`https://....supabase.co`) | Del **paso 6** → campo *Project URL* |
   | `SUPABASE_KEY` | Tu **clave publicable / anon** (`sb_publishable_...`) | Del **paso 6** → *API Keys*, la clave `anon` / `public` |

   Para cada una: escribe el **Name**, pega el **Value**, deja marcados todos los
   entornos (Production, Preview, Development) y presiona **"Add"**.

   > 💡 Es el mismo par de valores que ya tienes en `src/environments/environment.ts`
   > (`supabaseUrl` y `supabaseKey`). Puedes copiarlos desde ahí si no quieres volver
   > a Supabase.

> ⚠️ Los nombres deben escribirse **exactamente** `SUPABASE_URL` y `SUPABASE_KEY`
> (en mayúsculas). Si faltan o están mal escritos, la compilación falla con un error
> de `set-env`.

3. Ahora sí, presiona **"Deploy"**. Vercel compilará y publicará la app. Al terminar,
   te dará una dirección pública del tipo:

   ```
   https://proyecto-vcm.vercel.app
   ```

   **Copia esa URL**, la necesitas en el paso 17.

---

## 17. Configurar las URLs de producción en Supabase

Igual que en local (paso 8), pero ahora con la URL real de Vercel, para que los
correos de confirmación, recuperación y reactivación funcionen en el sitio publicado.

1. Ve a **Authentication → URL Configuration**
   (`https://supabase.com/dashboard/project/_/auth/url-configuration`).
2. En **Site URL**, pon tu dirección de Vercel:

   ```
   https://proyecto-vcm.vercel.app
   ```

3. En **Redirect URLs**, presiona **"Add URL"** y agrega la dirección de Vercel con el
   mismo comodín `/**` (que cubre todas sus rutas de autenticación):

   ```
   https://proyecto-vcm.vercel.app/**
   ```

   > **No borres** la de local (`http://localhost:4200/**`): deja las dos, así te
   > sirve para desarrollo y para producción al mismo tiempo. Si usas las *Preview
   > Deployments* de Vercel, agrega además `https://*.vercel.app/**`.

4. Presiona **"Save"**. Con eso, tu lista queda con las dos líneas
   (`http://localhost:4200/**` y `https://proyecto-vcm.vercel.app/**`), que es todo
   lo necesario.

¡Listo! La app queda **publicada y funcionando**. Cada `git push` a `main` generará
automáticamente un nuevo despliegue en Vercel. 🚀

---
---

# PARTE C — REFERENCIA

## 18. Comandos útiles (resumen)

| Comando | ¿Para qué? | ¿Dónde se ejecuta? |
|---|---|---|
| `node -v` / `npm -v` / `git --version` | Verificar que los programas están instalados | Cualquier lugar |
| `git clone <url>` | Descargar el proyecto por primera vez | Carpeta donde lo quieras guardar |
| `cd proyecto-vcm` | Entrar a la carpeta del proyecto | — |
| `npm install` | Instalar las dependencias | Dentro de `proyecto-vcm` |
| `npm start` | Ejecutar en desarrollo (`http://localhost:4200`) | Dentro de `proyecto-vcm` |
| `npm run build` | Compilar para producción (`dist/proyecto-vcm/browser`) | Dentro de `proyecto-vcm` |
| `git remote -v` | Ver a qué repositorio apunta el proyecto | Dentro de `proyecto-vcm` |
| `git remote set-url origin <url>` | Cambiar el repositorio de destino | Dentro de `proyecto-vcm` |
| `git add .` | Marcar tus cambios para subir | Dentro de `proyecto-vcm` |
| `git commit -m "mensaje"` | Guardar los cambios con una descripción | Dentro de `proyecto-vcm` |
| `git push` | Subir los cambios a GitHub (dispara despliegue en Vercel) | Dentro de `proyecto-vcm` |
| `Ctrl + C` | Detener el servidor de desarrollo | En la terminal donde corre `npm start` |

---

## 19. Solución de problemas comunes

### Problemas en local

| Problema | Causa probable | Solución |
|---|---|---|
| Error de compilación: *no encuentra `environment`* | No creaste `src/environments/environment.ts` | Repite el **paso 7** (revisa la ruta y el nombre exactos) |
| La app carga pero no inicia sesión ni muestra datos | URL o clave de Supabase mal copiadas | Revisa los valores del **paso 6** y **7** (sin espacios de más) |
| `ng: command not found` | No tienes Angular CLI global | Usa `npm start` o `npx ng serve` en vez de `ng serve` |
| El puerto 4200 está ocupado | Otra instancia corriendo | `npx ng serve --port 4300` y abre `http://localhost:4300` |
| Errores raros tras `npm install` o al actualizar | Caché o `node_modules` inconsistente | Borra las carpetas `node_modules` y el archivo `package-lock.json`, y vuelve a `npm install` |
| Al ejecutar los SQL sale error de "relation does not exist" | Ejecutaste los archivos fuera de orden | Ejecuta **esquema → insert → policies** en ese orden (**paso 5.2**) |
| No llega el correo de confirmación/recuperación | Límite de correos por hora, o URL no permitida | Espera y reintenta; revisa que agregaste `http://localhost:4200/**` en **Redirect URLs** (**paso 8**) |
| El enlace del correo lleva a una página en blanco o error | Falta la Redirect URL o el `Site URL` | Revisa el **paso 8** (Site URL y Redirect URLs) |

### Problemas en producción (Vercel)

| Problema | Causa probable | Solución |
|---|---|---|
| El despliegue falla con error de `set-env` | Faltan o están mal escritas las variables | Revisa que existan `SUPABASE_URL` y `SUPABASE_KEY` (mayúsculas exactas) en Vercel (**paso 16**) |
| `git push` sube al repositorio equivocado | El remoto sigue apuntando al original | Corrige con `git remote set-url origin <tu-url>` y verifica con `git remote -v` (**paso 13**) |
| La app publicada carga pero no inicia sesión | Variables incorrectas o build antiguo | Corrige las variables (**paso 16**) y vuelve a desplegar (**Redeploy** en Vercel) |
| Recargar una página interna (F5) da error 404 | Faltarían los *rewrites* de SPA | Ya vienen en `vercel.json`; confirma que ese archivo está subido al repositorio |
| Los correos vuelven a `localhost` en el sitio publicado | El `Site URL` de Supabase quedó en local | Cambia el **Site URL** a la URL de Vercel (**paso 17**) |
| Cambié el código pero el sitio no se actualiza | No hiciste `git push`, o el push fue a otra rama | Haz `git push` a `main`; revisa en Vercel la pestaña **Deployments** |

---

*Manual de instalación — Sistema de Vinculación con el Medio, Universidad Católica del Maule.*
