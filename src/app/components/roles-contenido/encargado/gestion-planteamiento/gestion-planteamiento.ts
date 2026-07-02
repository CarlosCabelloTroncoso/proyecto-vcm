import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetallePlanteamiento } from '../../../shared/modal-detalle-planteamiento/modal-detalle-planteamiento';
import { ModalConfirmarAccion } from '../../../shared/modal-confirmar-accion/modal-confirmar-accion';
import { PlanteamientoProyecto, EstadoPlanteamiento, Archivo } from '../../../../interfaces/proyecto.interface';
import { Solicitud } from '../../../../interfaces/solicitud.interface';
import { EncargadoCarrera } from '../../../../interfaces/usuario.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-gestion-planteamiento',
  imports: [CommonModule, FormsModule, ModalDetallePlanteamiento, ModalConfirmarAccion],
  templateUrl: './gestion-planteamiento.html',
  styleUrl: './gestion-planteamiento.css',
})
export class GestionPlanteamiento implements OnInit {

  private auth = inject(AuthService);

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estadosPlanteamiento = this.catalog.estadosPlanteamiento();

    const idCarrera = this.auth.usuario()?.gestor_vinculacion_carrera?.id_carrera;
    if (idCarrera) {
      const carreras = this.catalog.carreras();
      this.nombreCarrera = carreras.find(c => c.id_carrera === idCarrera)?.nombre_carrera ?? '';
    }

