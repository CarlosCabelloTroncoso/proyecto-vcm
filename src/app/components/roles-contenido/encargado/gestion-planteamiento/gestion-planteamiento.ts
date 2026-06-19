import { Component, OnInit, inject, signal } from '@angular/core';
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

  constructor(private dataService: DataService, private catalog: CatalogService) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estadosPlanteamiento = this.catalog.estadosPlanteamiento();
    const planteamientosRes = await this.dataService.getAll<any>('planteamiento_proyecto', { select: `*, estado_planteamiento(nombre_estado), carrera(nombre_carrera), solicitud(titulo_solicitud), usuario(nombres_usuario, apellidos_usuario)`, filters: { is_active: true } });
    if (planteamientosRes.data) this.planteamientos.set(planteamientosRes.data);
  }


  // Carrera del gestor filtrada via RLS

  estadosPlanteamiento: EstadoPlanteamiento[] = [];

  solicitudesAprobadas = signal<Solicitud[]>([]);

  planteamientos = signal<PlanteamientoProyecto[]>([]);

  archivos: Archivo[] = [];

  filtroActivo: 'pendiente' | 'aprobado' | 'rechazado' = 'pendiente';
  searchTerm = '';

  mostrarModalDetalle   = false;
  planteamientoSeleccionado: PlanteamientoProyecto | null = null;

  mostrarModalAprobar   = false;
  mostrarModalRechazar  = false;
  planteamientoAccion:  PlanteamientoProyecto | null = null;

  get planteamientosFiltrados(): PlanteamientoProyecto[] {
    const idEstado = this.filtroActivo === 'pendiente' ? 1 : this.filtroActivo === 'aprobado' ? 2 : 3;
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
    return lista;
  }

  get contadorPorEstado(): Record<string, number> {
    const todos = [...this.planteamientos()];
    return {
      pendiente: todos.filter(p => p.id_estado === 1).length,
      aprobado:  todos.filter(p => p.id_estado === 2).length,
      rechazado: todos.filter(p => p.id_estado === 3).length,
    };
  }

  getNombreEstado(id: number): string {
    return this.estadosPlanteamiento.find(e => e.id_estado === id)?.nombre_estado ?? '—';
  }

  getTituloSolicitud(id: number): string {
    return this.solicitudesAprobadas().find(s => s.id_solicitud === id)?.titulo_solicitud ?? '—';
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100 text-amber-700 border-amber-200',
      2: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      3: 'bg-red-100 text-red-500 border-red-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  getArchivosDePlanteamiento(id: number): Archivo[] {
    return this.archivos.filter(a => a.id_planteamiento === id);
  }

  abrirDetalle(p: PlanteamientoProyecto): void {
    this.planteamientoSeleccionado = p;
    this.mostrarModalDetalle       = true;
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
    const id = this.planteamientoAccion.id_planteamiento;
    await this.dataService.update('planteamiento_proyecto', id, { id_estado: 2 }, 'id_planteamiento');
    this.planteamientos.update(lista =>
      lista.map(p => p.id_planteamiento === id ? { ...p, id_estado: 2 } : p)
    );
    this.cancelarAccion();
  }

  abrirRechazar(p: PlanteamientoProyecto): void {
    this.planteamientoAccion  = p;
    this.mostrarModalRechazar = true;
  }

  async confirmarRechazar(): Promise<void> {
    if (!this.planteamientoAccion) return;
    const id = this.planteamientoAccion.id_planteamiento;
    await this.dataService.update('planteamiento_proyecto', id, { id_estado: 3 }, 'id_planteamiento');
    this.planteamientos.update(lista =>
      lista.map(p => p.id_planteamiento === id ? { ...p, id_estado: 3 } : p)
    );
    this.cancelarAccion();
  }

  cancelarAccion(): void {
    this.mostrarModalAprobar  = false;
    this.mostrarModalRechazar = false;
    this.planteamientoAccion  = null;
  }
}
