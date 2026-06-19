import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanteamientoProyecto, EstadoPlanteamiento, Archivo } from '../../../../interfaces/proyecto.interface';
import { Solicitud } from '../../../../interfaces/solicitud.interface';
import { ProfesorCarrera } from '../../../../interfaces/usuario.interface';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';
import { ModalDetallePlanteamiento } from '../../../shared/modal-detalle-planteamiento/modal-detalle-planteamiento';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

interface ArchivoEntry {
  archivo: Archivo;
  file?: File;
}

@Component({
  selector: 'app-planteamientos',
  imports: [CommonModule, FormsModule, ModalConfirmar, ModalDetallePlanteamiento],
  templateUrl: './planteamientos.html',
  styleUrl: './planteamientos.css',
})
export class Planteamientos implements OnInit {

  // Datos del profesor vienen del AuthService

  estadosPlanteamiento = signal<EstadoPlanteamiento[]>([]);

  solicitudesAprobadas = signal<Solicitud[]>([]);

  planteamientos = signal<PlanteamientoProyecto[]>([]);

  filtroActivo: 'pendiente' | 'aprobado' | 'rechazado' = 'pendiente';

  mostrarModalForm   = false;
  modoEdicion        = false;
  planteamientoEditando: PlanteamientoProyecto | null = null;
  formData: Partial<PlanteamientoProyecto> = {};

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

  mostrarModalDetalle = false;
  planteamientoDetalle: PlanteamientoProyecto | null = null;

  mostrarModalEliminar = false;
  planteamientoEliminar: PlanteamientoProyecto | null = null;

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estadosPlanteamiento.set(this.catalog.estadosPlanteamiento());

    const u = this.auth.usuario();
    if (u) {
      const [planRes, solRes] = await Promise.all([
        this.dataService.getAll<any>('planteamiento_proyecto', {
          select: '*, estado_planteamiento(nombre_estado), carrera(nombre_carrera), solicitud(titulo_solicitud)',
          filters: { id_usuario: u.id_usuario, is_active: true },
        }),
        this.dataService.getAll<any>('solicitud', {
          select: 'id_solicitud, titulo_solicitud',
          filters: { id_estado: 2, is_active: true },
        }),
      ]);
      if (planRes.data) this.planteamientos.set(planRes.data as PlanteamientoProyecto[]);
      if (solRes.data) this.solicitudesAprobadas.set(solRes.data as Solicitud[]);
      this.cdr.detectChanges();
    }

