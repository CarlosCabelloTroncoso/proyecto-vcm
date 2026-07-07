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
  id_planteamiento: number;
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

  private auth = inject(AuthService);

  nombreCarrera = '';

  constructor(private dataService: DataService, private catalog: CatalogService) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estadosProyecto = this.catalog.estadosProyecto();

    const idCarrera = this.auth.usuario()?.gestor_vinculacion_carrera?.id_carrera;
    if (idCarrera) {
      this.nombreCarrera = this.catalog.carreras().find(c => c.id_carrera === idCarrera)?.nombre_carrera ?? '';
    }
    const proyectosRes = await this.dataService.getAll<any>('proyecto', {
      select: `*, estado_proyecto(nombre_estado), planteamiento_proyecto(titulo_planteamiento, tiempo_estimado_planteamiento, id_carrera, id_solicitud, solicitud(titulo_solicitud), carrera(nombre_carrera))`,
      filters: { is_active: true },
    });
    if (proyectosRes.data) {
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      const terminales: EstadoProyectoKey[] = ['finalizado', 'cancelado'];
      const idEstadoAtrasado  = this.catalog.getIdEstadoProyecto('Atrasado');
      const idEstadoEnProceso = this.catalog.getIdEstadoProyecto('En proceso');
      const idsAMarcarAtrasado: number[] = [];
      const idsAIniciar: number[] = [];

      const mapped = proyectosRes.data.map((p: any): ProyectoVista => {
        const estadoRaw = ((p.estado_proyecto?.nombre_estado ?? '') as string)
          .toLowerCase().replace(/ /g, '_') as EstadoProyectoKey;
        const fechaInicio = p.fecha_inicio ? new Date(p.fecha_inicio + 'T00:00:00') : null;
        const fechaFin    = p.fecha_fin    ? new Date(p.fecha_fin    + 'T00:00:00') : null;
        let estado = estadoRaw;

        // Disponible → En proceso cuando llega la fecha de inicio
        if (estadoRaw === 'disponible' && fechaInicio && fechaInicio <= hoy) {
          estado = 'en_proceso';
          idsAIniciar.push(p.id_proyecto);
        }

        // No-terminal → Atrasado cuando se pasa la fecha de término
        if (fechaFin && fechaFin < hoy && !terminales.includes(estado) && estado !== 'atrasado' && estadoRaw !== 'disponible') {
          estado = 'atrasado';
          idsAMarcarAtrasado.push(p.id_proyecto);
        }

        return {
          id:                   p.id_proyecto,
          id_planteamiento:     p.id_planteamiento,
          titulo:               p.planteamiento_proyecto?.titulo_planteamiento ?? `Proyecto #${p.id_proyecto}`,
          planteamiento_origen: p.planteamiento_proyecto?.titulo_planteamiento ?? '—',
          solicitud_origen:     p.planteamiento_proyecto?.solicitud?.titulo_solicitud ?? '—',
          tiempo_estimado:      p.planteamiento_proyecto?.tiempo_estimado_planteamiento ?? '—',
          fecha_inicio:         p.fecha_inicio ?? undefined,
          fecha_termino:        p.fecha_fin ?? undefined,
          estado,
          planteamiento:        p.planteamiento_proyecto,
        };
      });
      this.proyectos.set(mapped);
      if (mapped.length > 0 && !mapped.some(p => p.estado === this.filtroActivo)) {
        this.filtroActivo = mapped[0].estado;
      }
      await Promise.all([
        ...(idEstadoAtrasado && idsAMarcarAtrasado.length > 0
          ? idsAMarcarAtrasado.map(id =>
              this.dataService.update('proyecto', id, { id_estado: idEstadoAtrasado }, 'id_proyecto')
            )
          : []),
        ...(idEstadoEnProceso && idsAIniciar.length > 0
          ? idsAIniciar.map(id =>
              this.dataService.update('proyecto', id, { id_estado: idEstadoEnProceso }, 'id_proyecto')
            )
          : []),
      ]);
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

  // "Disponible" NO se asigna manualmente: es automatico (ver estados de proyecto).
  // Por eso no aparece en el droplist de cambio de estado del encargado.
  readonly ESTADOS_ASIGNABLES: { key: EstadoProyectoKey; label: string }[] = [
    { key: 'en_proceso', label: 'En proceso' },
    { key: 'pausado',    label: 'Pausado'    },
    { key: 'finalizado', label: 'Finalizado' },
    { key: 'cancelado',  label: 'Cancelado'  },
  ];

  readonly ESTADOS_TERMINALES: EstadoProyectoKey[] = ['finalizado', 'cancelado'];

  // ── Getters ───────────────────────────────────────────────────────

  get proyectosFiltrados(): ProyectoVista[] {
    return this.proyectos()
      .filter(p => p.estado === this.filtroActivo)
      .sort((a, b) => b.id - a.id);
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

  async cambiarEstado(proyecto: ProyectoVista, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value as EstadoProyectoKey;
    if (!nuevoEstado) return;

    if (nuevoEstado === 'finalizado') {
      const { error } = await this.dataService.rpc('finalizar_proyecto', { p_id_proyecto: proyecto.id });
      if (!error) {
        this.proyectos.update(lista =>
          lista.map(p => p.id === proyecto.id ? { ...p, estado: nuevoEstado } : p)
        );
      } else {
        console.error('Error al finalizar proyecto:', error);
      }
    } else {
      const idEstado = this.catalog.getIdEstadoProyecto(this.getNombreEstado(nuevoEstado));
      if (idEstado) {
        const { error } = await this.dataService.update('proyecto', proyecto.id, { id_estado: idEstado }, 'id_proyecto');
        if (!error) {
          this.proyectos.update(lista =>
            lista.map(p => p.id === proyecto.id ? { ...p, estado: nuevoEstado } : p)
          );
          if (nuevoEstado === 'cancelado' && proyecto.id_planteamiento) {
            const idCancelado = this.catalog.getIdEstadoPlanteamiento('Cancelado') || 4;
            await this.dataService.update(
              'planteamiento_proyecto',
              proyecto.id_planteamiento,
              { id_estado: idCancelado, fecha_actualizacion: new Date().toISOString() },
              'id_planteamiento'
            );
          }
        } else {
          console.error('Error al cambiar estado del proyecto:', error);
        }
      }
    }
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
