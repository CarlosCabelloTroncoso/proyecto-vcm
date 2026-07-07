# Manual de Usuario — Sistema de Vinculación con el Medio (UCM)

Este manual describe **todo lo que puede hacer cada tipo de usuario** en el sistema.
Está organizado por rol y, dentro de cada rol, por pantalla y acción. Cada acción
indica **qué hace**, los **pasos** para realizarla y el **resultado** esperado.

> Para cada acción se indica su tipo entre paréntesis:
> **(C)** Crear · **(L)** Leer/Consultar · **(A)** Actualizar/Editar · **(E)** Eliminar.
> Este manual también sirve de guion para grabar el video de demostración: cada
> acción listada corresponde a una escena.

---
# LINK VIDEO DEL MANUAL DE USUARIO
> https://drive.google.com/file/d/1K7n-6n631I7IHgC_aerVrMdbT1Vr_Lem/view?usp=sharing

---

## Índice

1. [Roles del sistema](#1-roles-del-sistema)
2. [Acceso al sistema (sin sesión)](#2-acceso-al-sistema-sin-sesión)
3. [Rol: Cliente](#3-rol-cliente)
4. [Rol: Profesor](#4-rol-profesor)
5. [Rol: Encargado de Vinculación (Gestor)](#5-rol-encargado-de-vinculación-gestor)
6. [Rol: Autoridad](#6-rol-autoridad)
7. [Rol: Administrador](#7-rol-administrador)
8. [Acciones comunes a todos los roles](#8-acciones-comunes-a-todos-los-roles)
9. [Estados y flujo del proceso](#9-estados-y-flujo-del-proceso)

---

## 1. Roles del sistema

El sistema tiene **5 roles**. Cada uno entra a su propio panel según el rol asignado
a su cuenta.

| Rol | Nombre visible | Función principal |
|---|---|---|
| `cliente` | Cliente | Crea y da seguimiento a sus solicitudes de proyecto |
| `profesor` | Profesor | Plantea y ejecuta proyectos a partir de solicitudes aprobadas |
| `encargado` | Encargado de Vinculación (Gestor) | Aprueba/rechaza solicitudes y planteamientos de su carrera; gestiona alumnos y reportes |
| `autoridad` | Autoridad | Consulta solicitudes y reportes (solo lectura) |
| `admin` | Administrador | Gestiona facultades, carreras, usuarios, alumnos y solicitudes |

> El **Encargado** también se llama **Gestor de Vinculación por Carrera**: es el mismo rol.

---

## 2. Acceso al sistema (sin sesión)

Estas acciones están disponibles **antes de iniciar sesión**, desde la página pública.

### 2.1. Registrarse (C)
Crea una cuenta nueva (rol Cliente por defecto).

**Pasos:**
1. En la página de inicio, entrar a **Registro**.
2. Elegir tipo de documento: **RUT** o **Pasaporte**.
   - Si es RUT, el sistema valida el dígito verificador (módulo 11).
3. Completar nombres, apellidos, teléfono, correo y contraseña (mínimo 6 caracteres).
4. Confirmar la contraseña y presionar **Registrarse**.

**Resultado:** se crea la cuenta y se envía un **correo de confirmación**. El usuario
debe abrir el correo y hacer clic en el enlace para **activar la cuenta** antes de
poder iniciar sesión.

### 2.2. Iniciar sesión (L)
**Pasos:**
1. Entrar a **Iniciar sesión**.
2. Ingresar correo y contraseña.
3. Presionar **Ingresar**.

**Resultado:** el sistema identifica el rol y redirige al panel correspondiente.

### 2.3. Recuperar contraseña (A)
**Pasos:**
1. En la pantalla de login, entrar a **¿Olvidaste tu contraseña?**
2. Ingresar el correo y enviar.
3. Abrir el correo recibido y hacer clic en el enlace.
4. Escribir la nueva contraseña y guardar.

**Resultado:** la contraseña queda actualizada y se puede iniciar sesión con ella.

### 2.4. Reactivar una cuenta desactivada (A)
Si un usuario desactivó su cuenta y quiere volver, solicita un enlace de reactivación
por correo.

**Pasos:**
1. Solicitar el enlace de reactivación con su correo.
2. Abrir el correo y hacer clic en el enlace de un solo uso.

**Resultado:** la cuenta se reactiva y el usuario recupera el acceso.

---

## 3. Rol: Cliente

El cliente crea solicitudes de proyecto y les da seguimiento.

### 3.1. Inicio
Pantalla de bienvenida con accesos rápidos.

### 3.2. Crear solicitud (C)
**Pasos:**
1. Ir a **Crear solicitud**.
2. Completar título y descripción.
3. Seleccionar la **carrera** y la **ciudad**.
4. (Opcional) Adjuntar archivos arrastrándolos o seleccionándolos
   (PDF, Word, Excel, imágenes; máx. 10 MB por archivo).
5. Presionar **Enviar / Guardar**.

**Resultado:** la solicitud se crea en estado **Pendiente** y se abre su detalle.

### 3.3. Ver mis solicitudes (L)
**Pasos:**
1. Ir a **Mis solicitudes**.
2. Usar el **buscador** o los **filtros** (por fecha, estado o carrera).
3. Presionar **Ver** para abrir el detalle de una solicitud (incluye sus archivos).

**Resultado:** se listan únicamente las solicitudes propias del cliente.

### 3.4. Editar solicitud (A)
Solo se pueden editar solicitudes en estado **Pendiente**.

**Pasos:**
1. En **Mis solicitudes**, presionar **Editar** en una solicitud pendiente.
2. Modificar los campos y/o agregar/quitar archivos.
3. Guardar los cambios.

**Resultado:** la solicitud queda actualizada.

### 3.5. Eliminar solicitud (E)
**Pasos:**
1. En **Mis solicitudes**, presionar **Eliminar**.
2. Confirmar en la ventana de confirmación.

**Resultado:** se elimina la solicitud junto con sus archivos adjuntos.

### 3.6. Editar perfil y desactivar cuenta
Ver [Acciones comunes](#8-acciones-comunes-a-todos-los-roles).

---

## 4. Rol: Profesor

El profesor toma solicitudes **aprobadas** de su carrera, crea planteamientos y luego
proyectos.

### 4.1. Inicio
Pantalla de bienvenida del profesor.

### 4.2. Ver solicitudes disponibles (L)
**Pasos:**
1. Ir a **Solicitudes**.
2. Alternar entre **Disponibles** y **En proceso**.
3. Buscar o filtrar por año/mes.
4. Presionar **Ver** para el detalle, o ver los **datos del cliente**.

**Resultado:** se muestran las solicitudes aprobadas de su carrera. Las que ya tienen
un planteamiento aprobado aparecen marcadas como ocupadas.

### 4.3. Realizar un planteamiento desde una solicitud (C)
**Pasos:**
1. En una solicitud disponible, presionar **Realizar planteamiento**.
2. El sistema lleva a **Planteamientos** con la solicitud ya seleccionada.
3. Completar el formulario (ver 4.4).

### 4.4. Crear planteamiento (C)
**Pasos:**
1. Ir a **Planteamientos** → **Crear Planteamiento**.
2. Seleccionar la **solicitud vinculada** (aprobada).
3. Completar título, descripción y **tiempo estimado** (valor + unidad: días/semanas/meses).
4. (Opcional) Adjuntar archivos.
5. Presionar **Crear planteamiento**.

**Resultado:** el planteamiento se crea en estado **Pendiente**, a la espera de que el
encargado lo apruebe.

### 4.5. Editar planteamiento (A)
Solo se puede editar mientras está **Pendiente**.

**Pasos:**
1. En **Planteamientos**, filtro **Pendientes**, presionar **Editar**.
2. Modificar los campos y guardar.

### 4.6. Eliminar planteamiento (E)
**Pasos:**
1. En **Planteamientos** (pendiente), presionar **Eliminar**.
2. Confirmar.

**Resultado:** el planteamiento se elimina (queda inactivo).

### 4.7. Ver detalle de un planteamiento (L)
Presionar **Ver** para abrir el detalle, con los archivos de la solicitud y del
planteamiento.

### 4.8. Crear proyecto desde un planteamiento aprobado (C)
**Pasos:**
1. En **Planteamientos**, en uno **Aprobado**, presionar **Crear Proyecto**.
2. En el formulario de proyecto: definir **fecha de inicio** y **fecha de término**
   (el sistema limita la fecha de término según el tiempo estimado).
3. Agregar los **alumnos** del equipo (hasta 5, filtrados por la carrera).
4. (Opcional) Adjuntar archivos.
5. Presionar **Crear**.

**Resultado:** el proyecto se crea en estado **Disponible** y la solicitud vinculada
pasa a **En Proceso**.

### 4.9. Cambiar el estado de un proyecto (A)
**Pasos:**
1. Ir a **Proyectos** y ubicar el proyecto.
2. En el selector de estado, elegir el nuevo estado: **Disponible, En proceso,
   Pausado, Finalizado o Cancelado**.

**Reglas automáticas:**
- Un proyecto **Disponible** pasa solo a **En proceso** cuando llega su fecha de inicio.
- Pasa a **Atrasado** automáticamente si se vence la fecha de término.
- Al **Finalizar**, el planteamiento y la solicitud vinculada también se cierran.
- Al **Cancelar**, el planteamiento asociado se marca como Cancelado.

### 4.10. Ver detalle del proyecto y agregar observaciones (L / C)
**Pasos:**
1. En **Proyectos**, abrir un proyecto (**Ver detalle**).
2. Revisar información, **datos del cliente**, **equipo** (alumnos) y **archivos**
   (se pueden descargar).
3. En **Observaciones**, escribir una nota y presionar **Agregar observación**
   (disponible mientras el proyecto no esté finalizado ni cancelado).

### 4.11. Editar perfil y desactivar cuenta
Ver [Acciones comunes](#8-acciones-comunes-a-todos-los-roles).

---

## 5. Rol: Encargado de Vinculación (Gestor)

El encargado revisa y decide sobre las solicitudes y planteamientos **de su carrera**,
gestiona los alumnos voluntarios y consulta reportes.

### 5.1. Inicio
Pantalla de bienvenida del encargado.

### 5.2. Ver solicitudes de la carrera (L)
**Pasos:**
1. Ir a **Ver solicitudes**.
2. Filtrar por estado (**Pendiente, Aprobada, En proceso, Rechazada, Cerrado**) o buscar.
3. Presionar **Ver** para el detalle o ver **datos del cliente**.

### 5.3. Aprobar una solicitud (A)
**Pasos:**
1. En una solicitud **Pendiente**, presionar **Aprobar**.
2. Confirmar en la ventana.

**Resultado:** la solicitud pasa a **Aprobada** y queda disponible para los profesores
de esa carrera.

### 5.4. Rechazar una solicitud (A)
**Pasos:**
1. En una solicitud **Pendiente**, presionar **Rechazar**.
2. Confirmar.

**Resultado:** la solicitud pasa a **Rechazada**.

### 5.5. Ver planteamientos de la carrera (L)
**Pasos:**
1. Ir a **Gestión de planteamientos**.
2. Filtrar por estado (Pendiente, Aprobado, Rechazado, Cancelado, Finalizado) o buscar.
3. Presionar **Ver** para el detalle.

### 5.6. Aprobar un planteamiento (A)
**Pasos:**
1. En un planteamiento **Pendiente**, presionar **Aprobar** y confirmar.

**Resultado:** el planteamiento pasa a **Aprobado** y el profesor ya puede crear el
proyecto.

### 5.7. Rechazar un planteamiento (A)
**Pasos:**
1. En un planteamiento **Pendiente**, presionar **Rechazar** y confirmar.

**Resultado:** el planteamiento pasa a **Rechazado**.

### 5.8. Gestión de proyectos (L / A)
**Pasos:**
1. Ir a **Gestión de proyectos**.
2. Filtrar por estado.
3. **Cambiar el estado** de un proyecto (igual que el profesor, incluyendo finalizar y
   cancelar en cascada).
4. Abrir el **detalle** del planteamiento o del proyecto.

### 5.9. Gestión de alumnos voluntarios (CRUD)
Los alumnos se administran por carrera.

- **Crear alumno (C):** **Alumnos → Crear**, completar RUT, nombres, apellidos, correo,
  teléfono y carrera; guardar. Si el RUT corresponde a un alumno **inactivo**, se
  **reactiva** automáticamente en vez de duplicarse.
- **Ver/buscar alumnos (L):** listado con búsqueda y filtro por carrera.
- **Editar alumno (A):** **Editar**, modificar datos y guardar.
- **Eliminar alumno (E):** **Eliminar** y confirmar (queda inactivo).
- **Reactivar alumno (A):** cambiar a la pestaña **Inactivos** y presionar **Reactivar**.

### 5.10. Reportes (L)
**Pasos:**
1. Ir a **Reportes**.
2. Filtrar por **año** y **mes** (o dejar todo el período).
3. Revisar los contadores de solicitudes, planteamientos y proyectos por estado.
4. Presionar **Imprimir** para generar un PDF.

### 5.11. Editar perfil y desactivar cuenta
Ver [Acciones comunes](#8-acciones-comunes-a-todos-los-roles).

---

## 6. Rol: Autoridad

La autoridad tiene acceso de **solo lectura**: consulta información y reportes, pero no
modifica datos.

### 6.1. Inicio
Pantalla de bienvenida de la autoridad.

### 6.2. Ver solicitudes (L)
**Pasos:**
1. Ir a **Ver solicitudes**.
2. Filtrar por estado o buscar por título, cliente o carrera.
3. Abrir el **detalle** de una solicitud o los **datos del cliente**.

### 6.3. Reportes (L)
**Pasos:**
1. Ir a **Reportes**.
2. Filtrar por año/mes.
3. Revisar los contadores por estado y presionar **Imprimir** para el PDF.

### 6.4. Editar perfil y desactivar cuenta
Ver [Acciones comunes](#8-acciones-comunes-a-todos-los-roles).

---

## 7. Rol: Administrador

El administrador gestiona los datos maestros del sistema.

### 7.1. Inicio
Panel principal del administrador.

> **Nota sobre eliminar/reactivar:** en facultades, carreras, usuarios y alumnos, "eliminar"
> **no borra**: deja el registro **inactivo**. Cada pantalla tiene una pestaña
> **Activas/Inactivas** con un botón **Reactivar**. Además, en facultades, carreras y
> alumnos, si al **crear** ingresas un registro que ya existe inactivo (mismo nombre o RUT),
> el sistema lo **reactiva** en vez de duplicarlo.

### 7.2. Gestión de facultades (CRUD)
- **Crear (C):** **Gestión de facultades → Crear**, ingresar nombre y etiqueta; guardar.
- **Ver/buscar (L):** listado con búsqueda y filtro por etiqueta.
- **Editar (A):** **Editar**, modificar y guardar.
- **Eliminar (E):** **Eliminar** y confirmar (queda inactiva).
- **Reactivar (A):** en la pestaña **Inactivas**, presionar **Reactivar**.

### 7.3. Gestión de carreras (CRUD)
- **Crear (C):** ingresar nombre, etiqueta y **facultad** asociada; guardar.
- **Ver/buscar (L):** listado con búsqueda y filtros por etiqueta o facultad.
- **Editar (A):** modificar y guardar.
- **Eliminar (E):** eliminar y confirmar.
- **Reactivar (A):** en la pestaña **Inactivas**, presionar **Reactivar**.

### 7.4. Gestión de usuarios (CRUD)
- **Crear usuario (C):**
  1. **Gestión de usuarios → Crear**.
  2. Ingresar correo, contraseña, RUT, nombres, apellidos, teléfono y **rol**.
  3. Según el rol, indicar la **carrera** (encargado/profesor) o el **cargo** (autoridad).
  4. Guardar.
  - El sistema crea la cuenta de acceso, confirma el correo automáticamente y registra
    al usuario con su rol.
- **Ver/buscar (L):** listado con búsqueda y filtros por rol, estado o fecha.
- **Editar usuario (A):** modificar datos, **cambiar el rol** y/o la **carrera** asociada.
- **Eliminar usuario (E):** **Eliminar** y confirmar (queda inactivo).
- **Reactivar usuario (A):** en la pestaña **Inactivos**, presionar **Reactivar**. Vuelve a
  activo y puede iniciar sesión con su misma cuenta. *(A diferencia de las otras pantallas,
  aquí no se reactiva al recrear: se usa el botón.)*

### 7.5. Gestión de alumnos (CRUD)
- **Crear (C):** RUT, nombres, apellidos, correo, teléfono y carrera; guardar. Si el RUT
  corresponde a un alumno **inactivo**, se **reactiva** en vez de duplicarse.
- **Ver/buscar (L):** listado con búsqueda y filtro por carrera.
- **Editar (A):** modificar y guardar.
- **Eliminar (E):** eliminar y confirmar.
- **Reactivar (A):** en la pestaña **Inactivos**, presionar **Reactivar**.

### 7.6. Solicitudes (L / A / E)
El administrador **no crea** solicitudes, pero puede revisarlas, editarlas y eliminarlas.
- **Ver/buscar (L):** listado con búsqueda y filtros (fecha, estado, carrera); detalle
  y datos del cliente.
- **Editar (A):** modificar título, descripción, estado, carrera y ciudad.
- **Eliminar (E):** eliminar y confirmar.

### 7.7. Editar perfil
Ver [Acciones comunes](#8-acciones-comunes-a-todos-los-roles).

---

## 8. Acciones comunes a todos los roles

### 8.1. Editar perfil (A)
**Pasos:**
1. Entrar a **Perfil**.
2. Presionar **Editar**.
3. Modificar nombres, apellidos y/o teléfono.
4. Guardar.

**Resultado:** los datos del perfil quedan actualizados.

### 8.2. Desactivar cuenta (E)
Disponible para los roles que lo permiten desde su perfil.

**Pasos:**
1. En **Perfil**, presionar **Desactivar cuenta**.
2. Confirmar en la ventana.

**Resultado:** la cuenta se desactiva (soft-delete) y se cierra la sesión. Se puede
recuperar más tarde con el enlace de reactivación por correo (ver 2.4).

### 8.3. Cerrar sesión (L)
**Pasos:**
1. Desde el menú/navbar, presionar **Cerrar sesión**.

**Resultado:** se cierra la sesión y vuelve a la pantalla de login.

---

## 9. Estados y flujo del proceso

Entender los estados ayuda a seguir el ciclo completo de un proyecto.

### Solicitud
`Pendiente` → `Aprobada` → `En Proceso` → `Cerrada`
(o `Rechazada` si el encargado la rechaza)

- **Pendiente:** recién creada por el cliente.
- **Aprobada:** aprobada por el encargado; visible para los profesores de la carrera.
- **En Proceso:** ya tiene un proyecto en marcha.
- **Cerrada:** el proyecto asociado se finalizó.
- **Rechazada:** el encargado no la aprobó.

### Planteamiento
`Pendiente` → `Aprobado` → (`Finalizado`)
(o `Rechazado` / `Cancelado`)

- **Pendiente:** creado por el profesor.
- **Aprobado:** aprobado por el encargado; habilita crear el proyecto.
- **Rechazado / Cancelado / Finalizado:** según avance el proyecto.

### Proyecto
`Disponible` → `En proceso` → `Finalizado`
(estados adicionales: `Pausado`, `Atrasado`, `Cancelado`)

- **Disponible:** recién creado.
- **En proceso:** inicia al llegar la fecha de inicio.
- **Pausado:** detenido temporalmente.
- **Atrasado:** se venció la fecha de término sin finalizar.
- **Finalizado:** terminado (cierra el planteamiento y la solicitud).
- **Cancelado:** cancelado (también cancela el planteamiento).

---

*Manual de Usuario — Sistema de Vinculación con el Medio, Universidad Católica del Maule.*
