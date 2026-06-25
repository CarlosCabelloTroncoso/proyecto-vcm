import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

interface FilaCarrera {
  nombre:     string;
  pendientes: number;
  aprobadas:  number;
  enProceso:  number;
  rechazadas: number;
  cerradas:   number;
  total:      number;
}

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

  /* ─── Metadatos ──────────────────────────────────────────────── */
  fechaGeneracion = '';

  nombreAutoridad = computed(() => {
    const u = this.auth.usuario();
    return u ? `${u.nombres_usuario} ${u.apellidos_usuario}` : '';
  });

  /* ─── Filtros ────────────────────────────────────────────────── */
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
  private _solicitudes = signal<any[]>([]);

  /* ─── IDs de estados dinámicos ───────────────────────────────── */
  private idCerrada   = signal(4);
  private idEnProceso = signal(5);

  /* ─── Prefijo de fecha ───────────────────────────────────────── */
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

  /* ─── Contadores globales ────────────────────────────────────── */
  cntPendiente  = computed(() => this.solicitudes().filter(s => s.id_estado === 1).length);
  cntAprobada   = computed(() => this.solicitudes().filter(s => s.id_estado === 2).length);
  cntEnProceso  = computed(() => this.solicitudes().filter(s => s.id_estado === this.idEnProceso()).length);
  cntRechazada  = computed(() => this.solicitudes().filter(s => s.id_estado === 3).length);
  cntCerrada    = computed(() => this.solicitudes().filter(s => s.id_estado === this.idCerrada()).length);

  /* ─── Desglose por carrera ───────────────────────────────────── */
  desglosePorCarrera = computed<FilaCarrera[]>(() => {
    const carreras    = this.catalog.carreras();
    const idCerrada   = this.idCerrada();
    const idEnProceso = this.idEnProceso();
    const sols        = this.solicitudes();

    return carreras
      .map(c => {
        const lista = sols.filter(s => s.id_carrera === c.id_carrera);
        return {
          nombre:     c.nombre_carrera,
          pendientes: lista.filter(s => s.id_estado === 1).length,
          aprobadas:  lista.filter(s => s.id_estado === 2).length,
          enProceso:  lista.filter(s => s.id_estado === idEnProceso).length,
          rechazadas: lista.filter(s => s.id_estado === 3).length,
          cerradas:   lista.filter(s => s.id_estado === idCerrada).length,
          total:      lista.length,
        };
      })
      .filter(f => f.total > 0)
      .sort((a, b) => b.total - a.total);
  });

  /* ─── Helpers ────────────────────────────────────────────────── */
  get aniosDisponibles(): string[] {
    return [...new Set(
      this._solicitudes().map(s => s.fecha_creacion_solicitud?.slice(0, 4)).filter(Boolean) as string[]
    )].sort().reverse();
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

  getNombreCarrera(sol: any): string {
    return sol.carrera?.nombre_carrera ?? '—';
  }

  /* ─── Ciclo de vida ──────────────────────────────────────────── */
  async ngOnInit(): Promise<void> {
    await this.catalog.load();

    this.idCerrada.set(this.catalog.getIdEstado('Cerrada')    || 4);
    this.idEnProceso.set(this.catalog.getIdEstado('En proceso') || 5);

    const { data } = await this.data.getAll<any>('solicitud', {
      select:  'id_solicitud, titulo_solicitud, id_estado, id_carrera, fecha_creacion_solicitud, estado_solicitud(nombre_estado), usuario(nombres_usuario, apellidos_usuario), carrera(nombre_carrera)',
      filters: { is_active: true },
    });

    if (data) this._solicitudes.set(data);
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
