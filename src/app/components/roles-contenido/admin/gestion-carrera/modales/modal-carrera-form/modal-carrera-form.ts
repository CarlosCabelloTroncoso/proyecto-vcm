import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Carrera, Facultad } from '../../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-modal-carrera-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-carrera-form.html',
  styleUrl: './modal-carrera-form.css',
})
export class ModalCarreraForm implements OnChanges {
  @Input() visible     = false;
  @Input() modoEdicion = false;
  @Input() carrera: Partial<Carrera> = {};
  @Input() facultades: Facultad[]    = [];

  @Output() guardar = new EventEmitter<Partial<Carrera>>();
  @Output() cerrar  = new EventEmitter<void>();

  /** Copia local para no mutar el objeto del padre */
  carreraLocal: Partial<Carrera> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true || changes['carrera']) {
      this.carreraLocal = { ...this.carrera };
    }
  }

  onGuardar(): void {
    // Normaliza id_facultad como número (viene como string desde el select)
    this.guardar.emit({
      ...this.carreraLocal,
      id_facultad: Number(this.carreraLocal.id_facultad),
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
