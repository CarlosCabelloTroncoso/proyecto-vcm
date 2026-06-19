import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { ModalSolicitudForm } from './modales/modal-solicitud-form/modal-solicitud-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-solicitudes',
  imports: [CommonModule, FormsModule, ModalSolicitudForm, ModalConfirmar],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes implements OnInit {

  constructor(private dataService: DataService, private catalog: CatalogService) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estados = this.catalog.estados();
    this.carreras = this.catalog.carreras();
    this.ciudades = this.catalog.ciudades();
    const solicitudesRes = await this.dataService.getAll<any>('solicitud', { select: `*, estado_solicitud(nombre_estado), usuario(nombres_usuario, apellidos_usuario, rut_usuario), carrera(nombre_carrera, etiqueta_carrera), ciudad(nombre_ciudad)`, filters: { is_active: true } });
    if (solicitudesRes.data) this.solicitudes.set(solicitudesRes.data);
  }


  /* ─── Estados de solicitud ─────────────────────────────────── */
  estados: EstadoSolicitud[] = [];

  /* ─── Carreras de referencia ───────────────────────────────── */
  carreras: Carrera[] = [];

  /* ─── Ciudades de referencia ───────────────────────────────── */
  ciudades: Ciudad[] = [];

  /* ─── Datos mock ───────────────────────────────────────────── */
  solicitudes = signal<Solicitud[]>([]);

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

  getNombreCiudad(id: number | null | undefined): string {
    if (!id) return "—";
    return this.ciudades.find(c => c.id_ciudad === id)?.nombre_ciudad ?? '—';
  }

  getBadgeEstado(id_estado: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100 text-amber-700 border-amber-200',
      2: 'bg-green-100 text-green-700 border-green-200',
      3: 'bg-red-100   text-red-700   border-red-200',
      4: 'bg-sky-100   text-sky-700   border-sky-200',
      5: 'bg-gray-100  text-gray-600  border-gray-200',
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
    return [...new Set(this.solicitudes().map(s => s.fecha_creacion_solicitud.slice(0, 4)))]
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
    let lista = [...this.solicitudes()];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t)       ||
        s.descripcion_solicitud.toLowerCase().includes(t)  ||
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

  async onGuardarSolicitud(datos: Partial<Solicitud>): Promise<void> {
    if (datos.id_solicitud) {
      await this.dataService.update('solicitud', datos.id_solicitud, {
        titulo_solicitud:      datos.titulo_solicitud,
        descripcion_solicitud: datos.descripcion_solicitud,
        id_estado:             datos.id_estado,
        id_carrera:            datos.id_carrera,
        id_ciudad:             datos.id_ciudad,
      }, 'id_solicitud');
    }
    this.solicitudes.update(lista =>
      lista.map(s => s.id_solicitud === datos.id_solicitud ? datos as Solicitud : s)
    );
    this.mostrarModalForm = false;
  }

  async onEliminarSolicitud(): Promise<void> {
    if (this.solicitudAEliminar) {
      await this.dataService.softDelete('solicitud', this.solicitudAEliminar!.id_solicitud, 'id_solicitud');
      const id = this.solicitudAEliminar.id_solicitud;
      this.solicitudes.update(lista => lista.filter(s => s.id_solicitud !== id));
      this.solicitudAEliminar   = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