    this.route.queryParams.subscribe(params => {
      const solicitudId = params['solicitudId'];
      if (solicitudId) {
        this.abrirCrear(+solicitudId);
      }
    });
  }

  get planteamientosFiltrados(): PlanteamientoProyecto[] {
    const idEstado = this.filtroActivo === 'pendiente' ? 1 : this.filtroActivo === 'aprobado' ? 2 : 3;
    return this.planteamientos().filter(p => p.id_estado === idEstado);
  }

  get contadorPorEstado(): Record<string, number> {
    return {
      pendiente: this.planteamientos().filter(p => p.id_estado === 1).length,
      aprobado:  this.planteamientos().filter(p => p.id_estado === 2).length,
      rechazado: this.planteamientos().filter(p => p.id_estado === 3).length,
    };
  }

  getNombreEstado(id: number): string {
    return this.estadosPlanteamiento().find(e => e.id_estado === id)?.nombre_estado ?? '—';
  }

  getTituloSolicitud(id: number): string {
    return this.solicitudesAprobadas().find(s => s.id_solicitud === id)?.titulo_solicitud ?? '—';
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100 text-amber-700 border-amber-200',
      2: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      3: 'bg-red-100 text-red-500 border-red-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  abrirDetalle(p: PlanteamientoProyecto): void {
    this.planteamientoDetalle = p;
    this.mostrarModalDetalle  = true;
  }

  cerrarDetalle(): void {
    this.mostrarModalDetalle  = false;
    this.planteamientoDetalle = null;
  }

  abrirCrear(solicitudId?: number): void {
    this.modoEdicion = false;
    this.planteamientoEditando = null;
    this.formData = {
      titulo_planteamiento: '',
      descripcion_planteamiento: '',
      tiempo_estimado_planteamiento: '',
      id_solicitud: solicitudId,
    };
    this.mostrarModalForm = true;
  }

  abrirEditar(p: PlanteamientoProyecto): void {
    this.modoEdicion = true;
    this.planteamientoEditando = p;
    this.formData = { ...p };
    this.mostrarModalForm = true;
  }

  cerrarModalForm(): void {
    this.mostrarModalForm = false;
    this.planteamientoEditando = null;
    this.formData = {};
    this.archivosAdjuntos = [];
    this.errorArchivos = [];
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }

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
      if (this.archivosAdjuntos.some(e => e.archivo.nombre_archivo === file.name && e.file)) {
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

  getTipoIcono(tipo: string): 'pdf' | 'word' | 'excel' | 'imagen' | 'otro' {
    const t = tipo.toLowerCase();
    if (t === 'pdf')                                                      return 'pdf';
    if (['doc', 'docx'].includes(t))                                      return 'word';
    if (['xls', 'xlsx'].includes(t))                                      return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(t))        return 'imagen';
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

  async guardar(): Promise<void> {
    if (!this.formValido()) return;
    const u = this.auth.usuario();
    if (!u) return;

    if (this.modoEdicion && this.planteamientoEditando) {
      const { data } = await this.dataService.update<PlanteamientoProyecto>(
        'planteamiento_proyecto',
        this.planteamientoEditando.id_planteamiento,
        {
          titulo_planteamiento:          this.formData.titulo_planteamiento!,
          descripcion_planteamiento:     this.formData.descripcion_planteamiento!,
          tiempo_estimado_planteamiento: this.formData.tiempo_estimado_planteamiento!,
          id_solicitud:                  this.formData.id_solicitud!,
        },
        'id_planteamiento'
      );
      if (data) {
        this.planteamientos.update(lista =>
          lista.map(p => p.id_planteamiento === data.id_planteamiento ? { ...p, ...data } : p)
        );
      }
    } else {
      const { data } = await this.dataService.create<PlanteamientoProyecto>('planteamiento_proyecto', {
        titulo_planteamiento:          this.formData.titulo_planteamiento!,
        descripcion_planteamiento:     this.formData.descripcion_planteamiento!,
        tiempo_estimado_planteamiento: this.formData.tiempo_estimado_planteamiento!,
        id_solicitud:                  this.formData.id_solicitud!,
        id_carrera:                    u.profesor?.id_carrera ?? 0,
        id_usuario:                    u.id_usuario,
        id_estado:                     1,
      });
      if (data) {
        this.planteamientos.update(lista => [...lista, data]);
        this.filtroActivo = 'pendiente';
      }
    }
    this.cerrarModalForm();
  }

  abrirEliminar(p: PlanteamientoProyecto): void {
    this.planteamientoEliminar = p;
    this.mostrarModalEliminar  = true;
  }

  cerrarEliminar(): void {
    this.mostrarModalEliminar = false;
    this.planteamientoEliminar = null;
  }

  async confirmarEliminar(): Promise<void> {
    if (!this.planteamientoEliminar) return;
    const id = this.planteamientoEliminar.id_planteamiento;
    await this.dataService.softDelete('planteamiento_proyecto', id, 'id_planteamiento');
    this.planteamientos.update(lista =>
      lista.filter(p => p.id_planteamiento !== id)
    );
    this.cerrarEliminar();
  }

  irACrearProyecto(p: PlanteamientoProyecto): void {
    this.router.navigate(['/profesor/proyectos'], {
      state: {
        abrirCrearProyecto: true,
        planteamiento: {
          id_planteamiento:     p.id_planteamiento,
          titulo_planteamiento: p.titulo_planteamiento,
        },
      },
    });
  }

  formValido(): boolean {
    return !!(
      this.formData.titulo_planteamiento?.trim() &&
      this.formData.descripcion_planteamiento?.trim() &&
      this.formData.tiempo_estimado_planteamiento?.trim() &&
      this.formData.id_solicitud
    );
  }
}
