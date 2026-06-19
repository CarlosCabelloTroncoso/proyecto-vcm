import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlanteamientoProyecto, EstadoPlanteamiento } from '../../../../interfaces/proyecto.interface';
import { Solicitud } from '../../../../interfaces/solicitud.interface';
import { ModalDetallePlanteamiento } from '../../../shared/modal-detalle-planteamiento/modal-detalle-planteamiento';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

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
export class GestionProyecto implements OnInit {
  estadosProyecto: any[] = [];

  constructor(private dataService: DataService, private catalog: CatalogService) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estadosProyecto = this.catalog.estadosProyecto();
    const proyectosRes = await this.dataService.getAll<any>('proyecto', {
      select: `*, estado_proyecto(nombre_estado), planteamiento_proyecto(titulo_planteamiento, tiempo_estimado_planteamiento, id_carrera, id_solicitud, solicitud(titulo_solicitud), carrera(nombre_carrera))`,
      filters: { is_active: true },
    });
    if (proyectosRes.data) {
      const mapped = proyectosRes.data.map((p: any): ProyectoVista => ({
        id:                   p.id_proyecto,
        titulo:               p.planteamiento_proyecto?.titulo_planteamiento ?? `Proyecto #${p.id_proyecto}`,
        planteamiento_origen: p.planteamiento_proyecto?.titulo_planteamiento ?? '—',
        solicitud_origen:     p.planteamiento_proyecto?.solicitud?.titulo_solicitud ?? '—',
        tiempo_estimado:      p.planteamiento_proyecto?.tiempo_estimado_planteamiento ?? '—',
        fecha_inicio:         p.fecha_inicio ?? undefined,
        fecha_termino:        p.fecha_fin ?? undefined,
        estado:               ((p.estado_proyecto?.nombre_estado ?? '') as string)
                                .toLowerCase().replace(/ /g, '_') as EstadoProyectoKey,
        planteamiento:        p.planteamiento_proyecto,
      }));
      this.proyectos.set(mapped);
      // Auto-seleccionar primer tab con datos si el tab actual está vacío
      if (mapped.length > 0 && !mapped.some(p => p.estado === this.filtroActivo)) {
        this.filtroActivo = mapped[0].estado;
      }
    }
  }


  filtroActivo: EstadoProyectoKey = 'disponible';

  proyectos = signal<ProyectoVista[]>([]);

  // ── Modal detalle planteamiento ────────────────────────────────────
  mostrarModalDetalle = false;
  planteamientoDetalle: PlanteamientoProyecto | null = null;

  estadosPlanteamiento: EstadoPlanteamiento[] = [];

  solicitudesReferencia: Solicitud[] = [];

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
    return this.proyectos().filter(p => p.estado === this.filtroActivo);
  }

  get contadorPorEstado(): Record<EstadoProyectoKey, number> {
    const claves: EstadoProyectoKey[] = ['disponible', 'en_proceso', 'pausado', 'atrasado', 'finalizado', 'cancelado'];
    return claves.reduce((acc, e) => {
      acc[e] = this.proyectos().filter(p => p.estado === e).length;
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
