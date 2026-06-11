import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlanteamientoProyecto, EstadoPlanteamiento } from '../../../../interfaces/proyecto.interface';
import { Solicitud } from '../../../../interfaces/solicitud.interface';
import { ModalDetallePlanteamiento } from '../../../shared/modal-detalle-planteamiento/modal-detalle-planteamiento';

type EstadoProyectoKey = 'disponible' | 'en_proceso' | 'pausado' | 'atrasado' | 'finalizado' | 'cancelado';

interface ProyectoVista {
  id: number;
  titulo: string;
  planteamiento_origen: string;
  solicitud_origen: string;
  tiempo_estimado: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  estado: EstadoProyectoKey;
  planteamiento?: PlanteamientoProyecto;
}

@Component({
  selector: 'app-gestion-proyecto',
  imports: [CommonModule, FormsModule, RouterLink, ModalDetallePlanteamiento],
  templateUrl: './gestion-proyecto.html',
  styleUrl: './gestion-proyecto.css',
})
export class GestionProyecto {

  filtroActivo: EstadoProyectoKey = 'disponible';

  proyectos: ProyectoVista[] = [
    {
      id: 1,
      titulo: 'Sistema de gestión de voluntarios',
      planteamiento_origen: 'Sistema de gestión de voluntarios',
      solicitud_origen: 'App móvil para servicios comunitarios',
      tiempo_estimado: '4 meses',
      estado: 'disponible',
      planteamiento: {
        id_planteamiento: 1,
        titulo_planteamiento: 'Sistema de gestión de voluntarios',
        descripcion_planteamiento: 'Desarrollo de una plataforma digital para coordinar y gestionar voluntarios en organizaciones comunitarias. Incluye registro, asignación de tareas y seguimiento de actividades.',
        tiempo_estimado_planteamiento: '4 meses',
        id_carrera: 1,
        id_solicitud: 1,
        id_usuario: 1,
        id_estado: 2,
      },
    },
    {
      id: 2,
      titulo: 'Dashboard de transparencia ciudadana',
      planteamiento_origen: 'Dashboard de transparencia',
      solicitud_origen: 'Portal de transparencia ciudadana',
      tiempo_estimado: '3 meses',
      estado: 'disponible',
      planteamiento: {
        id_planteamiento: 2,
        titulo_planteamiento: 'Dashboard de transparencia',
        descripcion_planteamiento: 'Portal interactivo para visualizar datos públicos e indicadores de gestión municipal en tiempo real.',
        tiempo_estimado_planteamiento: '3 meses',
        id_carrera: 1,
        id_solicitud: 2,
        id_usuario: 2,
        id_estado: 2,
      },
    },
    {
      id: 3,
      titulo: 'Portal de trámites digitales Talca',
      planteamiento_origen: 'Portal de trámites online',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '6 meses',
      fecha_inicio: '2025-03-01',
      estado: 'en_proceso',
    },
    {
      id: 4,
      titulo: 'Sistema de agenda comunitaria',
      planteamiento_origen: 'Agenda digital comunitaria',
      solicitud_origen: 'App móvil para servicios comunitarios',
      tiempo_estimado: '4 meses',
      fecha_inicio: '2025-01-10',
      estado: 'pausado',
    },
    {
      id: 5,
      titulo: 'App de seguimiento de solicitudes',
      planteamiento_origen: 'Seguimiento en tiempo real',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '2 meses',
      fecha_inicio: '2025-02-01',
      estado: 'atrasado',
    },
    {
      id: 6,
      titulo: 'Módulo de pagos en línea UCM',
      planteamiento_origen: 'Pasarela de pagos institucional',
      solicitud_origen: 'Portal de transparencia ciudadana',
      tiempo_estimado: '3 meses',
      fecha_inicio: '2024-06-01',
      fecha_termino: '2024-09-05',
      estado: 'finalizado',
    },
    {
      id: 7,
      titulo: 'Plataforma de reportes municipales',
      planteamiento_origen: 'Sistema de reportes automáticos',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '5 meses',
      fecha_inicio: '2024-09-15',
      fecha_termino: '2025-01-10',
      estado: 'cancelado',
    },
  ];

  // ── Modal detalle planteamiento ────────────────────────────────────
  mostrarModalDetalle = false;
  planteamientoDetalle: PlanteamientoProyecto | null = null;

