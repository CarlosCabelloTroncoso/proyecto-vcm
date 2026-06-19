import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { SupabaseService } from '../../../../core/services/supabase.service';

interface ProyectoVista {
  id: number;
  id_planteamiento: number;
  titulo: string;
  planteamiento_origen: string;
  solicitud_origen: string;
  tiempo_estimado: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  estado: 'disponible' | 'en_proceso' | 'pausado' | 'cancelado' | 'finalizado' | 'atrasado';
}

interface AlumnoVista {
  id: number;
  rut: string;
  nombre: string;
}

interface ArchivoEntry {
  archivo: Archivo;
  file?: File;
}

@Component({
  selector: 'app-proyectos',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos implements OnInit {
  estadosProyecto: any[] = [];

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,
    private auth: AuthService,
    private supabaseService: SupabaseService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estadosProyecto = this.catalog.estadosProyecto();

    const [proyectosRes, planteamientosRes, alumnosRes] = await Promise.all([
      this.dataService.getAll<any>('proyecto', {
        select: `*, estado_proyecto(nombre_estado), planteamiento_proyecto(id_planteamiento, titulo_planteamiento, tiempo_estimado_planteamiento, id_carrera, id_solicitud, solicitud(titulo_solicitud), carrera(nombre_carrera))`,
        filters: { is_active: true },
      }),
      this.dataService.getAll<any>('planteamiento_proyecto', {
        select: 'id_planteamiento, titulo_planteamiento',
        filters: { id_estado: 2, is_active: true },
      }),
      this.dataService.getAll<any>('alumno_voluntario', {
        select: 'id_alumno, rut_alumno, nombres_alumno, apellidos_alumno',
        filters: { is_active: true },
      }),
    ]);

    if (proyectosRes.data) {
      const mapped = proyectosRes.data.map((p: any): ProyectoVista => ({
        id:                   p.id_proyecto,
        id_planteamiento:     p.id_planteamiento,
        titulo:               p.planteamiento_proyecto?.titulo_planteamiento ?? `Proyecto #${p.id_proyecto}`,
        planteamiento_origen: p.planteamiento_proyecto?.titulo_planteamiento ?? '—',
        solicitud_origen:     p.planteamiento_proyecto?.solicitud?.titulo_solicitud ?? '—',
        tiempo_estimado:      p.planteamiento_proyecto?.tiempo_estimado_planteamiento ?? '—',
        fecha_inicio:         p.fecha_inicio ?? undefined,
        fecha_termino:        p.fecha_fin ?? undefined,
        estado:               ((p.estado_proyecto?.nombre_estado ?? '') as string)
                                .toLowerCase().replace(/ /g, '_') as ProyectoVista['estado'],
      }));
      this.proyectos.set(mapped);
      if (mapped.length > 0 && !mapped.some(p => p.estado === this.filtroActivo)) {
        this.filtroActivo = mapped[0].estado;
      }
    }

    if (planteamientosRes.data) {
      this.planteamientosAprobados.set(planteamientosRes.data);
    }

    if (alumnosRes.data) {
      this.alumnosDisponibles = alumnosRes.data.map((a: any): AlumnoVista => ({
        id:     a.id_alumno,
        rut:    a.rut_alumno,
        nombre: `${a.nombres_alumno} ${a.apellidos_alumno}`,
      }));
    }

    // Navegación desde planteamientos con planteamiento preseleccionado
    const state = history.state;
    if (state?.abrirCrearProyecto && state?.planteamiento) {
      history.replaceState({}, '');
      this.abrirCrear(state.planteamiento);
    }
  }


  filtroActivo: ProyectoVista['estado'] = 'disponible';

  proyectos = signal<ProyectoVista[]>([]);

  planteamientosAprobados = signal<{ id_planteamiento: number; titulo_planteamiento: string }[]>([]);

  // ── Modal Crear Proyecto ──────────────────────────────────────
  mostrarModalCrear = false;
  planteamientoPreseleccionado: { id_planteamiento: number; titulo_planteamiento: string } | null = null;
  alumnoSeleccionadoId: number | undefined = undefined;

  formProyecto: {
    id_planteamiento: number | undefined;
    fecha_inicio: string;
    fecha_termino: string;
  } = { id_planteamiento: undefined, fecha_inicio: '', fecha_termino: '' };

  alumnosSeleccionados: AlumnoVista[] = [];
  readonly MAX_ALUMNOS = 5;

  alumnosDisponibles: AlumnoVista[] = [];

  archivosProyecto: ArchivoEntry[] = [];
  arrastrandoArchivo = false;
  errorArchivos: string[] = [];
  private _archivoIdCounter = 2000;

  readonly TIPOS_ACEPTADOS = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain',
  ];
  readonly TAMANO_MAX_MB = 10;

  // ── Getters ───────────────────────────────────────────────────

  get proyectosFiltrados(): ProyectoVista[] {
    return this.proyectos().filter(p => p.estado === this.filtroActivo);
  }

  get contadorPorEstado(): Record<string, number> {
    return {
      disponible: this.proyectos().filter(p => p.estado === 'disponible').length,
      en_proceso: this.proyectos().filter(p => p.estado === 'en_proceso').length,
      pausado:    this.proyectos().filter(p => p.estado === 'pausado').length,
      cancelado:  this.proyectos().filter(p => p.estado === 'cancelado').length,
      finalizado: this.proyectos().filter(p => p.estado === 'finalizado').length,
      atrasado:   this.proyectos().filter(p => p.estado === 'atrasado').length,
    };
  }

  get planteamientosDisponibles(): { id_planteamiento: number; titulo_planteamiento: string }[] {
    return this.planteamientosAprobados();
  }

  get alumnosDisponiblesParaAgregar(): AlumnoVista[] {
    return this.alumnosDisponibles.filter(
      a => !this.alumnosSeleccionados.some(s => s.id === a.id)
    );
  }

  getBadgeEstado(estado: string): string {
    const mapa: Record<string, string> = {
      disponible: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      en_proceso: 'bg-blue-100 text-blue-700 border-blue-200',
      pausado:    'bg-amber-100 text-amber-700 border-amber-200',
      cancelado:  'bg-red-100 text-red-500 border-red-200',
      finalizado: 'bg-teal-100 text-teal-700 border-teal-200',
      atrasado:   'bg-orange-100 text-orange-600 border-orange-200',
    };
    return mapa[estado] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  getNombreEstado(estado: string): string {
    const mapa: Record<string, string> = {
      disponible: 'Disponible',
      en_proceso: 'En proceso',
      pausado:    'Pausado',
      cancelado:  'Cancelado',
      finalizado: 'Finalizado',
      atrasado:   'Atrasado',
    };
    return mapa[estado] ?? '—';
  }

  // ── Modal ─────────────────────────────────────────────────────

  abrirCrear(p?: { id_planteamiento: number; titulo_planteamiento: string }): void {
    this.planteamientoPreseleccionado = p ?? null;
    this.formProyecto = {
      id_planteamiento: p?.id_planteamiento,
      fecha_inicio:     '',
      fecha_termino:    '',
    };
    this.alumnosSeleccionados = [];
    this.alumnoSeleccionadoId = undefined;
    this.archivosProyecto     = [];
    this.errorArchivos        = [];
    this.mostrarModalCrear    = true;
  }

  cerrarCrear(): void {
    this.mostrarModalCrear            = false;
    this.planteamientoPreseleccionado = null;
    this.formProyecto = { id_planteamiento: undefined, fecha_inicio: '', fecha_termino: '' };
    this.alumnosSeleccionados = [];
    this.alumnoSeleccionadoId = undefined;
    this.archivosProyecto     = [];
    this.errorArchivos        = [];
  }

  agregarAlumno(): void {
    if (!this.alumnoSeleccionadoId || this.alumnosSeleccionados.length >= this.MAX_ALUMNOS) return;
    const alumno = this.alumnosDisponibles.find(a => a.id === this.alumnoSeleccionadoId);
    if (alumno) {
      this.alumnosSeleccionados.push(alumno);
      this.alumnoSeleccionadoId = undefined;
    }
  }

  quitarAlumno(id: number): void {
    this.alumnosSeleccionados = this.alumnosSeleccionados.filter(a => a.id !== id);
  }

  formValido(): boolean {
    return !!(
      this.formProyecto.id_planteamiento &&
      this.formProyecto.fecha_inicio &&
      this.formProyecto.fecha_termino
    );
  }

  async guardarProyecto(): Promise<void> {
    if (!this.formValido()) return;

    let idEstadoDisponible = this.catalog.getIdEstadoProyecto('Disponible');
    if (!idEstadoDisponible) {
      const estados = this.catalog.estadosProyecto();
      idEstadoDisponible = estados[0]?.id_estado ?? 1;
    }

    const { data, error } = await this.dataService.create<any>('proyecto', {
      id_planteamiento: this.formProyecto.id_planteamiento,
      id_estado:        idEstadoDisponible,
      fecha_inicio:     this.formProyecto.fecha_inicio,
      fecha_fin:        this.formProyecto.fecha_termino,
      is_active:        true,
    });

    if (error) {
      console.error('Error al crear proyecto:', error);
      return;
    }

    if (data && this.alumnosSeleccionados.length > 0) {
      const sb = this.supabaseService.client;
      await Promise.all(
        this.alumnosSeleccionados.map(a =>
          sb.from('detalle_planteamiento_alumno').insert({
            id_planteamiento: this.formProyecto.id_planteamiento,
            id_alumno:        a.id,
          })
        )
      );
    }

    await this.ngOnInit();
    this.cerrarCrear();
  }

  // ── Archivos ──────────────────────────────────────────────────

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.procesarArchivos(Array.from(input.files));
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.arrastrandoArchivo = true;
  }

  onDragLeave(): void {
    this.arrastrandoArchivo = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.arrastrandoArchivo = false;
    if (event.dataTransfer?.files) {
      this.procesarArchivos(Array.from(event.dataTransfer.files));
    }
  }

  private procesarArchivos(files: File[]): void {
    this.errorArchivos = [];
    files.forEach(file => {
      if (!this.TIPOS_ACEPTADOS.includes(file.type)) {
        this.errorArchivos.push(`"${file.name}": tipo de archivo no permitido.`);
        return;
      }
      if (file.size > this.TAMANO_MAX_MB * 1024 * 1024) {
        this.errorArchivos.push(`"${file.name}": supera el límite de ${this.TAMANO_MAX_MB} MB.`);
        return;
      }
      if (this.archivosProyecto.some(e => e.archivo.nombre_archivo === file.name && e.file)) {
        this.errorArchivos.push(`"${file.name}": ya fue agregado.`);
        return;
      }
      const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
      const archivoMock: Archivo = {
        id_archivo:       ++this._archivoIdCounter,
        nombre_archivo:   file.name,
        ruta_archivo:     `uploads/${file.name}`,
        tipo_archivo:     extension,
        id_solicitud:     null,
        id_planteamiento: null,
        id_proyecto:      null,
      };
      this.archivosProyecto.push({ archivo: archivoMock, file });
    });
  }

  eliminarArchivo(index: number): void {
    this.archivosProyecto.splice(index, 1);
  }

  getTipoIcono(tipo: string): 'pdf' | 'word' | 'excel' | 'imagen' | 'otro' {
    const t = tipo.toLowerCase();
    if (t === 'pdf')                                                return 'pdf';
    if (['doc', 'docx'].includes(t))                               return 'word';
    if (['xls', 'xlsx'].includes(t))                               return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(t)) return 'imagen';
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

  formatearTamano(bytes: number): string {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
