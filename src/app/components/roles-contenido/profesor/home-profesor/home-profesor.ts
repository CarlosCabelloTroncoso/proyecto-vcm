import { Component, inject, computed, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';

interface EntradaActividad {
  titulo: string;
  mensaje: string;
  tipo: 'planteamiento' | 'proyecto';
  estadoId: number;
  estadoNombre: string;
  fechaDisplay: string;
  esNuevo: boolean;
}

@Component({
  selector: 'app-home-profesor',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-profesor.html',
  styleUrl: './home-profesor.css',
})
export class HomeProfesor implements OnInit {
  private auth = inject(AuthService);
  private data = inject(DataService);
  private cdr  = inject(ChangeDetectorRef);

  nombre = computed(() => this.auth.usuario()?.nombres_usuario ?? 'Usuario');

  private planteamientos = signal<any[]>([]);
  private proyectos      = signal<any[]>([]);

  pendientes = computed(() => this.planteamientos().filter(p => p.id_estado === 1).length);
  aprobados  = computed(() => this.planteamientos().filter(p => p.id_estado === 2).length);
  rechazados = computed(() => this.planteamientos().filter(p => p.id_estado === 3).length);
  enCurso    = computed(() => this.proyectos().length);

  actividad = computed<EntradaActividad[]>(() => {
    type Item = { entry: EntradaActividad; date: string; id: number };

    const planMap = new Map(
      this.planteamientos().map(p => [p.id_planteamiento, p.titulo_planteamiento])
    );

    const planItems: Item[] = this.planteamientos().map(p => ({
      entry: {
        tipo:         'planteamiento' as const,
        titulo:       p.titulo_planteamiento,
        mensaje:      this.mensajePorEstado(p.id_estado, p.titulo_planteamiento),
        estadoId:     p.id_estado,
        estadoNombre: '',
        fechaDisplay: this.buildFechaDisplay(p),
        esNuevo:      this.esReciente(p.fecha_actualizacion),
      },
      date: p.fecha_actualizacion ?? p.fecha_creacion ?? '',
      id:   p.id_planteamiento,
    }));

    const proyItems: Item[] = this.proyectos().map((pr: any) => {
      const titulo       = planMap.get(pr.id_planteamiento) ?? `Proyecto #${pr.id_proyecto}`;
      const estadoNombre = ((pr.estado_proyecto?.nombre_estado ?? 'En curso') as string)
                            .toLowerCase().replace(/ /g, '_');
      return {
        entry: {
          tipo:         'proyecto' as const,
          titulo,
          mensaje:      `Tu proyecto "${titulo}" está ${estadoNombre.replace(/_/g, ' ')}`,
          estadoId:     pr.id_estado,
          estadoNombre,
          fechaDisplay: pr.fecha_inicio ? `Inicio: ${this.formatFecha(pr.fecha_inicio)}` : '—',
          esNuevo:      this.esReciente(pr.fecha_inicio),
        },
        date: pr.fecha_inicio ?? '',
        id:   -(pr.id_proyecto as number),
      };
    });

    return [...planItems, ...proyItems]
      .sort((a, b) => {
        if (a.date && b.date) {
          const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
          return diff !== 0 ? diff : b.id - a.id;
        }
        return a.date ? -1 : b.date ? 1 : 0;
      })
      .map(item => item.entry);
  });

  private mensajePorEstado(estado: number, titulo: string): string {
    switch (estado) {
      case 2:  return `Tu planteamiento "${titulo}" fue aprobado`;
      case 3:  return `Tu planteamiento "${titulo}" fue rechazado`;
      case 4:  return `Tu planteamiento "${titulo}" fue cancelado`;
      default: return `Tu planteamiento "${titulo}" está pendiente de revisión`;
    }
  }

  private buildFechaDisplay(p: any): string {
    if (p.fecha_actualizacion) {
      return `Actualizado el ${this.formatFecha(p.fecha_actualizacion)}`;
    }
    if (p.fecha_creacion) {
      return this.formatFecha(p.fecha_creacion);
    }
    return '—';
  }

  private formatFecha(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('es-CL', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  private esReciente(fecha?: string | null): boolean {
    if (!fecha) return false;
    return Date.now() - new Date(fecha).getTime() < 24 * 60 * 60 * 1000;
  }

  async ngOnInit(): Promise<void> {
    const idUsuario = this.auth.usuario()?.id_usuario;
    if (!idUsuario) return;

    const planRes = await this.data.getAll<any>('planteamiento_proyecto', {
      select:  'id_planteamiento, titulo_planteamiento, id_estado, fecha_creacion, fecha_actualizacion',
      filters: { id_usuario: idUsuario, is_active: true },
    });

    if (planRes.data) {
      this.planteamientos.set(planRes.data);
      this.cdr.detectChanges();
    }

    const misIds = new Set((planRes.data ?? []).map((p: any) => p.id_planteamiento));
    if (misIds.size > 0) {
      const proyRes = await this.data.getAll<any>('proyecto', {
        select:  'id_proyecto, id_planteamiento, id_estado, fecha_inicio, estado_proyecto(nombre_estado)',
        filters: { is_active: true },
      });
      if (proyRes.data) {
        this.proyectos.set(proyRes.data.filter((p: any) => misIds.has(p.id_planteamiento)));
        this.cdr.detectChanges();
      }
    }
  }
}
