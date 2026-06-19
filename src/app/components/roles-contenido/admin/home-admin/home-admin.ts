import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { SupabaseService } from '../../../../core/services/supabase.service';

export interface LogEntry {
  entidad:      string;
  accion:       string;
  descripcion:  string;
  fecha:        string;
  entidadClase: string;
  accionClase:  string;
}

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.css',
})
export class HomeAdmin implements OnInit {
  private auth = inject(AuthService);
  private sb   = inject(SupabaseService).client;
  private cdr  = inject(ChangeDetectorRef);

  nombre = '';

  totalUsuarios    = 0;
  totalFacultades  = 0;
  totalCarreras    = 0;
  totalAlumnos     = 0;
  totalSolicitudes = 0;

  log:      LogEntry[] = [];
  cargando             = true;

  /* ─── Filtros ─────────────────────────────────────────────────── */
  searchTerm = '';
  filtroAnio = '';
  filtroMes  = '';

  readonly meses = [
    { valor: '01', nombre: 'Enero'      }, { valor: '02', nombre: 'Febrero'   },
    { valor: '03', nombre: 'Marzo'      }, { valor: '04', nombre: 'Abril'     },
    { valor: '05', nombre: 'Mayo'       }, { valor: '06', nombre: 'Junio'     },
    { valor: '07', nombre: 'Julio'      }, { valor: '08', nombre: 'Agosto'    },
    { valor: '09', nombre: 'Septiembre' }, { valor: '10', nombre: 'Octubre'   },
    { valor: '11', nombre: 'Noviembre'  }, { valor: '12', nombre: 'Diciembre' },
  ];

  get aniosDisponibles(): string[] {
    return [...new Set(
      this.log
        .filter(e => !!e.fecha)
        .map(e => new Date(e.fecha).getFullYear().toString())
    )].sort().reverse();
  }

  get logFiltrado(): LogEntry[] {
    let lista = [...this.log];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(e =>
        e.descripcion.toLowerCase().includes(t) ||
        e.entidad.toLowerCase().includes(t)     ||
        e.accion.toLowerCase().includes(t)
      );
    }

    if (this.filtroAnio) {
      lista = lista.filter(e => {
        if (!e.fecha) return false;
        const d = new Date(e.fecha);
        if (d.getFullYear().toString() !== this.filtroAnio) return false;
        if (this.filtroMes) {
          const mes = (d.getMonth() + 1).toString().padStart(2, '0');
          return mes === this.filtroMes;
        }
        return true;
      });
    }