    const [planteamientosRes, proyectosRes, solicitudesRes] = await Promise.all([
      this.dataService.getAll<any>('planteamiento_proyecto', { select: `*, estado_planteamiento(nombre_estado), carrera(nombre_carrera), solicitud(titulo_solicitud), usuario(nombres_usuario, apellidos_usuario)`, filters: { is_active: true } }),
      this.dataService.getAll<any>('proyecto', { select: 'id_planteamiento', filters: { is_active: true } }),
      this.dataService.getAll<Solicitud>('solicitud', { select: 'id_solicitud, titulo_solicitud', filters: { is_active: true } }),
    ]);
    if (planteamientosRes.data) this.planteamientos.set(planteamientosRes.data);
    if (proyectosRes.data) this.planteamientosConProyectoIds = new Set(proyectosRes.data.map((p: any) => p.id_planteamiento));
    if (solicitudesRes.data) this.solicitudesAprobadas.set(solicitudesRes.data);
  }

  /* ─── Carrera del encargado ─────────────────────────────────── */
  nombreCarrera = '';

  estadosPlanteamiento: EstadoPlanteamiento[] = [];

  solicitudesAprobadas = signal<Solicitud[]>([]);

  planteamientos = signal<PlanteamientoProyecto[]>([]);

  planteamientosConProyectoIds = new Set<number>();

  archivos: Archivo[] = [];

  filtroActivo: 'pendiente' | 'aprobado' | 'rechazado' | 'cancelado' | 'finalizado' = 'pendiente';
  searchTerm = '';

  mostrarModalDetalle   = false;
  planteamientoSeleccionado: PlanteamientoProyecto | null = null;

  mostrarModalAprobar   = false;
  mostrarModalRechazar  = false;
  planteamientoAccion:  PlanteamientoProyecto | null = null;

  get planteamientosFiltrados(): PlanteamientoProyecto[] {
    const idCancelado   = this.catalog.getIdEstadoPlanteamiento('Cancelado')   || 4;
    const idFinalizado  = this.catalog.getIdEstadoPlanteamiento('Finalizado')  || 5;
    const idMap: Record<string, number> = { pendiente: 1, aprobado: 2, rechazado: 3, cancelado: idCancelado, finalizado: idFinalizado };
    const idEstado = idMap[this.filtroActivo] ?? 1;
    let lista = this.planteamientos().filter(
      p => p.id_estado === idEstado
    );
    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(p =>
        p.titulo_planteamiento.toLowerCase().includes(t) ||
        this.getTituloSolicitud(p.id_solicitud).toLowerCase().includes(t)
      );
    }
    return lista.sort((a: any, b: any) => {
      const fa = a.fecha_actualizacion ?? a.fecha_creacion ?? '';
      const fb = b.fecha_actualizacion ?? b.fecha_creacion ?? '';
      return fb.localeCompare(fa);
    });
  }

  get contadorPorEstado(): Record<string, number> {
    const todos        = [...this.planteamientos()];
    const idCancelado  = this.catalog.getIdEstadoPlanteamiento('Cancelado')  || 4;
    const idFinalizado = this.catalog.getIdEstadoPlanteamiento('Finalizado') || 5;
    return {
      pendiente:  todos.filter(p => p.id_estado === 1).length,
      aprobado:   todos.filter(p => p.id_estado === 2).length,
      rechazado:  todos.filter(p => p.id_estado === 3).length,
      cancelado:  todos.filter(p => p.id_estado === idCancelado).length,
      finalizado: todos.filter(p => p.id_estado === idFinalizado).length,
    };
  }

  tieneProyecto(id: number): boolean {
    return this.planteamientosConProyectoIds.has(id);
  }

  getNombreEstado(id: number): string {
    return this.estadosPlanteamiento.find(e => e.id_estado === id)?.nombre_estado ?? '—';
  }

  getTituloSolicitud(id: number): string {
    return this.solicitudesAprobadas().find(s => s.id_solicitud === id)?.titulo_solicitud ?? '—';
  }

  getBadgeEstado(id: number): string {
    const idCancelado  = this.catalog.getIdEstadoPlanteamiento('Cancelado')  || 4;
    const idFinalizado = this.catalog.getIdEstadoPlanteamiento('Finalizado') || 5;
    const mapa: Record<number, string> = {
      1: 'bg-amber-100 text-amber-700 border-amber-200',
      2: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      3: 'bg-red-100 text-red-500 border-red-200',
      [idCancelado]:  'bg-rose-100 text-rose-700 border-rose-200',
      [idFinalizado]: 'bg-teal-100 text-teal-700 border-teal-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  getArchivosDePlanteamiento(id: number): Archivo[] {
    return this.archivos.filter(a => a.id_planteamiento === id);
  }

  async abrirDetalle(p: PlanteamientoProyecto): Promise<void> {
    this.planteamientoSeleccionado = p;
    this.mostrarModalDetalle       = true;
    this.archivos                  = [];

    const [archPlan, archSol] = await Promise.all([
      this.dataService.getAll<Archivo>('archivo', { filters: { id_planteamiento: p.id_planteamiento } }),
      this.dataService.getAll<Archivo>('archivo', { filters: { id_solicitud: p.id_solicitud } }),
    ]);
    this.archivos = [
      ...(archSol.data  ?? []),
      ...(archPlan.data ?? []),
    ];
    this.cdr.detectChanges();
  }

  cerrarDetalle(): void {
    this.mostrarModalDetalle      = false;
    this.planteamientoSeleccionado = null;
  }

  abrirAprobar(p: PlanteamientoProyecto): void {
    this.planteamientoAccion  = p;
    this.mostrarModalAprobar  = true;
  }

  async confirmarAprobar(): Promise<void> {
    if (!this.planteamientoAccion) return;
    const id  = this.planteamientoAccion.id_planteamiento;
    const now = new Date().toISOString();
    await this.dataService.update('planteamiento_proyecto', id, { id_estado: 2, fecha_actualizacion: now }, 'id_planteamiento');
    this.planteamientos.update(lista =>
      lista.map(p => p.id_planteamiento === id ? { ...p, id_estado: 2, fecha_actualizacion: now } : p)
    );
    this.cancelarAccion();
  }

  abrirRechazar(p: PlanteamientoProyecto): void {
    this.planteamientoAccion  = p;
    this.mostrarModalRechazar = true;
  }

  async confirmarRechazar(): Promise<void> {
    if (!this.planteamientoAccion) return;
    const id  = this.planteamientoAccion.id_planteamiento;
    const now = new Date().toISOString();
    await this.dataService.update('planteamiento_proyecto', id, { id_estado: 3, fecha_actualizacion: now }, 'id_planteamiento');
    this.planteamientos.update(lista =>
      lista.map(p => p.id_planteamiento === id ? { ...p, id_estado: 3, fecha_actualizacion: now } : p)
    );
    this.cancelarAccion();
  }

  cancelarAccion(): void {
    this.mostrarModalAprobar  = false;
    this.mostrarModalRechazar = false;
    this.planteamientoAccion  = null;
  }
}