  estadosPlanteamiento: EstadoPlanteamiento[] = [
    { id_estado: 1, nombre_estado: 'Pendiente',  descripcion_estado: 'Pendiente de revisión' },
    { id_estado: 2, nombre_estado: 'Aprobado',   descripcion_estado: 'Aprobado para proyecto' },
    { id_estado: 3, nombre_estado: 'Rechazado',  descripcion_estado: 'Rechazado' },
  ];

  solicitudesReferencia: Solicitud[] = [
    { id_solicitud: 1, titulo_solicitud: 'App móvil para servicios comunitarios',        descripcion_solicitud: '', fecha_creacion_solicitud: '2024-01-10', id_estado: 2, id_usuario: 1, id_carrera: 1, id_ciudad: 1 },
    { id_solicitud: 2, titulo_solicitud: 'Portal de transparencia ciudadana',             descripcion_solicitud: '', fecha_creacion_solicitud: '2024-02-15', id_estado: 2, id_usuario: 2, id_carrera: 1, id_ciudad: 1 },
    { id_solicitud: 3, titulo_solicitud: 'Digitalización de trámites municipales Talca', descripcion_solicitud: '', fecha_creacion_solicitud: '2024-03-20', id_estado: 2, id_usuario: 3, id_carrera: 1, id_ciudad: 1 },
  ];

  // ── Constantes ────────────────────────────────────────────────────

  readonly ESTADOS_ASIGNABLES: { key: EstadoProyectoKey; label: string }[] = [
    { key: 'en_proceso', label: 'En proceso' },
    { key: 'pausado',    label: 'Pausado'    },
    { key: 'atrasado',   label: 'Atrasado'   },
    { key: 'finalizado', label: 'Finalizado' },
    { key: 'cancelado',  label: 'Cancelado'  },
  ];

  readonly ESTADOS_TERMINALES: EstadoProyectoKey[] = ['finalizado', 'cancelado'];

  // ── Getters ───────────────────────────────────────────────────────

  get proyectosFiltrados(): ProyectoVista[] {
    return this.proyectos.filter(p => p.estado === this.filtroActivo);
  }

  get contadorPorEstado(): Record<EstadoProyectoKey, number> {
    const claves: EstadoProyectoKey[] = ['disponible', 'en_proceso', 'pausado', 'atrasado', 'finalizado', 'cancelado'];
    return claves.reduce((acc, e) => {
      acc[e] = this.proyectos.filter(p => p.estado === e).length;
      return acc;
    }, {} as Record<EstadoProyectoKey, number>);
  }

  // ── Métodos ───────────────────────────────────────────────────────

  esTerminal(estado: EstadoProyectoKey): boolean {
    return this.ESTADOS_TERMINALES.includes(estado);
  }

  getOpcionesEstado(estadoActual: EstadoProyectoKey): { key: EstadoProyectoKey; label: string }[] {
    return this.ESTADOS_ASIGNABLES.filter(e => e.key !== estadoActual);
  }

  cambiarEstado(proyecto: ProyectoVista, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value as EstadoProyectoKey;
    if (!nuevoEstado) return;
    proyecto.estado = nuevoEstado;
    select.value = '';
  }

  getBadgeEstado(estado: EstadoProyectoKey): string {
    const mapa: Record<EstadoProyectoKey, string> = {
      disponible: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      en_proceso: 'bg-blue-100 text-blue-700 border-blue-200',
      pausado:    'bg-amber-100 text-amber-700 border-amber-200',
      atrasado:   'bg-orange-100 text-orange-600 border-orange-200',
      finalizado: 'bg-teal-100 text-teal-700 border-teal-200',
      cancelado:  'bg-red-100 text-red-500 border-red-200',
    };
    return mapa[estado] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  getNombreEstado(estado: EstadoProyectoKey): string {
    const mapa: Record<EstadoProyectoKey, string> = {
      disponible: 'Disponible',
      en_proceso: 'En proceso',
      pausado:    'Pausado',
      atrasado:   'Atrasado',
      finalizado: 'Finalizado',
      cancelado:  'Cancelado',
    };
    return mapa[estado] ?? '—';
  }

  // ── Modal ─────────────────────────────────────────────────────────

  abrirDetalle(proyecto: ProyectoVista): void {
    if (!proyecto.planteamiento) return;
    this.planteamientoDetalle = proyecto.planteamiento;
    this.mostrarModalDetalle  = true;
  }

  cerrarDetalle(): void {
    this.mostrarModalDetalle  = false;
    this.planteamientoDetalle = null;
  }
}
