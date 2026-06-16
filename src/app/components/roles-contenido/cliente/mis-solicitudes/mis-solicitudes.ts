import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { ModalDetalleSolicitud } from '../../../shared/modal-detalle-solicitud/modal-detalle-solicitud';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule, FormsModule, RouterModule, ModalDetalleSolicitud, ModalConfirmar],
  templateUrl: './mis-solicitudes.html',
  styleUrl: './mis-solicitudes.css',
})
export class MisSolicitudes implements OnInit {

  /* ─── Estados de solicitud ─────────────────────────────────── */
  estados: EstadoSolicitud[] = [];

  /* ─── Carreras ──────────────────────────────────────────────── */
  carreras: Carrera[] = [];

  /* ─── Ciudades ──────────────────────────────────────────────── */
  ciudades: Ciudad[] = [];

  /* ─── Datos mock del cliente (id_usuario: 1) ───────────────── */
  solicitudes: Solicitud[] = [];

    /* Los archivos se cargan por solicitud desde Supabase */
  archivos: any[] = [];

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

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,private router: Router) {}

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

  getNombreCiudad(id: number | null | undefined): string {
    if (!id) return "—";
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
        this.getNombreCiudad(s.id_ciudad ?? 0).toLowerCase().includes(t)
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

  async onEliminarSolicitud(): Promise<void> {
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
