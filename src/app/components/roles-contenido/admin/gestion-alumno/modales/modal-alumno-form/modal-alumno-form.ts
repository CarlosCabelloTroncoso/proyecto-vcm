import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoVoluntario, Carrera } from '../../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-modal-alumno-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-alumno-form.html',
  styleUrl: './modal-alumno-form.css',
})
export class ModalAlumnoForm implements OnChanges {
  @Input() visible     = false;
  @Input() modoEdicion = false;
  @Input() alumno: Partial<AlumnoVoluntario> = {};
  @Input() carreras: Carrera[] = [];

  @Output() guardar = new EventEmitter<Partial<AlumnoVoluntario>>();
  @Output() cerrar  = new EventEmitter<void>();

  /** Copia local para no mutar el objeto del padre */
  alumnoLocal: Partial<AlumnoVoluntario> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true || changes['alumno']) {
      this.alumnoLocal = { ...this.alumno };
    }
  }

  onGuardar(): void {
    this.guardar.emit({
      ...this.alumnoLocal,
      id_carrera: Number(this.alumnoLocal.id_carrera),
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
