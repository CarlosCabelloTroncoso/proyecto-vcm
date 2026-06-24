import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetalleSolicitud } from '../../../shared/modal-detalle-solicitud/modal-detalle-solicitud';
import { ModalConfirmarAccion } from '../../../shared/modal-confirmar-accion/modal-confirmar-accion';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Usuario, EncargadoCarrera } from '../../../../interfaces/usuario.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-ver-solicitudes',
  imports: [CommonModule, FormsModule, ModalDetalleSolicitud, ModalConfirmarAccion],
  templateUrl: './ver-solicitudes.html',
  styleUrl: './ver-solicitudes.css',
})
export class VerSolicitudes implements OnInit {

  private auth = inject(AuthService);

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estados = this.catalog.estados();
    this.carreras = this.catalog.carreras();
    this.ciudades = this.catalog.ciudades();

    const idCarrera = this.auth.usuario()?.gestor_vinculacion_carrera?.id_carrera;
    if (idCarrera) {
      this.nombreCarrera = this.carreras.find(c => c.id_carrera === idCarrera)?.nombre_carrera ?? '';
    }

    const [solicitudesRes, planRes] = await Promise.all([
      this.dataService.getAll<any>('solicitud', { select: `*, estado_solicitud(nombre_estado), usuario(nombres_usuario, apellidos_usuario, rut_usuario), carrera(nombre_carrera, etiqueta_carrera), ciudad(nombre_ciudad)`, filters: { is_active: true } }),
      this.dataService.getAll<any>('planteamiento_proyecto', { select: 'id_solicitud', filters: { is_active: true } }),
    ]);
    if (solicitudesRes.data) this.solicitudes.set(solicitudesRes.data);
    if (planRes.data) this.solicitudesOcupadasIds = new Set(planRes.data.map((p: any) => p.id_solicitud));
  }

  /* ─── Carrera del encargado ─────────────────────────────────── */
  nombreCarrera = '';

  /* ─── Catálogos ────────────────────────────────────────────── */
  estados: EstadoSolicitud[] = [];

  carreras: Carrera[] = [];

  ciudades: Ciudad[] = [];

    /* Los datos de clientes vienen en el join de solicitud.usuario */

  /* ─── Solicitudes de la carrera del encargado ───────────────── */
  solicitudes = signal<Solicitud[]>([]);

  solicitudesOcupadasIds = new Set<number>();

    archivos: any[] = [];

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
    const estadoId = { pendiente: 1, aprobada: 2, rechazada: 3 }[this.filtroActivo];

    let lista = this.solicitudes().filter(
      s => s.id_estado === estadoId
    );

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t) ||
        this.getNombreCliente(s.id_usuario).toLowerCase().includes(t)
      );
    }

    return lista.sort((a, b) => {
      const fa = (a as any).fecha_creacion_solicitud ?? '';
      const fb = (b as any).fecha_creacion_solicitud ?? '';
      return fb.localeCompare(fa);
    });
  }

  get contadorPorEstado(): Record<string, number> {
    const base = [...this.solicitudes()];
    return {
      pendiente: base.filter(s => s.id_estado === 1).length,
      aprobada:  base.filter(s => s.id_estado === 2).length,
      rechazada: base.filter(s => s.id_estado === 3).length,
    };
  }

  /* ─── Helpers ───────────────────────────────────────────────── */
  getNombreCliente(id: number): string {
    // Nombre viene del join solicitud.usuario
    const sol = this.solicitudes().find((s: any) => s.id_usuario === id);
    return sol?.usuario ? `${sol.usuario.nombres_usuario} ${sol.usuario.apellidos_usuario}` : `Usuario ${id}`;
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
    if (!id) return "—";
    return this.ciudades.find(c => c.id_ciudad === id)?.nombre_ciudad ?? '—';
  }

  esSolicitudOcupada(id: number): boolean {
    return this.solicitudesOcupadasIds.has(id);
  }

  getArchivosDeSolicitud(id: number): Archivo[] {
    return this.archivos.filter(a => a.id_solicitud === id);
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100 text-amber-700 border-amber-200',
      2: 'bg-green-100 text-green-700 border-green-200',
      3: 'bg-red-100   text-red-700   border-red-200',
      4: 'bg-sky-100   text-sky-700   border-sky-200',
      5: 'bg-gray-100  text-gray-600  border-gray-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Acciones modal detalle ────────────────────────────────── */
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

  /* ─── Acciones aprobar / rechazar ───────────────────────────── */
  abrirAprobar(solicitud: Solicitud): void {
    this.solicitudAccion     = solicitud;
    this.mostrarModalAprobar = true;
  }

  abrirRechazar(solicitud: Solicitud): void {
    this.solicitudAccion      = solicitud;
    this.mostrarModalRechazar = true;
  }

  async confirmarAprobar(): Promise<void> {
    if (this.solicitudAccion) {
      const id  = this.solicitudAccion.id_solicitud;
      const now = new Date().toISOString();
      await this.dataService.update('solicitud', id, { id_estado: 2, fecha_actualizacion: now }, 'id_solicitud');
      this.solicitudes.update(lista =>
        lista.map(s => s.id_solicitud === id ? { ...s, id_estado: 2, fecha_actualizacion: now } : s)
      );
    }
    this.mostrarModalAprobar = false;
    this.solicitudAccion     = null;
  }

  async confirmarRechazar(): Promise<void> {
    if (this.solicitudAccion) {
      const id  = this.solicitudAccion.id_solicitud;
      const now = new Date().toISOString();
      await this.dataService.update('solicitud', id, { id_estado: 3, fecha_actualizacion: now }, 'id_solicitud');
      this.solicitudes.update(lista =>
        lista.map(s => s.id_solicitud === id ? { ...s, id_estado: 3, fecha_actualizacion: now } : s)
      );
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