    return lista;
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroAnio = '';
    this.filtroMes  = '';
  }

  /* ─── Init ───────────────────────────────────────────────────── */
  async ngOnInit(): Promise<void> {
    const u = this.auth.usuario();
    this.nombre = u ? `${u.nombres_usuario} ${u.apellidos_usuario}` : 'Administrador';
    await Promise.all([this.cargarStats(), this.cargarLog()]);
    this.cargando = false;
    this.cdr.detectChanges();
  }

  /* ─── Stats ──────────────────────────────────────────────────── */
  private async cargarStats(): Promise<void> {
    const [usr, fac, car, alu, sol] = await Promise.all([
      this.sb.from('usuario').select('*', { count: 'exact', head: true }).eq('is_active', true),
      this.sb.from('facultad').select('*', { count: 'exact', head: true }).eq('is_active', true),
      this.sb.from('carrera').select('*', { count: 'exact', head: true }).eq('is_active', true),
      this.sb.from('alumno_voluntario').select('*', { count: 'exact', head: true }).eq('is_active', true),
      this.sb.from('solicitud').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);
    this.totalUsuarios    = usr.count ?? 0;
    this.totalFacultades  = fac.count ?? 0;
    this.totalCarreras    = car.count ?? 0;
    this.totalAlumnos     = alu.count ?? 0;
    this.totalSolicitudes = sol.count ?? 0;
  }

  /* ─── Log ────────────────────────────────────────────────────── */
  private async cargarLog(): Promise<void> {
    const entries: LogEntry[] = [];
    await Promise.all([
      this.agregarSolicitudes(entries),
      this.agregarPlanteamientos(entries),
      this.agregarProyectos(entries),
      this.agregarUsuarios(entries),
    ]);
    const conFecha = entries.filter(e => !!e.fecha).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    const sinFecha = entries.filter(e => !e.fecha);
    this.log = [...conFecha, ...sinFecha].slice(0, 30);
  }

  private async agregarSolicitudes(entries: LogEntry[]): Promise<void> {
    const { data } = await this.sb
      .from('solicitud')
      .select('id_solicitud, titulo_solicitud, id_estado, fecha_creacion_solicitud, is_active, usuario(nombres_usuario, apellidos_usuario), estado_solicitud(nombre_estado)')
      .order('fecha_creacion_solicitud', { ascending: false })
      .limit(10);

    for (const s of data ?? []) {
      const cliente = s.usuario ? `${(s.usuario as any).nombres_usuario} ${(s.usuario as any).apellidos_usuario}` : '—';
      const estado  = (s.estado_solicitud as any)?.nombre_estado ?? '—';

      if (!s.is_active) {
        entries.push({ entidad: 'Solicitud', accion: 'ELIMINACIÓN', descripcion: `Solicitud #${s.id_solicitud} eliminada — "${s.titulo_solicitud?.substring(0, 45)}"`, fecha: s.fecha_creacion_solicitud, entidadClase: 'bg-sky-100 text-sky-700 border-sky-200', accionClase: 'bg-red-100 text-red-700 border-red-200' });
      } else if (s.id_estado === 1) {
        entries.push({ entidad: 'Solicitud', accion: 'CREACIÓN', descripcion: `Solicitud #${s.id_solicitud} creada por ${cliente}`, fecha: s.fecha_creacion_solicitud, entidadClase: 'bg-sky-100 text-sky-700 border-sky-200', accionClase: 'bg-indigo-100 text-indigo-700 border-indigo-200' });
      } else {
        entries.push({ entidad: 'Solicitud', accion: 'CAMBIO ESTADO', descripcion: `Solicitud #${s.id_solicitud} → ${estado} (${cliente})`, fecha: s.fecha_creacion_solicitud, entidadClase: 'bg-sky-100 text-sky-700 border-sky-200', accionClase: 'bg-amber-100 text-amber-700 border-amber-200' });
      }
    }
  }

  private async agregarPlanteamientos(entries: LogEntry[]): Promise<void> {
    const { data } = await this.sb
      .from('planteamiento_proyecto')
      .select('id_planteamiento, titulo_planteamiento, id_estado, is_active, usuario(nombres_usuario, apellidos_usuario), estado_planteamiento(nombre_estado)')
      .order('id_planteamiento', { ascending: false })
      .limit(6);

    for (const p of data ?? []) {
      const autor  = p.usuario ? `${(p.usuario as any).nombres_usuario} ${(p.usuario as any).apellidos_usuario}` : '—';
      const estado = (p.estado_planteamiento as any)?.nombre_estado ?? '—';
      const titulo = p.titulo_planteamiento?.substring(0, 45) ?? '—';

      if (!p.is_active) {
        entries.push({ entidad: 'Planteamiento', accion: 'ELIMINACIÓN', descripcion: `Planteamiento eliminado: "${titulo}"`, fecha: '', entidadClase: 'bg-violet-100 text-violet-700 border-violet-200', accionClase: 'bg-red-100 text-red-700 border-red-200' });
      } else if (p.id_estado === 1) {
        entries.push({ entidad: 'Planteamiento', accion: 'CREACIÓN', descripcion: `Planteamiento creado por ${autor}: "${titulo}"`, fecha: '', entidadClase: 'bg-violet-100 text-violet-700 border-violet-200', accionClase: 'bg-indigo-100 text-indigo-700 border-indigo-200' });
      } else {
        entries.push({ entidad: 'Planteamiento', accion: 'CAMBIO ESTADO', descripcion: `Planteamiento "${titulo}" → ${estado}`, fecha: '', entidadClase: 'bg-violet-100 text-violet-700 border-violet-200', accionClase: 'bg-amber-100 text-amber-700 border-amber-200' });
      }
    }
  }

  private async agregarProyectos(entries: LogEntry[]): Promise<void> {
    const { data } = await this.sb
      .from('proyecto')
      .select('id_proyecto, fecha_inicio, id_estado, is_active, planteamiento_proyecto(titulo_planteamiento), estado_proyecto(nombre_estado)')
      .order('fecha_inicio', { ascending: false })
      .limit(5);

    for (const p of data ?? []) {
      const titulo = (p.planteamiento_proyecto as any)?.titulo_planteamiento?.substring(0, 45) ?? `#${p.id_proyecto}`;
      const estado = (p.estado_proyecto as any)?.nombre_estado ?? '—';
      const esNuevo = p.id_estado === 1;

      if (!p.is_active) {
        entries.push({ entidad: 'Proyecto', accion: 'ELIMINACIÓN', descripcion: `Proyecto eliminado: "${titulo}"`, fecha: p.fecha_inicio, entidadClase: 'bg-teal-100 text-teal-700 border-teal-200', accionClase: 'bg-red-100 text-red-700 border-red-200' });
      } else {
        entries.push({ entidad: 'Proyecto', accion: esNuevo ? 'CREACIÓN' : 'CAMBIO ESTADO', descripcion: `Proyecto "${titulo}" — ${estado}`, fecha: p.fecha_inicio, entidadClase: 'bg-teal-100 text-teal-700 border-teal-200', accionClase: esNuevo ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-amber-100 text-amber-700 border-amber-200' });
      }
    }
  }

  private async agregarUsuarios(entries: LogEntry[]): Promise<void> {
    const { data } = await this.sb
      .from('usuario')
      .select('id_usuario, nombres_usuario, apellidos_usuario, fecha_creacion, is_active, rol(nombre_rol)')
      .order('fecha_creacion', { ascending: false })
      .limit(5);

    for (const u of data ?? []) {
      const nombre = `${u.nombres_usuario} ${u.apellidos_usuario}`;
      const rol    = (u.rol as any)?.nombre_rol ?? '—';
      entries.push({
        entidad:      'Usuario',
        accion:       u.is_active ? 'CREACIÓN' : 'ELIMINACIÓN',
        descripcion:  u.is_active ? `Usuario registrado: ${nombre} (${rol})` : `Usuario desactivado: ${nombre}`,
        fecha:        u.fecha_creacion,
        entidadClase: 'bg-rose-100 text-rose-700 border-rose-200',
        accionClase:  u.is_active ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-red-100 text-red-700 border-red-200',
      });
    }
  }

  /* ─── Helpers ────────────────────────────────────────────────── */
  formatFecha(fecha: string): string {
    if (!fecha) return '—';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' — ' + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }
}
