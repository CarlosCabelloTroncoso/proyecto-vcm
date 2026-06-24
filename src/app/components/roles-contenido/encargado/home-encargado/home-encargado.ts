import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';

interface EntradaActividad {
  mensaje: string;
  tipo: 'solicitud' | 'planteamiento' | 'proyecto';
  estado: number;
  colorIcono: 'verde' | 'rojo' | 'ambar';
  fechaDisplay: string;
  esNuevo: boolean;
  fechaOrden: string;
}

@Component({
  selector: 'app-home-encargado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-encargado.html',
  styleUrl: './home-encargado.css',
})
export class HomeEncargado implements OnInit {
  private auth = inject(AuthService);
  private data = inject(DataService);
  private cdr  = inject(ChangeDetectorRef);

  nombre = computed(() => this.auth.usuario()?.nombres_usuario ?? 'Encargado');

  private solicitudes    = signal<any[]>([]);
  private planteamientos = signal<any[]>([]);
  private proyectos      = signal<any[]>([]);

  solicitudesPendientes = computed(() => this.solicitudes().filter(s => s.id_estado === 1).length);
  solicitudesAprobadas  = computed(() => this.solicitudes().filter(s => s.id_estado === 2).length);
  solicitudesRechazadas = computed(() => this.solicitudes().filter(s => s.id_estado === 3).length);

  planteamientosPendientes = computed(() => this.planteamientos().filter(p => p.id_estado === 1).length);
  planteamientosAprobados  = computed(() => this.planteamientos().filter(p => p.id_estado === 2).length);
  planteamientosRechazados = computed(() => this.planteamientos().filter(p => p.id_estado === 3).length);

  totalProyectos = computed(() => this.proyectos().length);

  actividad = computed<EntradaActividad[]>(() => {
    const entrSol = this.solicitudes().map(s => ({
      mensaje:      this.mensajeSolicitud(s.id_estado, s.titulo_solicitud),
      tipo:         'solicitud' as const,
      estado:       s.id_estado,
      colorIcono:   s.id_estado === 2 ? 'verde' as const : s.id_estado === 3 ? 'rojo' as const : 'ambar' as const,
      fechaDisplay: this.buildFechaSolicitud(s),
      esNuevo:      this.esReciente(s.fecha_actualizacion),
      fechaOrden:   s.fecha_actualizacion ?? s.fecha_creacion_solicitud ?? '',
    }));

    const entrPlan = this.planteamientos().map(p => ({
      mensaje:      this.mensajePlanteamiento(p.id_estado, p.titulo_planteamiento),
      tipo:         'planteamiento' as const,
      estado:       p.id_estado,
      colorIcono:   p.id_estado === 2 ? 'verde' as const : p.id_estado === 3 ? 'rojo' as const : 'ambar' as const,
      fechaDisplay: this.buildFechaPlanteamiento(p),
      esNuevo:      this.esReciente(p.fecha_actualizacion),
      fechaOrden:   p.fecha_actualizacion ?? p.fecha_creacion ?? '',
    }));

    const entrProy = this.proyectos().map(p => {
      const titulo      = p.planteamiento_proyecto?.titulo_planteamiento ?? `Proyecto #${p.id_proyecto}`;
      const nombreEst   = (p.estado_proyecto?.nombre_estado ?? '').toLowerCase().replace(/ /g, '_');
      return {
        mensaje:      this.mensajeProyecto(nombreEst, titulo),
        tipo:         'proyecto' as const,
        estado:       p.id_estado,
        colorIcono:   nombreEst === 'finalizado' ? 'verde' as const : nombreEst === 'cancelado' ? 'rojo' as const : 'ambar' as const,
        fechaDisplay: p.fecha_inicio ? `Iniciado el ${this.formatFechaDate(p.fecha_inicio)}` : '—',
        esNuevo:      false,
        fechaOrden:   p.fecha_inicio ?? '',
      };
    });

    return [...entrSol, ...entrPlan, ...entrProy].sort((a, b) => {
      if (a.fechaOrden && b.fechaOrden) {
        return new Date(b.fechaOrden).getTime() - new Date(a.fechaOrden).getTime();
      }
      return b.fechaOrden ? 1 : -1;
    });
  });

  private mensajeSolicitud(estado: number, titulo: string): string {
    switch (estado) {
      case 2:  return `Solicitud "${titulo}" fue aprobada`;
      case 3:  return `Solicitud "${titulo}" fue rechazada`;
      default: return `Nueva solicitud "${titulo}" esperando revisión`;
    }
  }

  private mensajePlanteamiento(estado: number, titulo: string): string {
    switch (estado) {
      case 2:  return `Planteamiento "${titulo}" fue aprobado`;
      case 3:  return `Planteamiento "${titulo}" fue rechazado`;
      default: return `Planteamiento "${titulo}" esperando revisión`;
    }
  }

  private mensajeProyecto(nombreEstado: string, titulo: string): string {
    switch (nombreEstado) {
      case 'finalizado': return `Proyecto "${titulo}" fue finalizado`;
      case 'cancelado':  return `Proyecto "${titulo}" fue cancelado`;
      case 'en_proceso': return `Proyecto "${titulo}" está en proceso`;
      case 'pausado':    return `Proyecto "${titulo}" está pausado`;
      case 'atrasado':   return `Proyecto "${titulo}" está atrasado`;
      default:           return `Proyecto "${titulo}" disponible`;
    }
  }

  private buildFechaSolicitud(s: any): string {
    if (s.fecha_actualizacion) {
      return `Actualizado el ${this.formatFechaISO(s.fecha_actualizacion)}`;
    }
    if (s.fecha_creacion_solicitud) {
      return this.formatFechaDate(s.fecha_creacion_solicitud);
    }
    return '—';
  }

  private buildFechaPlanteamiento(p: any): string {
    if (p.fecha_actualizacion) {
      return `Actualizado el ${this.formatFechaISO(p.fecha_actualizacion)}`;
    }
    if (p.fecha_creacion) {
      return this.formatFechaISO(p.fecha_creacion);
    }
    return '—';
  }

  private formatFechaISO(iso: string): string {
    return new Date(iso).toLocaleString('es-CL', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  private formatFechaDate(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${d} ${meses[+m - 1]} ${y}`;
  }

  private esReciente(fecha?: string | null): boolean {
    if (!fecha) return false;
    return Date.now() - new Date(fecha).getTime() < 24 * 60 * 60 * 1000;
  }

  async ngOnInit(): Promise<void> {
    const [solRes, planRes, proyRes] = await Promise.all([
      this.data.getAll<any>('solicitud', {
        select:  'id_solicitud, titulo_solicitud, id_estado, fecha_creacion_solicitud, fecha_actualizacion',
        filters: { is_active: true },
      }),
      this.data.getAll<any>('planteamiento_proyecto', {
        select:  'id_planteamiento, titulo_planteamiento, id_estado, fecha_creacion, fecha_actualizacion',
        filters: { is_active: true },
      }),
      this.data.getAll<any>('proyecto', {
        select:  'id_proyecto, id_estado, fecha_inicio, estado_proyecto(nombre_estado), planteamiento_proyecto(titulo_planteamiento)',
        filters: { is_active: true },
      }),
    ]);

    if (solRes.data)  this.solicitudes.set(solRes.data);
    if (planRes.data) this.planteamientos.set(planRes.data);
    if (proyRes.data) this.proyectos.set(proyRes.data);
    this.cdr.detectChanges();
  }
}
