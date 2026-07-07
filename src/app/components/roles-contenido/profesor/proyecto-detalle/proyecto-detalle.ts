import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { SupabaseService } from '../../../../core/services/supabase.service';

interface AlumnoVista {
  id: number;
  rut: string;
  nombre: string;
}

interface ObservacionVista {
  id: number;
  fecha: string;
  detalle: string;
}

interface ClienteVista {
  nombre: string;
  telefono: string;
  correo: string;
}

interface ArchivoVista {
  id: number;
  nombre: string;
  ruta: string;
  tipo: string;
}

interface ProyectoDetalleData {
  id: number;
  id_planteamiento: number;
  id_solicitud: number;
  id_carrera: number;
  titulo: string;
  planteamiento_origen: string;
  solicitud_origen: string;
  tiempo_estimado: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  estado: string;
  alumnos: AlumnoVista[];
  observaciones: ObservacionVista[];
  cliente: ClienteVista | null;
  archivos: ArchivoVista[];
}

@Component({
  selector: 'app-proyecto-detalle',
  imports: [CommonModule, FormsModule],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.css',
})
export class ProyectoDetalle implements OnInit {

  proyecto: ProyectoDetalleData | null = null;
  cargando = true;
  nuevaObservacion = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private catalog: CatalogService,
    private cdr: ChangeDetectorRef,
    private supabaseService: SupabaseService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.cargando = false; return; }

    const [proyRes, obsRes] = await Promise.all([
      this.dataService.getById<any>(
        'proyecto',
        id,
        'id_proyecto',
        `id_proyecto, fecha_inicio, fecha_fin, id_estado, id_planteamiento,
         estado_proyecto(nombre_estado),
         planteamiento_proyecto(
           id_planteamiento, titulo_planteamiento, tiempo_estimado_planteamiento, id_solicitud, id_carrera,
           solicitud(id_solicitud, titulo_solicitud, usuario(nombres_usuario, apellidos_usuario, telefono_usuario)),
           detalle_planteamiento_alumno(
             alumno_voluntario(id_alumno, rut_alumno, nombres_alumno, apellidos_alumno)
           )
         )`,
      ),
      this.dataService.getAll<any>('observacion', {
        filters: { id_proyecto: id, is_active: true },
        orderBy: { column: 'fecha_observacion', ascending: true },
      }),
    ]);

    if (proyRes.data) {
      const p    = proyRes.data;
      const plan = p.planteamiento_proyecto;

      const idPlanteamiento: number | null = p.id_planteamiento ?? null;
      const idSolicitud: number | null     = plan?.id_solicitud ?? null;

      const [archProy, archPlan, archSol] = await Promise.all([
        this.dataService.getAll<any>('archivo', { filters: { id_proyecto: id } }),
        idPlanteamiento
          ? this.dataService.getAll<any>('archivo', { filters: { id_planteamiento: idPlanteamiento } })
          : Promise.resolve({ data: [] as any[], error: null }),
        idSolicitud
          ? this.dataService.getAll<any>('archivo', { filters: { id_solicitud: idSolicitud } })
          : Promise.resolve({ data: [] as any[], error: null }),
      ]);

      const archivos: ArchivoVista[] = [
        ...(archSol.data  ?? []),
        ...(archPlan.data ?? []),
        ...(archProy.data ?? []),
      ].map((a: any) => ({
        id:     a.id_archivo,
        nombre: a.nombre_archivo,
        ruta:   a.ruta_archivo,
        tipo:   a.tipo_archivo,
      }));

      const usr = plan?.solicitud?.usuario;
      const cliente: ClienteVista | null = usr ? {
        nombre:   `${usr.nombres_usuario ?? ''} ${usr.apellidos_usuario ?? ''}`.trim(),
        telefono: usr.telefono_usuario          ?? '—',
        correo:   '',
      } : null;

      const rawAlumnos: any[] = Array.isArray(plan?.detalle_planteamiento_alumno)
        ? plan.detalle_planteamiento_alumno
        : (plan?.detalle_planteamiento_alumno ? [plan.detalle_planteamiento_alumno] : []);

      const alumnos: AlumnoVista[] = rawAlumnos
        .map((d: any) => d.alumno_voluntario)
        .filter(Boolean)
        .map((a: any) => ({
          id:     a.id_alumno,
          rut:    a.rut_alumno,
          nombre: `${a.nombres_alumno} ${a.apellidos_alumno}`,
        }));

      const observaciones: ObservacionVista[] = (obsRes.data ?? []).map((o: any) => ({
        id:      o.id_observacion,
        fecha:   o.fecha_observacion ?? '',
        detalle: o.detalle_observacion,
      }));

      const nombreEstado = (p.estado_proyecto?.nombre_estado ?? '').toLowerCase().replace(/ /g, '_');

      this.proyecto = {
        id:                   p.id_proyecto,
        id_planteamiento:     idPlanteamiento ?? 0,
        id_solicitud:         idSolicitud ?? 0,
        id_carrera:           plan?.id_carrera ?? 0,
        titulo:               plan?.titulo_planteamiento ?? `Proyecto #${id}`,
        planteamiento_origen: plan?.titulo_planteamiento ?? '—',
        solicitud_origen:     plan?.solicitud?.titulo_solicitud ?? '—',
        tiempo_estimado:      plan?.tiempo_estimado_planteamiento ?? '—',
        fecha_inicio:         p.fecha_inicio ?? undefined,
        fecha_termino:        p.fecha_fin ?? undefined,
        estado:               nombreEstado,
        alumnos,
        observaciones,
        cliente,
        archivos,
      };
    }

    this.cargando = false;
    this.cdr.detectChanges();
  }

  async agregarObservacion(): Promise<void> {
    const detalle = this.nuevaObservacion.trim();
    if (!detalle || !this.proyecto) return;

    // Antes solo se agregaba al arreglo local y nunca se guardaba en la BD,
    // por eso la observacion desaparecia al recargar. Ahora se inserta de verdad.
    const { data, error } = await this.dataService.create<any>('observacion', {
      id_proyecto:         this.proyecto.id,
      detalle_observacion: detalle,
      fecha_observacion:   new Date().toISOString(),
      is_active:           true,
    });

    if (error || !data) {
      console.error('[observacion] error al guardar:', error);
      alert('No se pudo guardar la observación. Intenta de nuevo.');
      return;
    }

    this.proyecto.observaciones.push({
      id:      data.id_observacion,
      fecha:   data.fecha_observacion ?? new Date().toISOString(),
      detalle: data.detalle_observacion ?? detalle,
    });
    this.nuevaObservacion = '';
    this.cdr.detectChanges();
  }

  // ── Edición de alumnos voluntarios (solo en estado "Disponible") ──
  readonly MAX_ALUMNOS = 5;
  editandoAlumnos   = false;
  guardandoAlumnos  = false;
  errorAlumnos      = '';
  alumnosEdicion:      AlumnoVista[] = [];
  alumnosDisponibles:  AlumnoVista[] = [];
  alumnoSeleccionadoId: number | undefined = undefined;

  /** El profesor solo puede editar los alumnos mientras el proyecto está Disponible. */
  get puedeEditarAlumnos(): boolean {
    return this.proyecto?.estado === 'disponible';
  }

  get alumnosDisponiblesParaAgregar(): AlumnoVista[] {
    return this.alumnosDisponibles.filter(
      a => !this.alumnosEdicion.some(s => s.id === a.id)
    );
  }

  async abrirEdicionAlumnos(): Promise<void> {
    if (!this.proyecto || !this.puedeEditarAlumnos) return;
    this.errorAlumnos = '';

    // Alumnos activos de la carrera del planteamiento (candidatos a asignar)
    if (this.alumnosDisponibles.length === 0) {
      const { data } = await this.dataService.getAll<any>('alumno_voluntario', {
        select:  'id_alumno, rut_alumno, nombres_alumno, apellidos_alumno',
        filters: { id_carrera: this.proyecto.id_carrera, is_active: true },
      });
      this.alumnosDisponibles = (data ?? []).map((a: any): AlumnoVista => ({
        id:     a.id_alumno,
        rut:    a.rut_alumno,
        nombre: `${a.nombres_alumno} ${a.apellidos_alumno}`,
      }));
    }

    this.alumnosEdicion   = this.proyecto.alumnos.map(a => ({ ...a }));
    this.alumnoSeleccionadoId = undefined;
    this.editandoAlumnos  = true;
    this.cdr.detectChanges();
  }

  agregarAlumnoEdicion(): void {
    if (!this.alumnoSeleccionadoId || this.alumnosEdicion.length >= this.MAX_ALUMNOS) return;
    const alumno = this.alumnosDisponibles.find(a => a.id === this.alumnoSeleccionadoId);
    if (alumno && !this.alumnosEdicion.some(a => a.id === alumno.id)) {
      this.alumnosEdicion.push(alumno);
    }
    this.alumnoSeleccionadoId = undefined;
  }

  quitarAlumnoEdicion(id: number): void {
    this.alumnosEdicion = this.alumnosEdicion.filter(a => a.id !== id);
  }

  cancelarEdicionAlumnos(): void {
    this.editandoAlumnos      = false;
    this.alumnoSeleccionadoId = undefined;
    this.errorAlumnos         = '';
  }

  async guardarAlumnos(): Promise<void> {
    if (!this.proyecto) return;
    this.guardandoAlumnos = true;
    this.errorAlumnos     = '';

    // La sincronización (agregar/reactivar + soft-delete de los quitados) se hace
    // en una función SECURITY DEFINER, porque el rol profesor no tiene permiso RLS
    // para UPDATE directo sobre detalle_planteamiento_alumno.
    const { error } = await this.dataService.rpc('set_alumnos_planteamiento', {
      p_id_planteamiento: this.proyecto.id_planteamiento,
      p_ids_alumnos:      this.alumnosEdicion.map(a => a.id),
    });

    if (error) {
      console.error('[editar alumnos] error:', error);
      this.errorAlumnos     = 'No se pudieron guardar los cambios. Intenta de nuevo.';
      this.guardandoAlumnos = false;
      this.cdr.detectChanges();
      return;
    }

    this.proyecto.alumnos = this.alumnosEdicion.map(a => ({ ...a }));
    this.editandoAlumnos  = false;
    this.guardandoAlumnos = false;
    this.cdr.detectChanges();
  }

  volver(): void {
    this.router.navigate(['/profesor/proyectos']);
  }

  async descargar(archivo: ArchivoVista): Promise<void> {
    const { data } = await this.supabaseService.client.storage
      .from('vcm-archivos')
      .createSignedUrl(archivo.ruta, 60, { download: archivo.nombre });
    if (data?.signedUrl) {
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.target = '_blank';
      a.click();
    }
  }

  getTipoIcono(tipo: string): 'pdf' | 'word' | 'excel' | 'imagen' | 'otro' {
    const t = tipo.toLowerCase();
    if (t === 'pdf')                                                   return 'pdf';
    if (['doc', 'docx'].includes(t))                                   return 'word';
    if (['xls', 'xlsx'].includes(t))                                   return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(t))     return 'imagen';
    return 'otro';
  }

  getClaseIconoTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      pdf:    'bg-red-50 text-red-500',
      word:   'bg-blue-50 text-blue-500',
      excel:  'bg-emerald-50 text-emerald-600',
      imagen: 'bg-violet-50 text-violet-500',
      otro:   'bg-gray-100 text-gray-500',
    };
    return mapa[this.getTipoIcono(tipo)] ?? mapa['otro'];
  }

  getBadgeTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      pdf:    'bg-red-50 text-red-600',
      word:   'bg-blue-50 text-blue-600',
      excel:  'bg-emerald-50 text-emerald-700',
      imagen: 'bg-violet-50 text-violet-600',
      otro:   'bg-gray-50 text-gray-600',
    };
    return mapa[this.getTipoIcono(tipo)] ?? mapa['otro'];
  }

  getBadgeEstado(estado: string): string {
    const mapa: Record<string, string> = {
      disponible: 'bg-violet-100 text-violet-700 border-violet-200',
      en_proceso: 'bg-blue-100 text-blue-700 border-blue-200',
      pausado:    'bg-amber-100 text-amber-700 border-amber-200',
      atrasado:   'bg-orange-100 text-orange-600 border-orange-200',
      finalizado: 'bg-teal-100 text-teal-700 border-teal-200',
      cancelado:  'bg-red-100 text-red-500 border-red-200',
    };
    return mapa[estado] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  getNombreEstado(estado: string): string {
    const mapa: Record<string, string> = {
      disponible: 'Disponible',
      en_proceso: 'En proceso',
      pausado:    'Pausado',
      atrasado:   'Atrasado',
      finalizado: 'Finalizado',
      cancelado:  'Cancelado',
    };
    return mapa[estado] ?? '—';
  }

  esTerminal(estado: string): boolean {
    return estado === 'finalizado' || estado === 'cancelado';
  }
}
