import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Usuario, GestorVinculacion } from '../../../../interfaces/usuario.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { ModalDetalleGestor } from './modales/modal-detalle-gestor/modal-detalle-gestor';
import { ModalConfirmarAccion } from '../../../shared/modal-confirmar-accion/modal-confirmar-accion';

@Component({
  selector: 'app-ver-solicitudes',
  imports: [CommonModule, FormsModule, ModalDetalleGestor, ModalConfirmarAccion],
  templateUrl: './ver-solicitudes.html',
  styleUrl: './ver-solicitudes.css',
})
export class VerSolicitudes {

  /* ─── Sesión mock: gestor asignado a ICI ───────────────────── */
  readonly gestorActual: GestorVinculacion = { id_usuario: 10, id_carrera: 1 };

  /* ─── Catálogos ────────────────────────────────────────────── */
  estados: EstadoSolicitud[] = [
    { id_estado: 1, nombre_estado: 'Pendiente',   descripcion_estado: 'En espera de revisión'  },
    { id_estado: 2, nombre_estado: 'En revisión', descripcion_estado: 'Siendo evaluada'         },
    { id_estado: 3, nombre_estado: 'Aprobada',    descripcion_estado: 'Solicitud aceptada'      },
    { id_estado: 4, nombre_estado: 'Rechazada',   descripcion_estado: 'No cumple los criterios' },
    { id_estado: 5, nombre_estado: 'Cerrada',     descripcion_estado: 'Proceso finalizado'      },
  ];

  carreras: Carrera[] = [
    { id_carrera: 1,  nombre_carrera: 'Ingeniería Civil Informática', etiqueta_carrera: 'ICI',  id_facultad: 1 },
    { id_carrera: 2,  nombre_carrera: 'Ingeniería Civil Industrial',  etiqueta_carrera: 'ICIV', id_facultad: 1 },
    { id_carrera: 3,  nombre_carrera: 'Ingeniería Civil Biomédica',   etiqueta_carrera: 'ICBM', id_facultad: 1 },
    { id_carrera: 4,  nombre_carrera: 'Enfermería',                   etiqueta_carrera: 'ENF',  id_facultad: 2 },
    { id_carrera: 5,  nombre_carrera: 'Kinesiología',                 etiqueta_carrera: 'KIN',  id_facultad: 2 },
    { id_carrera: 6,  nombre_carrera: 'Derecho',                      etiqueta_carrera: 'DER',  id_facultad: 3 },
    { id_carrera: 7,  nombre_carrera: 'Administración de Empresas',   etiqueta_carrera: 'ADM',  id_facultad: 4 },
    { id_carrera: 8,  nombre_carrera: 'Contador Auditor',             etiqueta_carrera: 'CA',   id_facultad: 4 },
    { id_carrera: 9,  nombre_carrera: 'Pedagogía en Matemáticas',     etiqueta_carrera: 'PEM',  id_facultad: 5 },
    { id_carrera: 10, nombre_carrera: 'Bioquímica',                   etiqueta_carrera: 'BQM',  id_facultad: 6 },
  ];

  ciudades: Ciudad[] = [
    { id_ciudad: 1, nombre_ciudad: 'Talca'      },
    { id_ciudad: 2, nombre_ciudad: 'Santiago'   },
    { id_ciudad: 3, nombre_ciudad: 'Concepción' },
    { id_ciudad: 4, nombre_ciudad: 'Rancagua'   },
    { id_ciudad: 5, nombre_ciudad: 'Curicó'     },
  ];

  /* ─── Clientes mock (nombre para la tabla) ──────────────────── */
  clientes: Pick<Usuario, 'id_usuario' | 'nombres_usuario' | 'apellidos_usuario'>[] = [
    { id_usuario: 1, nombres_usuario: 'María',   apellidos_usuario: 'González López'  },
    { id_usuario: 2, nombres_usuario: 'Carlos',  apellidos_usuario: 'Ramírez Fuentes' },
    { id_usuario: 3, nombres_usuario: 'Ana',     apellidos_usuario: 'Muñoz Vera'      },
    { id_usuario: 4, nombres_usuario: 'Jorge',   apellidos_usuario: 'Soto Parra'      },
    { id_usuario: 5, nombres_usuario: 'Roberto', apellidos_usuario: 'Figueroa Díaz'   },
    { id_usuario: 6, nombres_usuario: 'Daniela', apellidos_usuario: 'Tapia Rojas'     },
  ];

