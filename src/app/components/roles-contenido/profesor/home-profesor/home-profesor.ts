import { Component, inject, computed, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';

interface EntradaActividad {
  titulo: string;
  mensaje: string;
  estado: number;
  fecha: string;
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

  actividad = computed<EntradaActividad[]>(() =>
    [...this.planteamientos()]
      .map(p => ({
        titulo:  p.titulo_planteamiento,
        mensaje: this.mensajePorEstado(p.id_estado, p.titulo_planteamiento),
        estado:  p.id_estado,
        fecha:   '—',
      }))
  );

  private mensajePorEstado(estado: number, titulo: string): string {
    switch (estado) {
      case 1: return `Tu planteamiento "${titulo}" está pendiente de revisión`;
      case 2: return `Tu planteamiento "${titulo}" fue aprobado`;
      case 3: return `Tu planteamiento "${titulo}" fue rechazado`;
      default: return `Tu planteamiento "${titulo}" fue actualizado`;
    }
  }

  private formatFecha(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  async ngOnInit(): Promise<void> {
    const idUsuario = this.auth.usuario()?.id_usuario;
    if (!idUsuario) return;

    const planRes = await this.data.getAll<any>('planteamiento_proyecto', {
      select: 'id_planteamiento, titulo_planteamiento, id_estado',
      filters: { id_usuario: idUsuario, is_active: true },
    });

    if (planRes.data) {
      this.planteamientos.set(planRes.data);
      this.cdr.detectChanges();
    }

    const misIds = new Set((planRes.data ?? []).map((p: any) => p.id_planteamiento));
    if (misIds.size > 0) {
      const proyRes = await this.data.getAll<any>('proyecto', {
        select: 'id_proyecto, id_planteamiento, id_estado',
        filters: { is_active: true },
      });
      if (proyRes.data) {
        this.proyectos.set(proyRes.data.filter((p: any) => misIds.has(p.id_planteamiento)));
        this.cdr.detectChanges();
      }
    }
  }
}
