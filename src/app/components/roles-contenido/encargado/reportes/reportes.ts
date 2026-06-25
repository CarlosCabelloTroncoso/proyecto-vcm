import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  private auth    = inject(AuthService);
  private data    = inject(DataService);
  private catalog = inject(CatalogService);

  /* ─── Metadatos pantalla ─────────────────────────────────────── */
  nombreCarrera   = '';
  fechaGeneracion = '';

  nombreEncargado = computed(() => {
    const u = this.auth.usuario();
    return u ? `${u.nombres_usuario} ${u.apellidos_usuario}` : '';
  });

  /* ─── Filtros (señales para reactividad en computed) ─────────── */
  filtroAnio = signal('');
  filtroMes  = signal('');

  readonly meses = [
    { valor: '01', nombre: 'Enero'      }, { valor: '02', nombre: 'Febrero'    },
    { valor: '03', nombre: 'Marzo'      }, { valor: '04', nombre: 'Abril'      },
    { valor: '05', nombre: 'Mayo'       }, { valor: '06', nombre: 'Junio'      },
    { valor: '07', nombre: 'Julio'      }, { valor: '08', nombre: 'Agosto'     },
    { valor: '09', nombre: 'Septiembre' }, { valor: '10', nombre: 'Octubre'    },
    { valor: '11', nombre: 'Noviembre'  }, { valor: '12', nombre: 'Diciembre'  },
  ];

  /* ─── Datos crudos ───────────────────────────────────────────── */
  private _solicitudes    = signal<any[]>([]);
  private _planteamientos = signal<any[]>([]);
  private _proyectos      = signal<any[]>([]);

  /* ─── IDs de estados dinámicos ───────────────────────────────── */
  private idCerradaSol   = signal(4);
  private idEnProcesoSol = signal(5);
  private idFinPlan      = signal(4);
  private idCancPlan     = signal(5);

  /* ─── Prefijo de fecha filtrado ──────────────────────────────── */
  private prefijo = computed(() => {
    const a = this.filtroAnio();
    if (!a) return '';
    const m = this.filtroMes();
    return m ? `${a}-${m}` : a;
  });

  /* ─── Datos filtrados ────────────────────────────────────────── */
  solicitudes = computed(() => {
    const p = this.prefijo();
    const lista = this._solicitudes();
    return p ? lista.filter(s => s.fecha_creacion_solicitud?.startsWith(p)) : lista;
  });

  planteamientos = computed(() => {
    const p = this.prefijo();
    const lista = this._planteamientos();
    return p ? lista.filter(s => s.fecha_creacion?.startsWith(p)) : lista;
  });

  proyectos = computed(() => {
    const p = this.prefijo();
    const lista = this._proyectos();
    return p ? lista.filter(pr => pr.fecha_inicio?.startsWith(p)) : lista;
  });

  /* ─── Contadores solicitudes ─────────────────────────────────── */
  cntSolPendiente  = computed(() => this.solicitudes().filter(s => s.id_estado === 1).length);
  cntSolAprobada   = computed(() => this.solicitudes().filter(s => s.id_estado === 2).length);
  cntSolRechazada  = computed(() => this.solicitudes().filter(s => s.id_estado === 3).length);
  cntSolEnProceso  = computed(() => this.solicitudes().filter(s => s.id_estado === this.idEnProcesoSol()).length);
  cntSolCerrada    = computed(() => this.solicitudes().filter(s => s.id_estado === this.idCerradaSol()).length);

  /* ─── Contadores planteamientos ──────────────────────────────── */
  cntPlanPendiente  = computed(() => this.planteamientos().filter(p => p.id_estado === 1).length);
  cntPlanAprobado   = computed(() => this.planteamientos().filter(p => p.id_estado === 2).length);
  cntPlanRechazado  = computed(() => this.planteamientos().filter(p => p.id_estado === 3).length);
  cntPlanFinalizado = computed(() => this.planteamientos().filter(p => p.id_estado === this.idFinPlan()).length);
  cntPlanCancelado  = computed(() => this.planteamientos().filter(p => p.id_estado === this.idCancPlan()).length);

  /* ─── Contadores proyectos (comparación por nombre de estado) ── */
  private cntProy(nombre: string) {
    return computed(() =>
      this.proyectos().filter(p =>
        (p.estado_proyecto?.nombre_estado ?? '').toLowerCase() === nombre
      ).length
    );
  }
  cntProyDisponible = this.cntProy('disponible');
  cntProyEnProceso  = this.cntProy('en proceso');
  cntProyPausado    = this.cntProy('pausado');
  cntProyAtrasado   = this.cntProy('atrasado');
  cntProyFinalizado = this.cntProy('finalizado');
  cntProyCancelado  = this.cntProy('cancelado');

  /* ─── Helpers ────────────────────────────────────────────────── */
  get aniosDisponibles(): string[] {
    const todos = [
      ...this._solicitudes().map(s => s.fecha_creacion_solicitud?.slice(0, 4)),
      ...this._planteamientos().map(p => p.fecha_creacion?.slice(0, 4)),
      ...this._proyectos().map(p => p.fecha_inicio?.slice(0, 4)),
    ].filter(Boolean) as string[];
    return [...new Set(todos)].sort().reverse();
  }

  get periodoLabel(): string {
    const a = this.filtroAnio();
    if (!a) return 'Todo el período';
    const mes = this.meses.find(m => m.valor === this.filtroMes())?.nombre;
    return mes ? `${mes} ${a}` : a;
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return '—';
    return fecha.split('T')[0].split('-').reverse().join('/');
  }

  getNombreCliente(sol: any): string {
    return sol.usuario
      ? `${sol.usuario.nombres_usuario} ${sol.usuario.apellidos_usuario}`
      : '—';
  }

  getNombrePlanteamientoEstado(id: number): string {
    return this.catalog.getNombreEstadoPlanteamiento(id);
  }

  /* ─── Ciclo de vida ──────────────────────────────────────────── */
  async ngOnInit(): Promise<void> {
    await this.catalog.load();

    this.idCerradaSol.set(this.catalog.getIdEstado('Cerrada')    || 4);
    this.idEnProcesoSol.set(this.catalog.getIdEstado('En proceso') || 5);
    this.idFinPlan.set(this.catalog.getIdEstadoPlanteamiento('Finalizado') || 4);
    this.idCancPlan.set(this.catalog.getIdEstadoPlanteamiento('Cancelado')  || 5);

    const idCarrera = this.auth.usuario()?.gestor_vinculacion_carrera?.id_carrera;
    if (idCarrera) {
      this.nombreCarrera = this.catalog.carreras().find(c => c.id_carrera === idCarrera)?.nombre_carrera ?? '';
    }

    const [solRes, planRes, proyRes] = await Promise.all([
      this.data.getAll<any>('solicitud', {
        select:  'id_solicitud, titulo_solicitud, id_estado, fecha_creacion_solicitud, estado_solicitud(nombre_estado), usuario(nombres_usuario, apellidos_usuario)',
        filters: { is_active: true },
      }),
      this.data.getAll<any>('planteamiento_proyecto', {
        select:  'id_planteamiento, titulo_planteamiento, id_estado, fecha_creacion, estado_planteamiento(nombre_estado), solicitud(titulo_solicitud)',
        filters: { is_active: true },
      }),
      this.data.getAll<any>('proyecto', {
        select:  'id_proyecto, fecha_inicio, fecha_fin, estado_proyecto(nombre_estado), planteamiento_proyecto(titulo_planteamiento)',
        filters: { is_active: true },
      }),
    ]);

    if (solRes.data)  this._solicitudes.set(solRes.data);
    if (planRes.data) this._planteamientos.set(planRes.data);
    if (proyRes.data) this._proyectos.set(proyRes.data);
  }

  /* ─── Acciones ───────────────────────────────────────────────── */
  limpiarFiltros(): void {
    this.filtroAnio.set('');
    this.filtroMes.set('');
  }

  imprimir(): void {
    this.fechaGeneracion = new Date().toLocaleString('es-CL', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    setTimeout(() => window.print(), 80);
  }
}
