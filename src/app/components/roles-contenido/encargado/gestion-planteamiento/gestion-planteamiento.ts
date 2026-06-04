import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetallePlanteamiento } from '../../../shared/modal-detalle-planteamiento/modal-detalle-planteamiento';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';
import { PlanteamientoProyecto, EstadoPlanteamiento, Archivo } from '../../../../interfaces/proyecto.interface';
import { Solicitud } from '../../../../interfaces/solicitud.interface';
import { EncargadoCarrera } from '../../../../interfaces/usuario.interface';

@Component({
  selector: 'app-gestion-planteamiento',
  imports: [CommonModule, FormsModule, ModalDetallePlanteamiento, ModalConfirmar],
  templateUrl: './gestion-planteamiento.html',
  styleUrl: './gestion-planteamiento.css',
})
export class GestionPlanteamiento {

  readonly encargadoActual: EncargadoCarrera = { id_usuario: 10, id_carrera: 1 };

  estadosPlanteamiento: EstadoPlanteamiento[] = [
    { id_estado: 1, nombre_estado: 'Pendiente', descripcion_estado: 'En espera de revisión'   },
    { id_estado: 2, nombre_estado: 'Aprobado',  descripcion_estado: 'Planteamiento aceptado'  },
    { id_estado: 3, nombre_estado: 'Rechazado', descripcion_estado: 'No cumple los criterios' },
  ];

  solicitudesAprobadas: Solicitud[] = [
    {
      id_solicitud: 11, titulo_solicitud: 'App móvil para servicios comunitarios',
      descripcion_solicitud: '', fecha_creacion_solicitud: '2025-02-15',
      id_estado: 3, id_usuario: 3, id_carrera: 1, id_ciudad: 2,
    },
    {
      id_solicitud: 15, titulo_solicitud: 'Digitalización de trámites municipales Talca',
      descripcion_solicitud: '', fecha_creacion_solicitud: '2024-08-12',
      id_estado: 3, id_usuario: 5, id_carrera: 1, id_ciudad: 1,
    },
    {
      id_solicitud: 20, titulo_solicitud: 'Portal de transparencia ciudadana',
      descripcion_solicitud: '', fecha_creacion_solicitud: '2026-03-05',
      id_estado: 3, id_usuario: 6, id_carrera: 1, id_ciudad: 1,
    },
  ];

  planteamientos: PlanteamientoProyecto[] = [
    {
      id_planteamiento: 1,
      titulo_planteamiento: 'Sistema de gestión de voluntarios',
      descripcion_planteamiento: 'Plataforma para gestionar voluntarios y coordinadores comunitarios.',
      tiempo_estimado_planteamiento: '4 meses',
      id_carrera: 1, id_solicitud: 11, id_usuario: 20, id_estado: 2,
    },
    {
      id_planteamiento: 2,
      titulo_planteamiento: 'Portal de trámites online',
      descripcion_planteamiento: 'Sistema web para digitalizar trámites municipales con firma electrónica.',
      tiempo_estimado_planteamiento: '6 meses',
      id_carrera: 1, id_solicitud: 15, id_usuario: 20, id_estado: 3,
    },
    {
      id_planteamiento: 3,
      titulo_planteamiento: 'Dashboard de transparencia',
      descripcion_planteamiento: 'Tablero de control para publicación de datos municipales abiertos.',
      tiempo_estimado_planteamiento: '3 meses',
      id_carrera: 1, id_solicitud: 20, id_usuario: 20, id_estado: 1,
    },
  ];

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
    let lista = this.planteamientos.filter(
      p => p.id_carrera === this.encargadoActual.id_carrera && p.id_estado === idEstado
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
    const todos = this.planteamientos.filter(p => p.id_carrera === this.encargadoActual.id_carrera);
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
    return this.solicitudesAprobadas.find(s => s.id_solicitud === id)?.titulo_solicitud ?? '—';
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

  confirmarAprobar(): void {
    if (!this.planteamientoAccion) return;
    const idx = this.planteamientos.findIndex(
      p => p.id_planteamiento === this.planteamientoAccion!.id_planteamiento
    );
    if (idx > -1) this.planteamientos[idx] = { ...this.planteamientos[idx], id_estado: 2 };
    this.cancelarAccion();
  }

  abrirRechazar(p: PlanteamientoProyecto): void {
    this.planteamientoAccion  = p;
    this.mostrarModalRechazar = true;
  }

  confirmarRechazar(): void {
    if (!this.planteamientoAccion) return;
    const idx = this.planteamientos.findIndex(
      p => p.id_planteamiento === this.planteamientoAccion!.id_planteamiento
    );
    if (idx > -1) this.planteamientos[idx] = { ...this.planteamientos[idx], id_estado: 3 };
    this.cancelarAccion();
  }

  cancelarAccion(): void {
    this.mostrarModalAprobar  = false;
    this.mostrarModalRechazar = false;
    this.planteamientoAccion  = null;
  }
}
