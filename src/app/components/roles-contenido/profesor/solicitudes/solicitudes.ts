import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDetalleSolicitud } from '../../../shared/modal-detalle-solicitud/modal-detalle-solicitud';
import { ModalDetalleCliente, ClienteVista } from '../../../shared/modal-detalle-cliente/modal-detalle-cliente';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-solicitudes',
  imports: [CommonModule, FormsModule, ModalDetalleSolicitud, ModalDetalleCliente],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes implements OnInit {

  private auth = inject(AuthService);

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,
    private cdr: ChangeDetectorRef,
    private router: Router) {}

  /* ─── Catálogos ────────────────────────────────────────────── */
  estados: EstadoSolicitud[] = [];
  carreras: Carrera[] = [];
  ciudades: Ciudad[] = [];

  /* ─── Solicitudes ───────────────────────────────────────────── */
  solicitudes = signal<Solicitud[]>([]);

  solicitudesOcupadasIds = new Set<number>();

  archivos: Archivo[] = [];

  /* ─── Carrera del profesor ──────────────────────────────────── */
  nombreCarrera = '';

  /* ─── Filtros de fecha ──────────────────────────────────────── */
  readonly meses = [
    { valor: '01', nombre: 'Enero'      }, { valor: '02', nombre: 'Febrero'   },
    { valor: '03', nombre: 'Marzo'      }, { valor: '04', nombre: 'Abril'     },
    { valor: '05', nombre: 'Mayo'       }, { valor: '06', nombre: 'Junio'     },
    { valor: '07', nombre: 'Julio'      }, { valor: '08', nombre: 'Agosto'    },
    { valor: '09', nombre: 'Septiembre' }, { valor: '10', nombre: 'Octubre'   },
    { valor: '11', nombre: 'Noviembre'  }, { valor: '12', nombre: 'Diciembre' },
  ];

  filtroActivo: 'disponibles' | 'en_proceso' = 'disponibles';
  idEnProceso = 0;

  filtroAnio = '';
  filtroMes  = '';
  searchTerm = '';

  /* ─── Modal ─────────────────────────────────────────────────── */
  mostrarModalDetalle    = false;
  mostrarModalCliente    = false;
  solicitudSeleccionada: Solicitud | null = null;
  clienteSeleccionado:   ClienteVista | null = null;

  /* ─── Años disponibles según solicitudes cargadas ───────────── */
  get aniosDisponibles(): string[] {
    return [...new Set(this.solicitudes().map(s => s.fecha_creacion_solicitud.slice(0, 4)))]
      .sort().reverse();
  }

  private get filtroFechaEfectiva(): string {
    if (!this.filtroAnio) return '';
    return this.filtroMes ? `${this.filtroAnio}-${this.filtroMes}` : this.filtroAnio;
  }

  /* ─── Lista filtrada ────────────────────────────────────────── */
  get contadorDisponibles(): number {
    return this.solicitudes().filter(s => s.id_estado === 2).length;
  }

  get contadorEnProceso(): number {
    return this.idEnProceso
      ? this.solicitudes().filter(s => s.id_estado === this.idEnProceso).length
      : 0;
  }

  get solicitudesFiltradas(): Solicitud[] {
    let lista = this.filtroActivo === 'en_proceso'
      ? this.solicitudes().filter(s => s.id_estado === this.idEnProceso)
      : this.solicitudes().filter(s => s.id_estado === 2);

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t) ||
        this.getNombreCliente(s).toLowerCase().includes(t)
      );
    }

    if (this.filtroFechaEfectiva) {
      lista = lista.filter(s => s.fecha_creacion_solicitud.startsWith(this.filtroFechaEfectiva));
    }

    return lista.sort((a, b) => {
      const fa = a.fecha_creacion_solicitud ?? '';
      const fb = b.fecha_creacion_solicitud ?? '';
      return fb.localeCompare(fa);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estados     = this.catalog.estados();
    this.carreras    = this.catalog.carreras();
    this.ciudades    = this.catalog.ciudades();
    this.idEnProceso = this.catalog.getIdEstado('En proceso') || 0;

    const idCarrera = this.auth.usuario()?.profesor?.id_carrera;
    if (idCarrera) {
      this.nombreCarrera = this.carreras.find(c => c.id_carrera === idCarrera)?.nombre_carrera ?? '';
    }

    const [solicitudesRes, ocupadas] = await Promise.all([
      this.dataService.getAll<any>('solicitud', {
        select: `*, estado_solicitud(nombre_estado), usuario(nombres_usuario, apellidos_usuario, rut_usuario, telefono_usuario), carrera(nombre_carrera, etiqueta_carrera), ciudad(nombre_ciudad)`,
        filters: { is_active: true },
      }),
      this.cargarSolicitudesOcupadas(),
    ]);
    if (solicitudesRes.data) this.solicitudes.set(solicitudesRes.data);
    this.solicitudesOcupadasIds = ocupadas;
  }

  private async cargarSolicitudesOcupadas(): Promise<Set<number>> {
    const { data } = await this.dataService.getAll<any>('planteamiento_proyecto', {
      select: 'id_solicitud',
      filters: { id_estado: 2, is_active: true },
    });
    const ocupadas = new Set<number>();
    if (data) {
      for (const pp of data) ocupadas.add(pp.id_solicitud);
    }
    return ocupadas;
  }

  limpiarFiltros(): void {
    this.filtroAnio = '';
    this.filtroMes  = '';
  }

  /* ─── Helpers ───────────────────────────────────────────────── */
  getNombreCliente(sol: Solicitud): string {
    return sol.usuario
      ? `${sol.usuario.nombres_usuario} ${sol.usuario.apellidos_usuario}`
      : '—';
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

  getNombreCiudad(id: number | null | undefined): string {
    if (!id) return '—';
    return this.ciudades.find(c => c.id_ciudad === id)?.nombre_ciudad ?? '—';
  }

  getArchivosDeSolicitud(id: number): Archivo[] {
    return this.archivos.filter(a => a.id_solicitud === id);
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      2: 'bg-green-100 text-green-700 border-green-200',
      3: 'bg-red-100   text-red-700   border-red-200',
    };
    if (this.idEnProceso) mapa[this.idEnProceso] = 'bg-sky-100 text-sky-700 border-sky-200';
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Acciones ──────────────────────────────────────────────── */
  async abrirDetalle(solicitud: Solicitud): Promise<void> {
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalDetalle   = true;
    this.archivos              = [];

    const { data } = await this.dataService.getAll<Archivo>('archivo', {
      filters: { id_solicitud: solicitud.id_solicitud },
    });
    this.archivos = data ?? [];
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModalDetalle   = false;
    this.solicitudSeleccionada = null;
    this.archivos              = [];
  }

  abrirModalCliente(sol: any): void {
    if (!sol.usuario) return;
    this.clienteSeleccionado = sol.usuario as ClienteVista;
    this.mostrarModalCliente = true;
  }

  cerrarModalCliente(): void {
    this.mostrarModalCliente = false;
    this.clienteSeleccionado = null;
  }

  esSolicitudOcupada(id: number): boolean {
    return this.solicitudesOcupadasIds.has(id);
  }

  realizarPlanteamiento(solicitud: Solicitud): void {
    if (this.esSolicitudOcupada(solicitud.id_solicitud)) return;
    this.router.navigate(['/profesor/planteamientos'], {
      state: { solicitudId: solicitud.id_solicitud },
    });
  }
}
