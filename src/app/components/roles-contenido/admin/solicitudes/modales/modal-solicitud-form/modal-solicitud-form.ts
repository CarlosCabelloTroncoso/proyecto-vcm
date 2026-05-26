import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-modal-solicitud-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-solicitud-form.html',
  styleUrl: './modal-solicitud-form.css',
})
export class ModalSolicitudForm implements OnChanges {
  @Input() visible  = false;
  @Input() solicitud: Partial<Solicitud>    = {};
  @Input() estados:   EstadoSolicitud[]     = [];
  @Input() carreras:  Carrera[]             = [];
  @Input() ciudades:  Ciudad[]              = [];

  @Output() guardar = new EventEmitter<Partial<Solicitud>>();
  @Output() cerrar  = new EventEmitter<void>();

  /** Copia local para no mutar el objeto del padre */
  solicitudLocal: Partial<Solicitud> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true || changes['solicitud']) {
      this.solicitudLocal = { ...this.solicitud };
    }
  }

  onGuardar(): void {
    this.guardar.emit({ ...this.solicitudLocal });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
