import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { ModalSolicitudForm } from './modales/modal-solicitud-form/modal-solicitud-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';

@Component({
  selector: 'app-solicitudes',
  imports: [CommonModule, FormsModule, ModalSolicitudForm, ModalConfirmar],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes {

  /* ─── Estados de solicitud ─────────────────────────────────── */
  estados: EstadoSolicitud[] = [
    { id_estado: 1, nombre_estado: 'Pendiente',   descripcion_estado: 'En espera de revisión'   },
    { id_estado: 2, nombre_estado: 'En revisión', descripcion_estado: 'Siendo evaluada'          },
    { id_estado: 3, nombre_estado: 'Aprobada',    descripcion_estado: 'Solicitud aceptada'       },
    { id_estado: 4, nombre_estado: 'Rechazada',   descripcion_estado: 'Solicitud no aceptada'    },
    { id_estado: 5, nombre_estado: 'Cerrada',     descripcion_estado: 'Proceso finalizado'       },
  ];

  /* ─── Carreras de referencia ───────────────────────────────── */
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

  /* ─── Ciudades de referencia ───────────────────────────────── */
  ciudades: Ciudad[] = [
    { id_ciudad: 1, nombre_ciudad: 'Talca'      },
    { id_ciudad: 2, nombre_ciudad: 'Santiago'   },
    { id_ciudad: 3, nombre_ciudad: 'Concepción' },
    { id_ciudad: 4, nombre_ciudad: 'Rancagua'   },
    { id_ciudad: 5, nombre_ciudad: 'Curicó'     },
  ];

  /* ─── Datos mock ───────────────────────────────────────────── */
  solicitudes: Solicitud[] = [
    {
      id_solicitud: 1, titulo_solicitud: 'Proyecto de vinculación comunitaria Maule',
      descripcion_solicitud: 'Se solicita apoyo técnico para desarrollo de software comunitario en la región.',
      fecha_creacion_solicitud: '2025-01-10', id_estado: 1, id_usuario: 3, id_carrera: 1, id_ciudad: 1,
    },
    {
      id_solicitud: 2, titulo_solicitud: 'Asesoría en gestión empresarial PYME',
      descripcion_solicitud: 'Consultoría para mejorar procesos internos y estructura organizacional de empresa local.',
      fecha_creacion_solicitud: '2025-01-22', id_estado: 2, id_usuario: 7, id_carrera: 7, id_ciudad: 2,
    },
    {
      id_solicitud: 3, titulo_solicitud: 'Estudio de impacto ambiental sector norte',
      descripcion_solicitud: 'Análisis de contaminantes en zona industrial de la región del Biobío.',
      fecha_creacion_solicitud: '2024-02-05', id_estado: 3, id_usuario: 1, id_carrera: 3, id_ciudad: 3,
    },
    {
      id_solicitud: 4, titulo_solicitud: 'Diagnóstico de salud rural en Curicó',
      descripcion_solicitud: 'Evaluación de condiciones de salud en comunidades rurales del área sur.',
      fecha_creacion_solicitud: '2024-02-18', id_estado: 4, id_usuario: 5, id_carrera: 4, id_ciudad: 5,
    },
    {
      id_solicitud: 5, titulo_solicitud: 'Programa de kinesiología preventiva adultos',
      descripcion_solicitud: 'Plan de atención fisioterapéutica para adultos mayores de la comunidad.',
      fecha_creacion_solicitud: '2026-03-01', id_estado: 1, id_usuario: 2, id_carrera: 5, id_ciudad: 1,
    },
    {
      id_solicitud: 6, titulo_solicitud: 'Taller jurídico para microempresarios',
      descripcion_solicitud: 'Capacitación legal sobre normativa comercial vigente y derechos del consumidor.',
      fecha_creacion_solicitud: '2023-03-14', id_estado: 2, id_usuario: 6, id_carrera: 6, id_ciudad: 4,
    },
    {
      id_solicitud: 7, titulo_solicitud: 'Análisis financiero cooperativa agrícola',
      descripcion_solicitud: 'Revisión contable y propuesta de mejora financiera para cooperativa del Maule.',
      fecha_creacion_solicitud: '2026-04-03', id_estado: 5, id_usuario: 4, id_carrera: 8, id_ciudad: 5,
    },
    {
      id_solicitud: 8, titulo_solicitud: 'Desarrollo de app móvil para ONG local',
      descripcion_solicitud: 'Diseño y programación de aplicación de gestión y coordinación social.',
      fecha_creacion_solicitud: '2023-04-20', id_estado: 3, id_usuario: 8, id_carrera: 1, id_ciudad: 2,
    },
    {
      id_solicitud: 9, titulo_solicitud: 'Investigación bioquímica en residuos mineros',
      descripcion_solicitud: 'Estudio de composición química de efluentes industriales provenientes de la minería.',
      fecha_creacion_solicitud: '2026-05-08', id_estado: 1, id_usuario: 3, id_carrera: 10, id_ciudad: 3,
    },
    {
      id_solicitud: 10, titulo_solicitud: 'Apoyo pedagógico en zonas vulnerables',
      descripcion_solicitud: 'Programa de reforzamiento en matemáticas y lenguaje en escuelas rurales de la región.',
      fecha_creacion_solicitud: '2026-05-15', id_estado: 2, id_usuario: 7, id_carrera: 9, id_ciudad: 1,
    },
  ];

  /* ─── Meses del año ───────────────────────────────────────── */
  readonly meses = [
    { valor: '01', nombre: 'Enero'      },
    { valor: '02', nombre: 'Febrero'    },
    { valor: '03', nombre: 'Marzo'      },
    { valor: '04', nombre: 'Abril'      },
    { valor: '05', nombre: 'Mayo'       },
    { valor: '06', nombre: 'Junio'      },
    { valor: '07', nombre: 'Julio'      },
    { valor: '08', nombre: 'Agosto'     },
    { valor: '09', nombre: 'Septiembre' },
    { valor: '10', nombre: 'Octubre'    },
    { valor: '11', nombre: 'Noviembre'  },
    { valor: '12', nombre: 'Diciembre'  },
  ];

  /* ─── Búsqueda y filtros ───────────────────────────────────── */
  searchTerm    = '';
  filtroTipo    = '';   // '' | 'fecha' | 'estado' | 'carrera'
  filtroAnio    = '';
  filtroMes     = '';
  filtroEstado  = '';
  filtroCarrera = '';

  /* ─── Estado de modales ────────────────────────────────────── */
  mostrarModalForm     = false;
  mostrarModalEliminar = false;
  solicitudEnEdicion: Partial<Solicitud> = {};
  solicitudAEliminar: Solicitud | null   = null;

  /* ─── Helpers de presentación ──────────────────────────────── */
  getNombreEstado(id_estado: number): string {
    return this.estados.find(e => e.id_estado === id_estado)?.nombre_estado ?? '—';
  }

  getNombreCarrera(id_carrera: number): string {
    return this.carreras.find(c => c.id_carrera === id_carrera)?.nombre_carrera ?? '—';
  }

  getEtiquetaCarrera(id_carrera: number): string {
    return this.carreras.find(c => c.id_carrera === id_carrera)?.etiqueta_carrera ?? '—';
  }

  getNombreCiudad(id_ciudad: number): string {
    return this.ciudades.find(c => c.id_ciudad === id_ciudad)?.nombre_ciudad ?? '—';
  }

  getBadgeEstado(id_estado: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100   text-amber-700   border-amber-200',
      2: 'bg-sky-100     text-sky-700     border-sky-200',
      3: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      4: 'bg-red-100     text-red-700     border-red-200',
      5: 'bg-gray-100    text-gray-600    border-gray-200',
    };
    return mapa[id_estado] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  getBadgeCarrera(id_carrera: number): string {
    const colores = [
      'bg-teal-100    text-teal-700    border-teal-200',
      'bg-violet-100  text-violet-700  border-violet-200',
      'bg-sky-100     text-sky-700     border-sky-200',
      'bg-amber-100   text-amber-700   border-amber-200',
      'bg-rose-100    text-rose-700    border-rose-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-orange-100  text-orange-700  border-orange-200',
      'bg-indigo-100  text-indigo-700  border-indigo-200',
      'bg-pink-100    text-pink-700    border-pink-200',
      'bg-cyan-100    text-cyan-700    border-cyan-200',
    ];
    return colores[(id_carrera - 1) % colores.length];
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /** Años únicos presentes en los datos, ordenados de más reciente a más antiguo */
  get aniosDisponibles(): string[] {
    return [...new Set(this.solicitudes.map(s => s.fecha_creacion_solicitud.slice(0, 4)))]
      .sort()
      .reverse();
  }

  /**
   * Prefijo de fecha efectivo para el filtro:
   *   solo año  → "2026"
   *   año + mes → "2026-05"
   */
  private get filtroFechaEfectiva(): string {
    if (!this.filtroAnio) return '';
    return this.filtroMes ? `${this.filtroAnio}-${this.filtroMes}` : this.filtroAnio;
  }

  /* ─── Lista filtrada ───────────────────────────────────────── */
  get solicitudesFiltradas(): Solicitud[] {
    let lista = [...this.solicitudes];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t)       ||
        s.descripcion_solicitud.toLowerCase().includes(t)  ||
        this.getNombreCarrera(s.id_carrera).toLowerCase().includes(t) ||
        this.getNombreEstado(s.id_estado).toLowerCase().includes(t)   ||
        this.getNombreCiudad(s.id_ciudad).toLowerCase().includes(t)
      );
    }

    if (this.filtroTipo === 'fecha'   && this.filtroFechaEfectiva)
      lista = lista.filter(s => s.fecha_creacion_solicitud.startsWith(this.filtroFechaEfectiva));
    if (this.filtroTipo === 'estado'  && this.filtroEstado)
      lista = lista.filter(s => s.id_estado === +this.filtroEstado);
    if (this.filtroTipo === 'carrera' && this.filtroCarrera)
      lista = lista.filter(s => s.id_carrera === +this.filtroCarrera);

    return lista;
  }

  onCambiarFiltroTipo(): void {
    this.filtroAnio = this.filtroMes = this.filtroEstado = this.filtroCarrera = '';
  }

  limpiarFiltros(): void {
    this.searchTerm = this.filtroTipo = this.filtroAnio = this.filtroMes = this.filtroEstado = this.filtroCarrera = '';
  }

  /* ─── Acciones (sin crear — admin solo lee, edita y elimina) ── */
  abrirEditar(solicitud: Solicitud): void {
    this.solicitudEnEdicion = { ...solicitud };
    this.mostrarModalForm   = true;
  }

  abrirEliminar(solicitud: Solicitud): void {
    this.solicitudAEliminar   = solicitud;
    this.mostrarModalEliminar = true;
  }

  onGuardarSolicitud(datos: Partial<Solicitud>): void {
    const idx = this.solicitudes.findIndex(s => s.id_solicitud === datos.id_solicitud);
    if (idx !== -1) this.solicitudes[idx] = datos as Solicitud;
    this.mostrarModalForm = false;
  }

  onEliminarSolicitud(): void {
    if (this.solicitudAEliminar) {
      this.solicitudes = this.solicitudes.filter(
        s => s.id_solicitud !== this.solicitudAEliminar!.id_solicitud
      );
      this.solicitudAEliminar   = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