  /* ─── Solicitudes de la carrera del gestor (ICI = 1) ────────── */
  solicitudes: Solicitud[] = [
    {
      id_solicitud: 1,  titulo_solicitud: 'Proyecto de vinculación comunitaria Maule',
      descripcion_solicitud: 'Se solicita apoyo técnico para desarrollo de software comunitario en la región del Maule, destinado a organizaciones sin fines de lucro.',
      fecha_creacion_solicitud: '2025-01-10', id_estado: 1, id_usuario: 1, id_carrera: 1, id_ciudad: 1,
    },
    {
      id_solicitud: 10, titulo_solicitud: 'Sistema de gestión municipal para Curicó',
      descripcion_solicitud: 'Desarrollo de plataforma digital integral para modernizar los servicios municipales de Curicó, incluyendo trámites en línea y atención ciudadana.',
      fecha_creacion_solicitud: '2025-03-22', id_estado: 1, id_usuario: 2, id_carrera: 1, id_ciudad: 5,
    },
    {
      id_solicitud: 18, titulo_solicitud: 'Plataforma de monitoreo medioambiental',
      descripcion_solicitud: 'Sistema web de monitoreo de indicadores ambientales para organizaciones de conservación de la región del Maule.',
      fecha_creacion_solicitud: '2026-05-01', id_estado: 1, id_usuario: 6, id_carrera: 1, id_ciudad: 3,
    },
    {
      id_solicitud: 11, titulo_solicitud: 'App móvil para servicios comunitarios',
      descripcion_solicitud: 'Aplicación móvil para conectar organizaciones comunitarias con voluntarios y profesionales universitarios de la región.',
      fecha_creacion_solicitud: '2025-02-15', id_estado: 3, id_usuario: 3, id_carrera: 1, id_ciudad: 2,
    },
    {
      id_solicitud: 12, titulo_solicitud: 'Portal web para PYME regional',
      descripcion_solicitud: 'Plataforma de comercio digital para pequeñas empresas del sector agroindustrial de la región del Maule.',
      fecha_creacion_solicitud: '2024-11-30', id_estado: 4, id_usuario: 4, id_carrera: 1, id_ciudad: 4,
    },
    {
      id_solicitud: 15, titulo_solicitud: 'Digitalización de trámites municipales Talca',
      descripcion_solicitud: 'Sistema integral para la digitalización de trámites y servicios ciudadanos de la municipalidad de Talca.',
      fecha_creacion_solicitud: '2024-08-12', id_estado: 3, id_usuario: 5, id_carrera: 1, id_ciudad: 1,
    },
  ];

  /* ─── Archivos adjuntos mock ────────────────────────────────── */
  archivos: Archivo[] = [
    { id_archivo: 10, nombre_archivo: 'propuesta_comunidad.pdf',       ruta_archivo: 'uploads/propuesta_comunidad.pdf',       tipo_archivo: 'pdf',  id_solicitud: 1,  id_planteamiento: null, id_proyecto: null },
    { id_archivo: 11, nombre_archivo: 'requerimientos_municipio.docx', ruta_archivo: 'uploads/requerimientos_municipio.docx', tipo_archivo: 'docx', id_solicitud: 10, id_planteamiento: null, id_proyecto: null },
    { id_archivo: 12, nombre_archivo: 'especificaciones_app.pdf',      ruta_archivo: 'uploads/especificaciones_app.pdf',      tipo_archivo: 'pdf',  id_solicitud: 11, id_planteamiento: null, id_proyecto: null },
    { id_archivo: 13, nombre_archivo: 'datos_monitoreo.xlsx',          ruta_archivo: 'uploads/datos_monitoreo.xlsx',          tipo_archivo: 'xlsx', id_solicitud: 18, id_planteamiento: null, id_proyecto: null },
  ];

  /* ─── Filtros ───────────────────────────────────────────────── */
  searchTerm   = '';
  filtroEstado = '';

  /* ─── Modales ───────────────────────────────────────────────── */
  mostrarModalDetalle  = false;
  mostrarModalAprobar  = false;
  mostrarModalRechazar = false;
  solicitudSeleccionada: Solicitud | null = null;

