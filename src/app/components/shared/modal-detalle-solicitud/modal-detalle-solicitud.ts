import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../interfaces/solicitud.interface';
import { Carrera } from '../../../interfaces/academico.interface';
import { Archivo } from '../../../interfaces/proyecto.interface';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-modal-detalle-solicitud',
  imports: [CommonModule],
  templateUrl: './modal-detalle-solicitud.html',
  styleUrl: './modal-detalle-solicitud.css',
})
export class ModalDetalleSolicitud {

  @Input() visible   = false;
  @Input() solicitud: Solicitud | null = null;
  @Input() estados:   EstadoSolicitud[] = [];
  @Input() carreras:  Carrera[]         = [];
  @Input() ciudades:  Ciudad[]          = [];
  @Input() archivos:  Archivo[]         = [];

  @Input() nombreCliente?: string;
  @Input() permitirEditar = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Solicitud>();

  constructor(private supabaseService: SupabaseService) {}

  async descargar(archivo: Archivo): Promise<void> {
    const { data } = await this.supabaseService.client.storage
      .from('vcm-archivos')
      .createSignedUrl(archivo.ruta_archivo, 60, { download: archivo.nombre_archivo });
    if (data?.signedUrl) {
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.target = '_blank';
      a.click();
    }
  }

  /* ─── Helpers solicitud ────────────────────────────────────── */
  getNombreEstado(id: number): string {
    return this.estados.find(e => e.id_estado === id)?.nombre_estado ?? '—';
  }

  getNombreCarrera(id: number): string {
    return this.carreras.find(c => c.id_carrera === id)?.nombre_carrera ?? '—';
  }

  getEtiquetaCarrera(id: number): string {
    return this.carreras.find(c => c.id_carrera === id)?.etiqueta_carrera ?? '—';
  }

  getNombreCiudad(id: number): string {
    return this.ciudades.find(c => c.id_ciudad === id)?.nombre_ciudad ?? '—';
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100 text-amber-700 border-amber-200',
      2: 'bg-green-100 text-green-700 border-green-200',
      3: 'bg-red-100   text-red-700   border-red-200',
      4: 'bg-sky-100   text-sky-700   border-sky-200',
      5: 'bg-gray-100  text-gray-600  border-gray-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Helpers archivos ──────────────────────────────────────── */
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

  /* ─── Acciones ──────────────────────────────────────────────── */
  onEditar(): void {
    if (this.solicitud) this.editar.emit(this.solicitud);
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
