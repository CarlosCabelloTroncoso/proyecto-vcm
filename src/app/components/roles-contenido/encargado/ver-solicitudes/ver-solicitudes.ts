import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetalleSolicitud } from '../../../shared/modal-detalle-solicitud/modal-detalle-solicitud';
import { ModalConfirmarAccion } from '../../../shared/modal-confirmar-accion/modal-confirmar-accion';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Usuario, EncargadoCarrera } from '../../../../interfaces/usuario.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';

@Component({
  selector: 'app-ver-solicitudes',
  imports: [CommonModule, FormsModule, ModalDetalleSolicitud, ModalConfirmarAccion],
  templateUrl: './ver-solicitudes.html',
  styleUrl: './ver-solicitudes.css',
})
export class VerSolicitudes {

  /* ─── Sesión mock: encargado de ICI ────────────────────────── */
  readonly encargadoActual: EncargadoCarrera = { id_usuario: 30, id_carrera: 1 };

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

  /* ─── Clientes mock ─────────────────────────────────────────── */
  clientes: Pick<Usuario, 'id_usuario' | 'nombres_usuario' | 'apellidos_usuario'>[] = [
    { id_usuario: 1, nombres_usuario: 'María',   apellidos_usuario: 'González López'  },
    { id_usuario: 2, nombres_usuario: 'Carlos',  apellidos_usuario: 'Ramírez Fuentes' },
    { id_usuario: 3, nombres_usuario: 'Ana',     apellidos_usuario: 'Muñoz Vera'      },
    { id_usuario: 4, nombres_usuario: 'Jorge',   apellidos_usuario: 'Soto Parra'      },
    { id_usuario: 5, nombres_usuario: 'Roberto', apellidos_usuario: 'Figueroa Díaz'   },
    { id_usuario: 6, nombres_usuario: 'Daniela', apellidos_usuario: 'Tapia Rojas'     },
  ];

  /* ─── Solicitudes de la carrera del encargado ───────────────── */
  solicitudes: Solicitud[] = [
    {
      id_solicitud: 1,  titulo_solicitud: 'App móvil para servicios comunitarios',
      descripcion_solicitud: 'Aplicación móvil para conectar organizaciones comunitarias con voluntarios y profesionales universitarios de la región.',
      fecha_creacion_solicitud: '2025-02-15', id_estado: 1, id_usuario: 3, id_carrera: 1, id_ciudad: 2,
    },
    {
      id_solicitud: 2,  titulo_solicitud: 'Sistema de gestión de residuos urbanos',
      descripcion_solicitud: 'Plataforma para optimizar la recolección y clasificación de residuos sólidos en comunas de la región del Maule.',
      fecha_creacion_solicitud: '2025-04-10', id_estado: 1, id_usuario: 2, id_carrera: 1, id_ciudad: 1,
    },
    {
      id_solicitud: 3,  titulo_solicitud: 'Portal educativo para comunidades rurales',
      descripcion_solicitud: 'Plataforma de acceso a contenidos educativos para estudiantes de zonas rurales con conectividad limitada.',
      fecha_creacion_solicitud: '2025-05-22', id_estado: 1, id_usuario: 4, id_carrera: 1, id_ciudad: 5,
    },
    {
      id_solicitud: 11, titulo_solicitud: 'Digitalización de trámites municipales Talca',
      descripcion_solicitud: 'Sistema integral para la digitalización de trámites y servicios ciudadanos de la municipalidad de Talca.',
      fecha_creacion_solicitud: '2024-08-12', id_estado: 3, id_usuario: 5, id_carrera: 1, id_ciudad: 1,
    },
    {
      id_solicitud: 20, titulo_solicitud: 'Portal de transparencia ciudadana',
      descripcion_solicitud: 'Plataforma web para la publicación y consulta de información pública de organismos municipales de la región del Maule.',
      fecha_creacion_solicitud: '2026-03-05', id_estado: 3, id_usuario: 6, id_carrera: 1, id_ciudad: 1,
    },
    {
      id_solicitud: 7,  titulo_solicitud: 'Sistema de monitoreo de calidad del agua',
      descripcion_solicitud: 'Red de sensores y plataforma de análisis de datos para el monitoreo de calidad del agua en cauces de la región.',
      fecha_creacion_solicitud: '2024-11-03', id_estado: 4, id_usuario: 1, id_carrera: 1, id_ciudad: 3,
    },
  ];

