import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { ModalDetalleSolicitud } from './modales/modal-detalle-solicitud/modal-detalle-solicitud';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule, FormsModule, RouterModule, ModalDetalleSolicitud, ModalConfirmar],
  templateUrl: './mis-solicitudes.html',
  styleUrl: './mis-solicitudes.css',
})
export class MisSolicitudes implements OnInit {

  /* ─── Estados de solicitud ─────────────────────────────────── */
  estados: EstadoSolicitud[] = [
    { id_estado: 1, nombre_estado: 'Pendiente',   descripcion_estado: 'En espera de revisión' },
    { id_estado: 2, nombre_estado: 'En revisión', descripcion_estado: 'Siendo evaluada'        },
    { id_estado: 3, nombre_estado: 'Aprobada',    descripcion_estado: 'Solicitud aceptada'     },
    { id_estado: 4, nombre_estado: 'Rechazada',   descripcion_estado: 'Solicitud no aceptada'  },
    { id_estado: 5, nombre_estado: 'Cerrada',     descripcion_estado: 'Proceso finalizado'     },
  ];

  /* ─── Carreras ──────────────────────────────────────────────── */
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

  /* ─── Ciudades ──────────────────────────────────────────────── */
  ciudades: Ciudad[] = [
    { id_ciudad: 1, nombre_ciudad: 'Talca'      },
    { id_ciudad: 2, nombre_ciudad: 'Santiago'   },
    { id_ciudad: 3, nombre_ciudad: 'Concepción' },
    { id_ciudad: 4, nombre_ciudad: 'Rancagua'   },
    { id_ciudad: 5, nombre_ciudad: 'Curicó'     },
  ];

  /* ─── Datos mock del cliente (id_usuario: 1) ───────────────── */
  solicitudes: Solicitud[] = [
    {
      id_solicitud: 1, titulo_solicitud: 'Proyecto de vinculación comunitaria Maule',
      descripcion_solicitud: 'Se solicita apoyo técnico para desarrollo de software comunitario en la región.',
      fecha_creacion_solicitud: '2025-01-10', id_estado: 1, id_usuario: 1, id_carrera: 1, id_ciudad: 1,
    },
    {
      id_solicitud: 3, titulo_solicitud: 'Estudio de impacto ambiental sector norte',
      descripcion_solicitud: 'Análisis de contaminantes en zona industrial de la región del Biobío.',
      fecha_creacion_solicitud: '2024-02-05', id_estado: 3, id_usuario: 1, id_carrera: 3, id_ciudad: 3,
    },
    {
      id_solicitud: 9, titulo_solicitud: 'Investigación bioquímica en residuos mineros',
      descripcion_solicitud: 'Estudio de composición química de efluentes industriales provenientes de la minería.',
      fecha_creacion_solicitud: '2026-05-08', id_estado: 2, id_usuario: 1, id_carrera: 10, id_ciudad: 3,
    },
  ];

  /* ─── Archivos adjuntos (mock global, filtrado por id_solicitud) ─ */
  archivos: Archivo[] = [
    {
      id_archivo: 1, nombre_archivo: 'propuesta_vinculacion.pdf',
      ruta_archivo: 'uploads/propuesta_vinculacion.pdf', tipo_archivo: 'pdf',
      id_solicitud: 1, id_planteamiento: null, id_proyecto: null,
    },
    {
      id_archivo: 2, nombre_archivo: 'estudio_ambiental.pdf',
      ruta_archivo: 'uploads/estudio_ambiental.pdf', tipo_archivo: 'pdf',
      id_solicitud: 3, id_planteamiento: null, id_proyecto: null,
    },
    {
      id_archivo: 3, nombre_archivo: 'datos_contaminantes.xlsx',
      ruta_archivo: 'uploads/datos_contaminantes.xlsx', tipo_archivo: 'xlsx',
      id_solicitud: 3, id_planteamiento: null, id_proyecto: null,
    },
  ];

  /* ─── Meses ─────────────────────────────────────────────────── */
  readonly meses = [
    { valor: '01', nombre: 'Enero'      }, { valor: '02', nombre: 'Febrero'   },
    { valor: '03', nombre: 'Marzo'      }, { valor: '04', nombre: 'Abril'     },
    { valor: '05', nombre: 'Mayo'       }, { valor: '06', nombre: 'Junio'     },
    { valor: '07', nombre: 'Julio'      }, { valor: '08', nombre: 'Agosto'    },
    { valor: '09', nombre: 'Septiembre' }, { valor: '10', nombre: 'Octubre'   },
    { valor: '11', nombre: 'Noviembre'  }, { valor: '12', nombre: 'Diciembre' },
  ];

