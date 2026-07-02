# Especificación de Requisitos de Software (ERS)
## Sistema de Vinculación con el Medio — Universidad Católica del Maule

Documento basado en la estructura IEEE 830. Describe **qué** debe hacer el sistema
(requisitos funcionales) y **cómo** debe comportarse (requisitos no funcionales).

| | |
|---|---|
| Proyecto | Sistema de Vinculación con el Medio (VcM) — UCM |
| Versión del documento | 1.0 |
| Estado | Borrador para revisión |

---

## Índice

1. [Introducción](#1-introducción)
2. [Descripción general](#2-descripción-general)
3. [Requisitos funcionales](#3-requisitos-funcionales)
4. [Requisitos no funcionales](#4-requisitos-no-funcionales)
5. [Reglas de negocio y estados](#5-reglas-de-negocio-y-estados)
6. [Interfaces](#6-interfaces)

---

## 1. Introducción

### 1.1. Propósito
Especificar los requisitos funcionales y no funcionales del **Sistema de Vinculación
con el Medio (VcM)** de la Universidad Católica del Maule, una plataforma web para
gestionar el ciclo completo de una iniciativa de vinculación:
**solicitud → planteamiento → proyecto**.

### 1.2. Alcance
El sistema permite que distintos actores institucionales (cliente, encargado, profesor,
autoridad y administrador) registren, revisen, aprueben y ejecuten proyectos de
vinculación con el medio, con seguimiento por estados, gestión documental y reportes.
Es un sistema **100 % web**.

### 1.3. Definiciones y acrónimos

| Término | Significado |
|---|---|
| VcM | Vinculación con el Medio |
| Solicitud | Petición inicial de un cliente para un proyecto de vinculación |
| Planteamiento | Propuesta que un profesor hace a partir de una solicitud aprobada |
| Proyecto | Iniciativa en ejecución derivada de un planteamiento aprobado |
| Encargado / Gestor | Encargado de Vinculación por Carrera (rol `encargado`) |
| RF | Requisito Funcional |
| RNF | Requisito No Funcional |
| RLS | Row Level Security (seguridad a nivel de fila en la base de datos) |
| Soft-delete | Eliminación lógica: el registro se marca inactivo, no se borra |

### 1.4. Referencias
- Manual de instalación (`manualInstalacion/INSTALACION.md`)
- Manual de usuario (`manualUsuario/MANUAL-USUARIO.md`)
- Diagrama de casos de uso (`Diagrama UC VCM.mdj`, StarUML)

---

## 2. Descripción general

### 2.1. Perspectiva del producto
Aplicación web de una sola página (SPA) construida en **Angular 21**, con **Supabase**
como backend (base de datos PostgreSQL, autenticación, almacenamiento de archivos y
reglas de seguridad RLS). Se despliega en **Vercel**. No existe un servidor backend
propio: Supabase cumple ese rol.

### 2.2. Roles de usuario

| Rol | Descripción |
|---|---|
| **Cliente** | Crea y da seguimiento a sus solicitudes de proyecto |
| **Profesor** | Plantea y ejecuta proyectos a partir de solicitudes aprobadas |
| **Encargado** | Aprueba/rechaza solicitudes y planteamientos de su carrera; gestiona alumnos y reportes |
| **Autoridad** | Consulta solicitudes y reportes (solo lectura). Puede tener cargo (Director, Decano) |
| **Administrador** | Gestiona facultades, carreras, usuarios, alumnos y solicitudes |

### 2.3. Funciones generales del sistema
- Registro y autenticación de usuarios con confirmación por correo.
- Gestión del ciclo solicitud → planteamiento → proyecto con control por estados.
- Gestión documental (adjuntar y descargar archivos).
- Aprobación/rechazo por parte del encargado.
- Reportes con filtros e impresión a PDF.
- Administración de datos maestros (facultades, carreras, usuarios, alumnos).

### 2.4. Restricciones
- Requiere conexión a internet (backend en la nube).
- Navegador web moderno (Chrome, Edge, Firefox).
- La eliminación es **lógica** (soft-delete); no hay borrado físico de datos.

### 2.5. Supuestos y dependencias
- Disponibilidad del servicio Supabase (BD, Auth, Storage) y de Vercel (hosting).
- Cada usuario tiene un rol único asignado.
- Las credenciales de Supabase se configuran por variables de entorno en el despliegue.

---

## 3. Requisitos funcionales

> Referencia cruzada con los casos de uso del diagrama (columna **CDU**).

### 3.1. Autenticación y cuenta

| ID | Requisito | CDU |
|---|---|---|
| RF-01 | El sistema permitirá **registrar** un nuevo usuario (rol Cliente) con RUT o pasaporte, validando el RUT con dígito verificador (módulo 11). | CDU 02 |
| RF-02 | Al registrarse, el sistema enviará un **correo de confirmación**; la cuenta se activa al confirmar. | CDU 02 |
| RF-03 | El sistema permitirá **iniciar sesión** con correo y contraseña, redirigiendo al panel según el rol. | CDU 03 |
| RF-04 | El sistema permitirá **recuperar la contraseña** mediante un enlace enviado al correo. | CDU 04 |
| RF-05 | El usuario podrá **cerrar sesión** desde cualquier panel. | — |

### 3.2. Funciones comunes a todos los roles

| ID | Requisito | CDU |
|---|---|---|
| RF-06 | Todo usuario con sesión podrá **ver su pantalla de inicio** según su rol. | CDU 01, 05 |
| RF-07 | Todo usuario podrá **editar su perfil** (nombres, apellidos, teléfono). | CDU 50 |

### 3.3. Cliente

| ID | Requisito | CDU |
|---|---|---|
| RF-08 | El cliente podrá **crear una solicitud** (título, descripción, carrera, ciudad) y adjuntar archivos. | CDU 22 |
| RF-09 | El cliente podrá **ver sus solicitudes** con búsqueda y filtros (fecha, estado, carrera). | CDU 23 |
| RF-10 | El cliente podrá **editar una solicitud** solo mientras esté en estado *Pendiente*. | CDU 26 |
| RF-11 | El cliente podrá **eliminar una solicitud** propia (y sus archivos). | CDU 27 |
| RF-12 | El cliente podrá **desactivar su cuenta** (soft-delete) desde su perfil. | CDU 48 |
| RF-13 | El cliente podrá **reactivar su cuenta** mediante un enlace enviado a su correo. | CDU 49 |

### 3.4. Encargado (Gestor de Vinculación por Carrera)

| ID | Requisito | CDU |
|---|---|---|
| RF-14 | El encargado podrá **ver las solicitudes de su carrera** con filtros por estado y búsqueda. | CDU 24 |
| RF-15 | El encargado podrá **aprobar** una solicitud pendiente. | CDU 25 |
| RF-16 | El encargado podrá **rechazar** una solicitud pendiente. | CDU 25 |
| RF-17 | El encargado podrá **ver los planteamientos** de su carrera. | CDU 29 |
| RF-18 | El encargado podrá **aprobar/rechazar** un planteamiento pendiente. | CDU 33 |
| RF-19 | El encargado podrá **gestionar proyectos**: cambiar su estado y ver su detalle. | CDU 39, 43 |
| RF-20 | El encargado podrá **crear, ver, editar y eliminar alumnos voluntarios** de su carrera. | CDU 18–21 |
| RF-21 | El encargado podrá **reactivar alumnos** inactivos de su carrera. | CDU 47 |
| RF-22 | El encargado podrá **generar reportes** con filtros por año/mes e imprimirlos a PDF. | CDU 40 |

### 3.5. Profesor

| ID | Requisito | CDU |
|---|---|---|
| RF-23 | El profesor podrá **ver las solicitudes aprobadas** de su carrera (disponibles / en proceso). | CDU 24 |
| RF-24 | El profesor podrá **crear un planteamiento** vinculado a una solicitud aprobada, con archivos. | CDU 28, 32 |
| RF-25 | El profesor podrá **editar un planteamiento** solo mientras esté *Pendiente*. | CDU 30 |
| RF-26 | El profesor podrá **eliminar un planteamiento** propio. | CDU 31 |
| RF-27 | El profesor podrá **crear un proyecto** desde un planteamiento aprobado, asignando alumnos y fechas. | CDU 36 |
| RF-28 | El profesor podrá **cambiar el estado** de un proyecto (disponible, en proceso, pausado, finalizado, cancelado). | CDU 39 |
| RF-29 | El profesor podrá **ver el detalle de un proyecto** (cliente, equipo, archivos). | CDU 43 |
| RF-30 | El profesor podrá **agregar y ver observaciones** de un proyecto. | CDU 41, 42 |

### 3.6. Autoridad

| ID | Requisito | CDU |
|---|---|---|
| RF-31 | La autoridad podrá **ver todas las solicitudes** (solo lectura) con filtros y detalle. | CDU 24 |
| RF-32 | La autoridad podrá **generar reportes** e imprimirlos a PDF. | CDU 40 |

### 3.7. Administrador

| ID | Requisito | CDU |
|---|---|---|
| RF-33 | El administrador podrá **crear, ver, editar y eliminar facultades**. | CDU 10–13 |
| RF-34 | El administrador podrá **reactivar facultades** inactivas. | CDU 44 |
| RF-35 | El administrador podrá **crear, ver, editar y eliminar carreras**. | CDU 14–17 |
| RF-36 | El administrador podrá **reactivar carreras** inactivas. | CDU 45 |
| RF-37 | El administrador podrá **crear, ver, editar y eliminar usuarios**, asignando rol y carrera/cargo. | CDU 06–09 |
| RF-38 | El administrador podrá **reactivar usuarios** inactivos. | CDU 46 |
| RF-39 | El administrador podrá **crear, ver, editar y eliminar alumnos voluntarios**. | CDU 18–21 |
| RF-40 | El administrador podrá **reactivar alumnos** inactivos. | CDU 47 |
| RF-41 | El administrador podrá **ver, editar y eliminar solicitudes** (no las crea). | CDU 24, 26, 27 |

> **Nota sobre reactivación:** en facultades, carreras y alumnos, al crear un registro con
> una clave ya existente inactiva (nombre o RUT), el sistema lo **reactiva** en lugar de
> duplicarlo. En usuarios, la reactivación se hace mediante la vista de inactivos.

---

## 4. Requisitos no funcionales

### 4.1. Seguridad
| ID | Requisito |
|---|---|
| RNF-01 | La autenticación se gestionará con Supabase Auth; las contraseñas nunca se almacenan en texto plano. |
| RNF-02 | El acceso a los datos estará controlado por **políticas RLS** según el rol del usuario. |
| RNF-03 | Cada rol solo podrá ver y modificar la información que le corresponde (p. ej., el encargado solo su carrera). |
| RNF-04 | La eliminación será **lógica** (soft-delete): no se borran datos físicamente. |
| RNF-05 | El RUT se validará con dígito verificador (módulo 11) al registrar usuarios y alumnos. |

### 4.2. Usabilidad
| ID | Requisito |
|---|---|
| RNF-06 | La interfaz será **web y responsiva** (escritorio y móvil), en **español**. |
| RNF-07 | Las acciones destructivas (eliminar) pedirán **confirmación** al usuario. |
| RNF-08 | El sistema mostrará mensajes claros de éxito o error en las operaciones. |

### 4.3. Rendimiento
| ID | Requisito |
|---|---|
| RNF-09 | Las vistas por rol se cargarán con **lazy loading** para reducir el tiempo de carga inicial. |
| RNF-10 | Las operaciones habituales (listar, crear, editar) responderán en pocos segundos bajo condiciones normales. |

### 4.4. Disponibilidad y despliegue
| ID | Requisito |
|---|---|
| RNF-11 | El sistema estará desplegado en la nube (**Vercel** para el frontend, **Supabase** para el backend). |
| RNF-12 | El despliegue se actualizará automáticamente al publicar cambios en la rama `main`. |

### 4.5. Compatibilidad y mantenibilidad
| ID | Requisito |
|---|---|
| RNF-13 | El sistema funcionará en navegadores modernos (Chrome, Edge, Firefox). |
| RNF-14 | El código seguirá una arquitectura de componentes **standalone** de Angular, organizada por rol. |
| RNF-15 | La configuración de credenciales se hará por **variables de entorno**, no incrustadas en el código versionado. |

---

## 5. Reglas de negocio y estados

### 5.1. Estados
- **Solicitud:** Pendiente → Aprobada → En Proceso → Cerrada (o Rechazada).
- **Planteamiento:** Pendiente → Aprobado → (Finalizado) — o Rechazado / Cancelado.
- **Proyecto:** Disponible → En proceso → Finalizado — con Pausado, Atrasado y Cancelado.

### 5.2. Reglas principales
- RN-01: Una solicitud solo puede editarla el cliente mientras esté **Pendiente**.
- RN-02: Un planteamiento solo puede editarlo el profesor mientras esté **Pendiente**.
- RN-03: Solo puede plantearse un proyecto sobre una solicitud **Aprobada**.
- RN-04: Al **crear un proyecto**, la solicitud vinculada pasa a **En Proceso**.
- RN-05: Al **finalizar un proyecto**, su planteamiento pasa a *Finalizado* y su solicitud a *Cerrada*.
- RN-06: Al **cancelar un proyecto**, su planteamiento pasa a *Cancelado*.
- RN-07: Un proyecto pasa automáticamente a **En proceso** al llegar su fecha de inicio, y a **Atrasado** si supera su fecha de término.
- RN-08: Cada solicitud/planteamiento pertenece a una **carrera**; el encargado y el profesor solo operan sobre la suya.

---

## 6. Interfaces

### 6.1. Interfaz de usuario
Interfaz web responsiva desarrollada con Angular + Tailwind CSS, con un panel distinto
por rol (navbar propio + contenido) y navegación por menús.

### 6.2. Interfaces de software
- **Supabase** (PostgreSQL, Auth, Storage, RLS) vía el SDK `@supabase/supabase-js`.
- **Vercel** para el despliegue del frontend.

### 6.3. Interfaces de hardware
Ninguna específica; se accede desde cualquier dispositivo con navegador web e internet.

---

*Especificación de Requisitos de Software — Sistema de Vinculación con el Medio, UCM.*
