import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Archivo } from '../../../../interfaces/proyecto.interface';

interface ProyectoVista {
  id: number;
  titulo: string;
  planteamiento_origen: string;
  solicitud_origen: string;
  tiempo_estimado: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  estado: 'aprobado' | 'en_proceso' | 'pausado' | 'cancelado' | 'finalizado' | 'atrasado';
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
export class Proyectos {

  filtroActivo: 'aprobado' | 'en_proceso' | 'pausado' | 'cancelado' | 'finalizado' | 'atrasado' = 'aprobado';

  proyectos: ProyectoVista[] = [
    {
      id: 1,
      titulo: 'Sistema de gestión de voluntarios',
      planteamiento_origen: 'Sistema de gestión de voluntarios',
      solicitud_origen: 'App móvil para servicios comunitarios',
      tiempo_estimado: '4 meses',
      estado: 'aprobado',
    },
    {
      id: 2,
      titulo: 'Dashboard de transparencia ciudadana',
      planteamiento_origen: 'Dashboard de transparencia',
      solicitud_origen: 'Portal de transparencia ciudadana',
      tiempo_estimado: '3 meses',
      estado: 'aprobado',
    },
    {
      id: 3,
      titulo: 'Portal de trámites digitales Talca',
      planteamiento_origen: 'Portal de trámites online',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '6 meses',
      fecha_inicio: '2025-03-01',
      estado: 'en_proceso',
    },
    {
      id: 4,
      titulo: 'Sistema de agenda comunitaria',
      planteamiento_origen: 'Agenda digital comunitaria',
      solicitud_origen: 'App móvil para servicios comunitarios',
      tiempo_estimado: '4 meses',
      fecha_inicio: '2025-01-10',
      estado: 'pausado',
    },
    {
      id: 5,
      titulo: 'Plataforma de reportes municipales',
      planteamiento_origen: 'Sistema de reportes automáticos',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '5 meses',
      fecha_inicio: '2024-09-15',
      fecha_termino: '2025-01-10',
      estado: 'cancelado',
    },
    {
      id: 6,
      titulo: 'Módulo de pagos en línea UCM',
      planteamiento_origen: 'Pasarela de pagos institucional',
      solicitud_origen: 'Portal de transparencia ciudadana',
      tiempo_estimado: '3 meses',
      fecha_inicio: '2024-06-01',
      fecha_termino: '2024-09-05',
      estado: 'finalizado',
    },
    {
      id: 7,
      titulo: 'App de seguimiento de solicitudes',
      planteamiento_origen: 'Seguimiento en tiempo real',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '2 meses',
      fecha_inicio: '2025-02-01',
      estado: 'atrasado',
    },
  ];

  // ── Modal Crear Proyecto ──────────────────────────────────────
  mostrarModalCrear = false;
  planteamientoPreseleccionado: ProyectoVista | null = null;
  alumnoSeleccionadoId: number | undefined = undefined;

  formProyecto: {
    id_planteamiento: number | undefined;
    titulo_proyecto: string;
    fecha_inicio: string;
    fecha_termino: string;
  } = { id_planteamiento: undefined, titulo_proyecto: '', fecha_inicio: '', fecha_termino: '' };

  alumnosSeleccionados: AlumnoVista[] = [];
  readonly MAX_ALUMNOS = 5;

  alumnosDisponibles: AlumnoVista[] = [
    { id: 1, rut: '20.123.456-7', nombre: 'Martina González López'  },
    { id: 2, rut: '20.234.567-8', nombre: 'Diego Muñoz Carrasco'    },
    { id: 3, rut: '19.876.543-2', nombre: 'Sofía Reyes Bustamante'  },
    { id: 4, rut: '21.345.678-9', nombre: 'Tomás Vargas Mora'       },
    { id: 5, rut: '20.456.789-K', nombre: 'Valentina Castro Pino'   },
    { id: 6, rut: '19.234.567-1', nombre: 'Matías Herrera Ojeda'    },
    { id: 7, rut: '21.567.890-3', nombre: 'Isidora Rojas Fuentes'   },
  ];

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
    return this.proyectos.filter(p => p.estado === this.filtroActivo);
  }

  get contadorPorEstado(): Record<string, number> {
    return {
      aprobado:   this.proyectos.filter(p => p.estado === 'aprobado').length,
      en_proceso: this.proyectos.filter(p => p.estado === 'en_proceso').length,
      pausado:    this.proyectos.filter(p => p.estado === 'pausado').length,
      cancelado:  this.proyectos.filter(p => p.estado === 'cancelado').length,
      finalizado: this.proyectos.filter(p => p.estado === 'finalizado').length,
      atrasado:   this.proyectos.filter(p => p.estado === 'atrasado').length,
    };
  }

  get planteamientosDisponibles(): ProyectoVista[] {
    return this.proyectos.filter(p => p.estado === 'aprobado');
  }

  get alumnosDisponiblesParaAgregar(): AlumnoVista[] {
    return this.alumnosDisponibles.filter(
      a => !this.alumnosSeleccionados.some(s => s.id === a.id)
    );
  }

  getBadgeEstado(estado: string): string {
    const mapa: Record<string, string> = {
      aprobado:   'bg-emerald-100 text-emerald-700 border-emerald-200',
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
      aprobado:   'Aprobado',
      en_proceso: 'En proceso',
      pausado:    'Pausado',
      cancelado:  'Cancelado',
      finalizado: 'Finalizado',
      atrasado:   'Atrasado',
    };
    return mapa[estado] ?? '—';
  }

  // ── Modal ─────────────────────────────────────────────────────

  abrirCrear(p?: ProyectoVista): void {
    this.planteamientoPreseleccionado = p ?? null;
    this.formProyecto = {
      id_planteamiento: p?.id,
      titulo_proyecto:  p?.titulo ?? '',
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
    this.formProyecto = { id_planteamiento: undefined, titulo_proyecto: '', fecha_inicio: '', fecha_termino: '' };
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
      (this.planteamientoPreseleccionado || this.formProyecto.id_planteamiento) &&
      this.formProyecto.titulo_proyecto?.trim() &&
      this.formProyecto.fecha_inicio &&
      this.formProyecto.fecha_termino
    );
  }

  guardarProyecto(): void {
    if (!this.formValido()) return;
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