  /* ─── Búsqueda y filtros ────────────────────────────────────── */
  searchTerm    = '';
  filtroTipo    = '';
  filtroAnio    = '';
  filtroMes     = '';
  filtroEstado  = '';
  filtroCarrera = '';

  /* ─── Estado de modales ─────────────────────────────────────── */
  mostrarModalDetalle  = false;
  mostrarModalEliminar = false;
  solicitudSeleccionada: Solicitud | null = null;
  solicitudAEliminar:   Solicitud | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;

    // Viene de crear-solicitud → agrega y abre detalle
    if (state?.nuevaSolicitud) {
      this.solicitudes = [state.nuevaSolicitud, ...this.solicitudes];
      // Añadir archivos de la nueva solicitud
      if (state?.archivos?.length) {
        this.archivos = [...this.archivos, ...state.archivos];
      }
      this.abrirDetalle(state.nuevaSolicitud);
    }

    // Viene de editar-solicitud → actualiza la fila y reemplaza sus archivos
    if (state?.solicitudEditada) {
      const idx = this.solicitudes.findIndex(
        s => s.id_solicitud === state.solicitudEditada.id_solicitud
      );
      if (idx !== -1) this.solicitudes[idx] = state.solicitudEditada;

      // Reemplazar archivos: eliminar los viejos y agregar los nuevos
      const idSolicitud = state.solicitudEditada.id_solicitud;
      this.archivos = [
        ...this.archivos.filter(a => a.id_solicitud !== idSolicitud),
        ...(state?.archivos ?? []),
      ];
    }
  }

  /* ─── Archivos por solicitud ────────────────────────────────── */
  getArchivosDeSolicitud(idSolicitud: number): Archivo[] {
    return this.archivos.filter(a => a.id_solicitud === idSolicitud);
  }

  /* ─── Helpers de presentación ───────────────────────────────── */
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

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100   text-amber-700   border-amber-200',
      2: 'bg-sky-100     text-sky-700     border-sky-200',
      3: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      4: 'bg-red-100     text-red-700     border-red-200',
      5: 'bg-gray-100    text-gray-600    border-gray-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  getBadgeCarrera(id: number): string {
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
    return colores[(id - 1) % colores.length];
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  get aniosDisponibles(): string[] {
    return [...new Set(this.solicitudes.map(s => s.fecha_creacion_solicitud.slice(0, 4)))]
      .sort().reverse();
  }

  private get filtroFechaEfectiva(): string {
    if (!this.filtroAnio) return '';
    return this.filtroMes ? `${this.filtroAnio}-${this.filtroMes}` : this.filtroAnio;
  }

  /* ─── Lista filtrada ────────────────────────────────────────── */
  get solicitudesFiltradas(): Solicitud[] {
    let lista = [...this.solicitudes];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t)      ||
        s.descripcion_solicitud.toLowerCase().includes(t) ||
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
    this.searchTerm = this.filtroTipo = this.filtroAnio =
    this.filtroMes  = this.filtroEstado = this.filtroCarrera = '';
  }

  /* ─── Acciones ──────────────────────────────────────────────── */
  abrirDetalle(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalDetalle   = true;
  }

  abrirEditar(solicitud: Solicitud): void {
    this.router.navigate(['/cliente/crear-solicitud'], {
      state: {
        modo: 'editar',
        solicitud,
        archivos: this.getArchivosDeSolicitud(solicitud.id_solicitud),
      }
    });
  }

  abrirEliminar(solicitud: Solicitud): void {
    this.solicitudAEliminar   = solicitud;
    this.mostrarModalEliminar = true;
  }

  onEliminarSolicitud(): void {
    if (this.solicitudAEliminar) {
      const idSolicitud = this.solicitudAEliminar.id_solicitud;
      this.solicitudes = this.solicitudes.filter(s => s.id_solicitud !== idSolicitud);
      this.archivos    = this.archivos.filter(a => a.id_solicitud !== idSolicitud);
      this.solicitudAEliminar   = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalDetalle  = false;
    this.mostrarModalEliminar = false;
    this.solicitudSeleccionada = null;
    this.solicitudAEliminar   = null;
  }

  /* ─── Editar desde modal detalle ────────────────────────────── */
  onEditarDesdDetalle(solicitud: Solicitud): void {
    this.cerrarModales();
    this.abrirEditar(solicitud);
  }
}
