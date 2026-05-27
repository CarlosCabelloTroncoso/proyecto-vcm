import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Solicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';

/** Par interno: metadatos del archivo + referencia al File nativo (si es nuevo). */
interface ArchivoEntry {
  archivo: Archivo;
  file?: File;   // undefined → archivo ya existente (modo editar)
}

@Component({
  selector: 'app-crear-solicitud',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-solicitud.html',
  styleUrl: './crear-solicitud.css',
})
export class CrearSolicitud implements OnInit {

  /* ─── Modo del formulario ──────────────────────────────────── */
  modo: 'crear' | 'editar' = 'crear';
  solicitudOriginal: Solicitud | null = null;

  /* ─── Datos de referencia ──────────────────────────────────── */
  carreras: Carrera[] = [
    { id_carrera: 1,  nombre_carrera: 'Ingeniería Civil Informática', etiqueta_carrera: 'ICI',  id_facultad: 1 },
    { id_carrera: 2,  nombre_carrera: 'Ingeniería Civil Industrial',  etiqueta_carrera: 'ICIV', id_facultad: 1 },
    { id_carrera: 3,  nombre_carrera: 'Ingeniería Civil Biomédica',   etiqueta_carrera: 'ICBM', id_facultad: 1 },
    { id_carrera: 4,  nombre_carrera: 'Enfermería',                   etiqueta_carrera: 'ENF',  id_facultad: 2 },
    { id_carrera: 5,  nombre_carrera: 'Kinesiología',                 etiqueta_carrera: 'KIN',  id_facultad: 2 },
    { id_carrera: 6,  nombre_carrera: 'Derecho',                      etiqueta_carrera: 'DER',  id_facultad: 3 },
    { id_carrera: 7,  nombre_carrera: 'Administración de Empresas',   etiqueta_carrera: 'ADM',  id_facultad: 4 },
    { id_carrera: 8,  nombre_carrera: 'Contador Auditor',             etiqueta_carrera: 'CA',   id_facultad: 4 },
    { id_carrera: 9,  nombre_carrera: 'Pedagogía en Matemáticas',     etiqueta_carrera: 'PEM',  id_facultad: 5 },
    { id_carrera: 10, nombre_carrera: 'Bioquímica',                   etiqueta_carrera: 'BQM',  id_facultad: 6 },
  ];

  ciudades: Ciudad[] = [
    { id_ciudad: 1, nombre_ciudad: 'Talca'      },
    { id_ciudad: 2, nombre_ciudad: 'Santiago'   },
    { id_ciudad: 3, nombre_ciudad: 'Concepción' },
    { id_ciudad: 4, nombre_ciudad: 'Rancagua'   },
    { id_ciudad: 5, nombre_ciudad: 'Curicó'     },
  ];

  /* ─── Formulario ───────────────────────────────────────────── */
  form: Partial<Solicitud> = {
    titulo_solicitud:      '',
    descripcion_solicitud: '',
    id_carrera:            undefined,
    id_ciudad:             undefined,
  };

  /* ─── Archivos adjuntos ─────────────────────────────────────── */
  archivosAdjuntos: ArchivoEntry[] = [];
  arrastrandoArchivo = false;
  errorArchivos: string[] = [];

  private _archivoIdCounter = 9000;

  readonly TIPOS_ACEPTADOS = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'text/plain',
  ];
  readonly TAMANO_MAX_MB = 10;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;
    if (state?.modo === 'editar' && state?.solicitud) {
      this.modo              = 'editar';
      this.solicitudOriginal = state.solicitud;
      this.form = {
        titulo_solicitud:      state.solicitud.titulo_solicitud,
        descripcion_solicitud: state.solicitud.descripcion_solicitud,
        id_carrera:            state.solicitud.id_carrera,
        id_ciudad:             state.solicitud.id_ciudad,
      };
      // Cargar archivos existentes de la solicitud
      if (state?.archivos?.length) {
        this.archivosAdjuntos = (state.archivos as Archivo[]).map(a => ({ archivo: a }));
      }
    }
  }

  /* ─── Manejo de archivos ────────────────────────────────────── */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.procesarArchivos(Array.from(input.files));
      input.value = '';   // permite reseleccionar el mismo archivo
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
      const yaExiste = this.archivosAdjuntos.some(
        e => e.archivo.nombre_archivo === file.name && e.file
      );
      if (yaExiste) {
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
      this.archivosAdjuntos.push({ archivo: archivoMock, file });
    });
  }

  eliminarArchivo(index: number): void {
    this.archivosAdjuntos.splice(index, 1);
  }

  /* ─── Helpers visuales ──────────────────────────────────────── */
  getTipoIcono(tipo: string): 'pdf' | 'word' | 'excel' | 'imagen' | 'otro' {
    const t = tipo.toLowerCase();
    if (t === 'pdf')                              return 'pdf';
    if (['doc', 'docx'].includes(t))              return 'word';
    if (['xls', 'xlsx'].includes(t))              return 'excel';
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
    if (bytes < 1024)           return `${bytes} B`;
    if (bytes < 1024 * 1024)    return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /* ─── Submit ───────────────────────────────────────────────── */
  onSubmit(): void {
    if (!this.formularioValido) return;

    if (this.modo === 'crear') {
      const idNuevo = Date.now();
      const nueva: Solicitud = {
        id_solicitud:             idNuevo,
        titulo_solicitud:         this.form.titulo_solicitud!.trim(),
        descripcion_solicitud:    this.form.descripcion_solicitud!.trim(),
        fecha_creacion_solicitud: new Date().toISOString().split('T')[0],
        id_estado:                1,
        id_usuario:               1,
        id_carrera:               +this.form.id_carrera!,
        id_ciudad:                +this.form.id_ciudad!,
      };
      const archivos: Archivo[] = this.archivosAdjuntos.map(e => ({
        ...e.archivo,
        id_solicitud: idNuevo,
      }));

      this.router.navigate(['/cliente/mis-solicitudes'], {
        state: { nuevaSolicitud: nueva, archivos }
      });

    } else {
      const actualizada: Solicitud = {
        ...this.solicitudOriginal!,
        titulo_solicitud:      this.form.titulo_solicitud!.trim(),
        descripcion_solicitud: this.form.descripcion_solicitud!.trim(),
        id_carrera:            +this.form.id_carrera!,
        id_ciudad:             +this.form.id_ciudad!,
      };
      const archivos: Archivo[] = this.archivosAdjuntos.map(e => ({
        ...e.archivo,
        id_solicitud: this.solicitudOriginal!.id_solicitud,
      }));

      this.router.navigate(['/cliente/mis-solicitudes'], {
        state: { solicitudEditada: actualizada, archivos }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/cliente/mis-solicitudes']);
  }

  /* ─── Helpers ──────────────────────────────────────────────── */
  get formularioValido(): boolean {
    return !!(
      this.form.titulo_solicitud?.trim()    &&
      this.form.descripcion_solicitud?.trim() &&
      this.form.id_carrera                  &&
      this.form.id_ciudad
    );
  }
}
