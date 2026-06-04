import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanteamientoProyecto, EstadoPlanteamiento, Archivo } from '../../../interfaces/proyecto.interface';
import { Solicitud } from '../../../interfaces/solicitud.interface';

@Component({
  selector: 'app-modal-detalle-planteamiento',
  imports: [CommonModule],
  templateUrl: './modal-detalle-planteamiento.html',
  styleUrl: './modal-detalle-planteamiento.css',
})
export class ModalDetallePlanteamiento {

  @Input() visible                   = false;
  @Input() planteamiento: PlanteamientoProyecto | null = null;
  @Input() estadosPlanteamiento: EstadoPlanteamiento[] = [];
  @Input() solicitudesAprobadas: Solicitud[]           = [];
  @Input() archivos: Archivo[]                         = [];
  @Input() nombreProfesor?: string;

  @Output() cerrar = new EventEmitter<void>();

  getNombreEstado(id: number): string {
    return this.estadosPlanteamiento.find(e => e.id_estado === id)?.nombre_estado ?? '—';
  }

  getTituloSolicitud(id: number): string {
    return this.solicitudesAprobadas.find(s => s.id_solicitud === id)?.titulo_solicitud ?? '—';
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100 text-amber-700 border-amber-200',
      2: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      3: 'bg-red-100 text-red-700 border-red-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  getTipoIcono(tipo: string): 'pdf' | 'word' | 'excel' | 'imagen' | 'otro' {
    const t = tipo.toLowerCase();
    if (t === 'pdf')                                                       return 'pdf';
    if (['doc', 'docx'].includes(t))                                       return 'word';
    if (['xls', 'xlsx'].includes(t))                                       return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(t))         return 'imagen';
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

  onCerrar(): void {
    this.cerrar.emit();
  }
}
