import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-proyecto-detalle-encargado',
  imports: [CommonModule],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.css',
})
export class ProyectoDetalleEncargado implements OnInit {

  proyecto: ProyectoDetalleData | null = null;
  cargando = true;

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
           id_planteamiento, titulo_planteamiento, tiempo_estimado_planteamiento, id_solicitud,
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
      const p   = proyRes.data;
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

  volver(): void {
    this.router.navigate(['/encargado/gestion-proyecto']);
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
      disponible: 'bg-emerald-100 text-emerald-700 border-emerald-200',
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
}
