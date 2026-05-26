import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Facultad } from '../../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-modal-facultad-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-facultad-form.html',
  styleUrl: './modal-facultad-form.css',
})
export class ModalFacultadForm implements OnChanges {
  @Input() visible     = false;
  @Input() modoEdicion = false;
  @Input() facultad: Partial<Facultad> = {};

  @Output() guardar = new EventEmitter<Partial<Facultad>>();
  @Output() cerrar  = new EventEmitter<void>();

  /** Copia local para no mutar el objeto del padre */
  facultadLocal: Partial<Facultad> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true || changes['facultad']) {
      this.facultadLocal = { ...this.facultad };
    }
  }

  onGuardar(): void {
    this.guardar.emit({ ...this.facultadLocal });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