  /* ─── Lista filtrada ────────────────────────────────────────── */
  get solicitudesFiltradas(): Solicitud[] {
    let lista = this.solicitudes.filter(
      s => s.id_carrera === this.gestorActual.id_carrera
    );
    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t) ||
        this.getNombreCliente(s.id_usuario).toLowerCase().includes(t) ||
        this.getNombreEstado(s.id_estado).toLowerCase().includes(t)
      );
    }
    if (this.filtroEstado)
      lista = lista.filter(s => s.id_estado === +this.filtroEstado);

    return lista;
  }

  /* ─── Contadores ────────────────────────────────────────────── */
  get totalPendientes(): number {
    return this.solicitudes.filter(
      s => s.id_carrera === this.gestorActual.id_carrera && s.id_estado === 1
    ).length;
  }
  get totalAprobadas(): number {
    return this.solicitudes.filter(
      s => s.id_carrera === this.gestorActual.id_carrera && s.id_estado === 3
    ).length;
  }
  get totalRechazadas(): number {
    return this.solicitudes.filter(
      s => s.id_carrera === this.gestorActual.id_carrera && s.id_estado === 4
    ).length;
  }

  /* ─── Helpers visuales ──────────────────────────────────────── */
  getNombreCliente(idUsuario: number): string {
    const u = this.clientes.find(c => c.id_usuario === idUsuario);
    return u ? `${u.nombres_usuario} ${u.apellidos_usuario}` : '—';
  }

  getInicialCliente(idUsuario: number): string {
    return this.clientes.find(c => c.id_usuario === idUsuario)
      ?.nombres_usuario.charAt(0).toUpperCase() ?? '?';
  }

  getNombreEstado(id: number): string {
    return this.estados.find(e => e.id_estado === id)?.nombre_estado ?? '—';
  }

  getNombreCarrera(id: number): string {
    return this.carreras.find(c => c.id_carrera === id)?.nombre_carrera ?? '—';
  }

  getEtiquetaCarrera(id: number): string {
    return this.carreras.find(c => c.id_carrera === id)?.etiqueta_carrera ?? '—';
  }

  getNombreCiudad(id: number): string {
    return this.ciudades.find(c => c.id_ciudad === id)?.nombre_ciudad ?? '—';
  }

  getArchivosDeSolicitud(id: number): Archivo[] {
    return this.archivos.filter(a => a.id_solicitud === id);
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100   text-amber-700   border-amber-200',
      2: 'bg-sky-100     text-sky-700     border-sky-200',
      3: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      4: 'bg-red-100     text-red-700     border-red-200',
      5: 'bg-gray-100    text-gray-500    border-gray-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Acciones ──────────────────────────────────────────────── */
  abrirDetalle(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalDetalle   = true;
  }

  abrirConfirmarAprobar(solicitud: Solicitud): void {
    this.mostrarModalDetalle  = false;
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalAprobar  = true;
  }

  abrirConfirmarRechazar(solicitud: Solicitud): void {
    this.mostrarModalDetalle   = false;
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalRechazar  = true;
  }

  confirmarAprobar(): void {
    if (!this.solicitudSeleccionada) return;
    const idx = this.solicitudes.findIndex(
      s => s.id_solicitud === this.solicitudSeleccionada!.id_solicitud
    );
    if (idx !== -1)
      this.solicitudes[idx] = { ...this.solicitudes[idx], id_estado: 3 };
    this.cerrarModales();
  }

  confirmarRechazar(): void {
    if (!this.solicitudSeleccionada) return;
    const idx = this.solicitudes.findIndex(
      s => s.id_solicitud === this.solicitudSeleccionada!.id_solicitud
    );
    if (idx !== -1)
      this.solicitudes[idx] = { ...this.solicitudes[idx], id_estado: 4 };
    this.cerrarModales();
  }

  cerrarModales(): void {
    this.mostrarModalDetalle  = false;
    this.mostrarModalAprobar  = false;
    this.mostrarModalRechazar = false;
    this.solicitudSeleccionada = null;
  }

  limpiarFiltros(): void {
    this.searchTerm = this.filtroEstado = '';
  }
}