  /* ─── Archivos adjuntos mock ────────────────────────────────── */
  archivos: Archivo[] = [
    { id_archivo: 1, nombre_archivo: 'propuesta_app.pdf',         ruta_archivo: 'uploads/propuesta_app.pdf',         tipo_archivo: 'pdf',  id_solicitud: 1,  id_planteamiento: null, id_proyecto: null },
    { id_archivo: 2, nombre_archivo: 'especificaciones_app.docx', ruta_archivo: 'uploads/especificaciones_app.docx', tipo_archivo: 'docx', id_solicitud: 1,  id_planteamiento: null, id_proyecto: null },
    { id_archivo: 3, nombre_archivo: 'diagrama_portal.png',       ruta_archivo: 'uploads/diagrama_portal.png',       tipo_archivo: 'png',  id_solicitud: 20, id_planteamiento: null, id_proyecto: null },
  ];

  /* ─── Filtro activo y búsqueda ──────────────────────────────── */
  filtroActivo: 'pendiente' | 'aprobada' | 'rechazada' = 'pendiente';
  searchTerm = '';

  /* ─── Estado modales ────────────────────────────────────────── */
  mostrarModalDetalle   = false;
  mostrarModalAprobar   = false;
  mostrarModalRechazar  = false;
  solicitudSeleccionada: Solicitud | null = null;
  solicitudAccion:       Solicitud | null = null;

  /* ─── Lista filtrada ────────────────────────────────────────── */
  get solicitudesFiltradas(): Solicitud[] {
    const estadoId = { pendiente: 1, aprobada: 3, rechazada: 4 }[this.filtroActivo];

    let lista = this.solicitudes.filter(
      s => s.id_carrera === this.encargadoActual.id_carrera && s.id_estado === estadoId
    );

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t) ||
        this.getNombreCliente(s.id_usuario).toLowerCase().includes(t)
      );
    }

    return lista;
  }

  get contadorPorEstado(): Record<string, number> {
    const base = this.solicitudes.filter(s => s.id_carrera === this.encargadoActual.id_carrera);
    return {
      pendiente: base.filter(s => s.id_estado === 1).length,
      aprobada:  base.filter(s => s.id_estado === 3).length,
      rechazada: base.filter(s => s.id_estado === 4).length,
    };
  }

  /* ─── Helpers ───────────────────────────────────────────────── */
  getNombreCliente(id: number): string {
    const u = this.clientes.find(c => c.id_usuario === id);
    return u ? `${u.nombres_usuario} ${u.apellidos_usuario}` : '—';
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
      5: 'bg-gray-100    text-gray-600    border-gray-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Acciones modal detalle ────────────────────────────────── */
  abrirDetalle(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalDetalle   = true;
  }

  cerrarDetalle(): void {
    this.mostrarModalDetalle   = false;
    this.solicitudSeleccionada = null;
  }

  /* ─── Acciones aprobar / rechazar ───────────────────────────── */
  abrirAprobar(solicitud: Solicitud): void {
    this.solicitudAccion     = solicitud;
    this.mostrarModalAprobar = true;
  }

  abrirRechazar(solicitud: Solicitud): void {
    this.solicitudAccion      = solicitud;
    this.mostrarModalRechazar = true;
  }

  confirmarAprobar(): void {
    if (this.solicitudAccion) {
      const idx = this.solicitudes.findIndex(s => s.id_solicitud === this.solicitudAccion!.id_solicitud);
      if (idx !== -1) this.solicitudes[idx] = { ...this.solicitudes[idx], id_estado: 3 };
    }
    this.mostrarModalAprobar = false;
    this.solicitudAccion     = null;
  }

  confirmarRechazar(): void {
    if (this.solicitudAccion) {
      const idx = this.solicitudes.findIndex(s => s.id_solicitud === this.solicitudAccion!.id_solicitud);
      if (idx !== -1) this.solicitudes[idx] = { ...this.solicitudes[idx], id_estado: 4 };
    }
    this.mostrarModalRechazar = false;
    this.solicitudAccion      = null;
  }

  cancelarAccion(): void {
    this.mostrarModalAprobar  = false;
    this.mostrarModalRechazar = false;
    this.solicitudAccion      = null;
  }
}
