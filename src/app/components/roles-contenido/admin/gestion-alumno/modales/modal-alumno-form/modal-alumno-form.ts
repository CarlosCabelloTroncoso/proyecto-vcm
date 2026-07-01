import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoVoluntario, Carrera } from '../../../../../../interfaces/academico.interface';
import { validarRut, limpiarRut } from '../../../../../../core/utils/rut.util';

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

  errorRut = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true || changes['alumno']) {
      this.alumnoLocal = { ...this.alumno };
      this.errorRut = '';
    }
  }

  onGuardar(): void {
    const rut = limpiarRut(this.alumnoLocal.rut_alumno ?? '');
    if (!validarRut(rut)) {
      this.errorRut = 'El RUT del alumno no es válido. Revísalo (ej: 20111222-3).';
      return;
    }
    this.errorRut = '';
    this.guardar.emit({
      ...this.alumnoLocal,
      rut_alumno: rut,
      id_carrera: Number(this.alumnoLocal.id_carrera),
    });
  }

  onCerrar(): void {
    this.errorRut = '';
    this.cerrar.emit();
  }
}
