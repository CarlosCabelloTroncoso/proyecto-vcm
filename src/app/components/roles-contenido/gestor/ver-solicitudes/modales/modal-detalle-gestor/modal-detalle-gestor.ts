import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../../../interfaces/academico.interface';
import { Usuario } from '../../../../../../interfaces/usuario.interface';
import { Archivo } from '../../../../../../interfaces/proyecto.interface';

@Component({
  selector: 'app-modal-detalle-gestor',
  imports: [CommonModule],
  templateUrl: './modal-detalle-gestor.html',
  styleUrl: './modal-detalle-gestor.css',
})
export class ModalDetalleGestor {

  @Input() visible   = false;
  @Input() solicitud: Solicitud | null = null;
  @Input() estados:   EstadoSolicitud[] = [];
  @Input() carreras:  Carrera[]         = [];
  @Input() ciudades:  Ciudad[]          = [];
  @Input() clientes:  Pick<Usuario, 'id_usuario' | 'nombres_usuario' | 'apellidos_usuario'>[] = [];
  @Input() archivos:  Archivo[]         = [];

  @Output() cerrar   = new EventEmitter<void>();
  @Output() aprobar  = new EventEmitter<Solicitud>();
  @Output() rechazar = new EventEmitter<Solicitud>();

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

  getNombreCliente(id: number): string {
    const u = this.clientes.find(c => c.id_usuario === id);
    return u ? `${u.nombres_usuario} ${u.apellidos_usuario}` : '—';
  }

  getInicialCliente(id: number): string {
    return this.clientes.find(c => c.id_usuario === id)
      ?.nombres_usuario.charAt(0).toUpperCase() ?? '?';
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100   text-amber-700   border-amber-200',
      2: 'bg-sky-100     text-sky-700     border-sky-200',
      3: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      4: 'bg-red-100     text-red-700     border-red-200',
      5: 'bg-gray-100    text-gray-500    border-gray-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Helpers archivos ──────────────────────────────────────── */
  getTipoIcono(tipo: string): 'pdf' | 'word' | 'excel' | 'imagen' | 'otro' {
    const t = tipo.toLowerCase();
    if (t === 'pdf')                                               return 'pdf';
    if (['doc', 'docx'].includes(t))                              return 'word';
    if (['xls', 'xlsx'].includes(t))                              return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(t))        return 'imagen';
    return 'otro';
  }

  getClaseIconoTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      pdf:    'bg-red-50    text-red-500',
      word:   'bg-blue-50   text-blue-500',
      excel:  'bg-emerald-50 text-emerald-600',
      imagen: 'bg-violet-50 text-violet-500',
      otro:   'bg-gray-100  text-gray-500',
    };
    return mapa[this.getTipoIcono(tipo)] ?? mapa['otro'];
  }

  getBadgeTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      pdf:    'bg-red-50    text-red-600',
      word:   'bg-blue-50   text-blue-600',
      excel:  'bg-emerald-50 text-emerald-700',
      imagen: 'bg-violet-50 text-violet-600',
      otro:   'bg-gray-50   text-gray-600',
    };
    return mapa[this.getTipoIcono(tipo)] ?? mapa['otro'];
  }

  /* ─── Acciones ──────────────────────────────────────────────── */
  onAprobar(): void  { if (this.solicitud) this.aprobar.emit(this.solicitud);  }
  onRechazar(): void { if (this.solicitud) this.rechazar.emit(this.solicitud); }
  onCerrar(): void   { this.cerrar.emit(); }
}
