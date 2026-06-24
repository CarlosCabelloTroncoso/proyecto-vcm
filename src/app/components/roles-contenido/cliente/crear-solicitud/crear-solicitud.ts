import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Solicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { SupabaseService } from '../../../../core/services/supabase.service';

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
  carreras: Carrera[] = [];

  ciudades: Ciudad[] = [];

  /* ─── Formulario ───────────────────────────────────────────── */
  form: Partial<Solicitud> = {
    titulo_solicitud:      '',
    descripcion_solicitud: '',
    id_carrera:            undefined,
    id_ciudad:             undefined,
  };

  /* ─── Archivos adjuntos ─────────────────────────────────────── */
  archivosAdjuntos: ArchivoEntry[] = [];
  archivosEliminados: Archivo[] = [];
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

  constructor(
    private auth: AuthService,
    private dataService: DataService,
    private catalog: CatalogService,
    private supabaseService: SupabaseService,
    private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.carreras = this.catalog.carreras();
    this.ciudades = this.catalog.ciudades();

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
    const entry = this.archivosAdjuntos[index];
    if (!entry.file) {
      this.archivosEliminados.push(entry.archivo);
    }
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
  async onSubmit(): Promise<void> {
    if (!this.formularioValido) return;

    const idUsuario = this.auth.usuario()?.id_usuario;
    if (!idUsuario) return;

    if (this.modo === 'crear') {
      const { data } = await this.dataService.create<Solicitud>('solicitud', {
        titulo_solicitud:         this.form.titulo_solicitud!.trim(),
        descripcion_solicitud:    this.form.descripcion_solicitud!.trim(),
        fecha_creacion_solicitud: new Date().toISOString().split('T')[0],
        id_estado:                1,
        id_usuario:               idUsuario,
        id_carrera:               +this.form.id_carrera!,
        id_ciudad:                +this.form.id_ciudad!,
      });

      if (data) {
        await this.subirNuevosArchivos('solicitudes', data.id_solicitud);
      }

      this.router.navigate(['/cliente/mis-solicitudes'], {
        state: data ? { abrirDetalleId: data.id_solicitud } : undefined,
      });

    } else {
      const idSolicitud = this.solicitudOriginal!.id_solicitud;

      await this.dataService.update('solicitud', idSolicitud, {
        titulo_solicitud:      this.form.titulo_solicitud!.trim(),
        descripcion_solicitud: this.form.descripcion_solicitud!.trim(),
        id_carrera:            +this.form.id_carrera!,
        id_ciudad:             +this.form.id_ciudad!,
      }, 'id_solicitud');

      await this.eliminarArchivosRemovidos();
      await this.subirNuevosArchivos('solicitudes', idSolicitud);

      this.router.navigate(['/cliente/mis-solicitudes'], {
        state: { abrirDetalleId: idSolicitud },
      });
    }
  }

  private sanitizarNombreArchivo(nombre: string): string {
    return nombre
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  private async subirNuevosArchivos(
    carpeta: 'solicitudes' | 'planteamientos' | 'proyectos',
    idEntidad: number
  ): Promise<void> {
    const nuevos = this.archivosAdjuntos.filter(e => !!e.file);
    for (const entry of nuevos) {
      const file             = entry.file!;
      const extension        = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
      const nombreSanitizado = this.sanitizarNombreArchivo(file.name);
      const ruta             = `${carpeta}/${idEntidad}/${Date.now()}_${nombreSanitizado}`;

      const { error: storageError } = await this.supabaseService.client.storage
        .from('vcm-archivos')
        .upload(ruta, file, { upsert: true });

      if (storageError) {
        console.error('[Storage] Error al subir archivo:', storageError);
        continue;
      }

      const { error: dbError } = await this.dataService.create('archivo', {
        nombre_archivo:   file.name,
        ruta_archivo:     ruta,
        tipo_archivo:     extension,
        id_solicitud:     carpeta === 'solicitudes'    ? idEntidad : null,
        id_planteamiento: carpeta === 'planteamientos' ? idEntidad : null,
        id_proyecto:      carpeta === 'proyectos'      ? idEntidad : null,
      });

      if (dbError) {
        console.error('[DB] Error al registrar archivo:', dbError);
      }
    }
  }

  private async eliminarArchivosRemovidos(): Promise<void> {
    for (const archivo of this.archivosEliminados) {
      await this.supabaseService.client.storage
        .from('vcm-archivos')
        .remove([archivo.ruta_archivo]);
      await this.dataService.hardDelete('archivo', archivo.id_archivo, 'id_archivo');
    }
    this.archivosEliminados = [];
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
