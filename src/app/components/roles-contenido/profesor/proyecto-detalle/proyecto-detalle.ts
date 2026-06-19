import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

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

interface ProyectoDetalleData {
  id: number;
  titulo: string;
  planteamiento_origen: string;
  solicitud_origen: string;
  tiempo_estimado: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  estado: string;
  alumnos: AlumnoVista[];
  observaciones: ObservacionVista[];
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
        `id_proyecto, fecha_inicio, fecha_fin, id_estado,
         estado_proyecto(nombre_estado),
         planteamiento_proyecto(
           titulo_planteamiento, tiempo_estimado_planteamiento,
           solicitud(titulo_solicitud),
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
      const p = proyRes.data;
      const plan = p.planteamiento_proyecto;
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
        titulo:               plan?.titulo_planteamiento ?? `Proyecto #${id}`,
        planteamiento_origen: plan?.titulo_planteamiento ?? '—',
        solicitud_origen:     plan?.solicitud?.titulo_solicitud ?? '—',
        tiempo_estimado:      plan?.tiempo_estimado_planteamiento ?? '—',
        fecha_inicio:         p.fecha_inicio ?? undefined,
        fecha_termino:        p.fecha_fin ?? undefined,
        estado:               nombreEstado,
        alumnos,
        observaciones,
      };
    }

    this.cargando = false;
    this.cdr.detectChanges();
  }

  agregarObservacion(): void {
    if (!this.nuevaObservacion.trim() || !this.proyecto) return;
    const nuevaId = this.proyecto.observaciones.length
      ? Math.max(...this.proyecto.observaciones.map(o => o.id)) + 1
      : 1;
    this.proyecto.observaciones.push({
      id:      nuevaId,
      fecha:   new Date().toISOString().split('T')[0],
      detalle: this.nuevaObservacion.trim(),
    });
    this.nuevaObservacion = '';
  }

  volver(): void {
    this.router.navigate(['/profesor/proyectos']);
  }

  getBadgeEstado(estado: string): string {
    const mapa: Record<string, string> = {
      aprobado:   'bg-emerald-100 text-emerald-700 border-emerald-200',
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
      aprobado:   'Disponible',
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
