import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../../../interfaces/academico.interface';

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

  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Solicitud>();

  /* ─── Helpers ──────────────────────────────────────────────── */
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
      1: 'bg-amber-100   text-amber-700   border-amber-200',
      2: 'bg-sky-100     text-sky-700     border-sky-200',
      3: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      4: 'bg-red-100     text-red-700     border-red-200',
      5: 'bg-gray-100    text-gray-600    border-gray-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  onEditar(): void {
    if (this.solicitud) this.editar.emit(this.solicitud);
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
