import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetalleSolicitud } from '../../../shared/modal-detalle-solicitud/modal-detalle-solicitud';
import { ModalDetalleCliente, ClienteVista } from '../../../shared/modal-detalle-cliente/modal-detalle-cliente';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-ver-solicitudes',
  imports: [CommonModule, FormsModule, ModalDetalleSolicitud, ModalDetalleCliente],
  templateUrl: './ver-solicitudes.html',
  styleUrl: './ver-solicitudes.css',
})
export class VerSolicitudes implements OnInit {

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,
    private cdr: ChangeDetectorRef,
  ) {}

  estados:  EstadoSolicitud[] = [];
  carreras: Carrera[]         = [];
  ciudades: Ciudad[]          = [];

  solicitudes = signal<Solicitud[]>([]);
  archivos:    Archivo[]      = [];

  filtroActivo: 'pendiente' | 'aprobada' | 'en_proceso' | 'rechazada' | 'cerrado' = 'pendiente';
  searchTerm = '';

  mostrarModalDetalle    = false;
  mostrarModalCliente    = false;
  solicitudSeleccionada: Solicitud | null = null;
  clienteSeleccionado: ClienteVista | null = null;

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estados  = this.catalog.estados();
    this.carreras = this.catalog.carreras();
    this.ciudades = this.catalog.ciudades();

    const res = await this.dataService.getAll<any>('solicitud', {
      select:  `*, estado_solicitud(nombre_estado), usuario(nombres_usuario, apellidos_usuario, rut_usuario, telefono_usuario), carrera(nombre_carrera, etiqueta_carrera), ciudad(nombre_ciudad)`,
      filters: { is_active: true },
    });
    if (res.data) this.solicitudes.set(res.data);
  }

  get solicitudesFiltradas(): Solicitud[] {
    const idCerrada   = this.catalog.getIdEstado('Cerrada')    || 4;
    const idEnProceso = this.catalog.getIdEstado('En proceso') || 5;
    const estadoId = ({
      pendiente:  1,
      aprobada:   2,
      en_proceso: idEnProceso,
      rechazada:  3,
      cerrado:    idCerrada,
    } as Record<string, number>)[this.filtroActivo];

    let lista = this.solicitudes().filter(s => s.id_estado === estadoId);

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t) ||
        this.getNombreCliente(s).toLowerCase().includes(t) ||
        this.getNombreCarrera(s.id_carrera).toLowerCase().includes(t)
      );
    }

    return lista.sort((a, b) => {
      const fa = (a as any).fecha_creacion_solicitud ?? '';
      const fb = (b as any).fecha_creacion_solicitud ?? '';
      return fb.localeCompare(fa);
    });
  }

  get contadorPorEstado(): Record<string, number> {
    const base        = [...this.solicitudes()];
    const idCerrada   = this.catalog.getIdEstado('Cerrada')    || 4;
    const idEnProceso = this.catalog.getIdEstado('En proceso') || 5;
    return {
      pendiente:  base.filter(s => s.id_estado === 1).length,
      aprobada:   base.filter(s => s.id_estado === 2).length,
      en_proceso: base.filter(s => s.id_estado === idEnProceso).length,
      rechazada:  base.filter(s => s.id_estado === 3).length,
      cerrado:    base.filter(s => s.id_estado === idCerrada).length,
    };
  }

  getNombreCliente(sol: any): string {
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

  getNombreCiudad(id: number | null | undefined): string {
    if (!id) return '—';
    return this.ciudades.find(c => c.id_ciudad === id)?.nombre_ciudad ?? '—';
  }

  getBadgeEstado(id: number): string {
    const idCerrada   = this.catalog.getIdEstado('Cerrada')    || 4;
    const idEnProceso = this.catalog.getIdEstado('En proceso') || 5;
    const mapa: Record<number, string> = {
      1:             'bg-amber-100 text-amber-700 border-amber-200',
      2:             'bg-green-100 text-green-700 border-green-200',
      3:             'bg-red-100   text-red-700   border-red-200',
      [idCerrada]:   'bg-teal-100  text-teal-700  border-teal-200',
      [idEnProceso]: 'bg-sky-100   text-sky-700   border-sky-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

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

  cerrarDetalle(): void {
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
}
