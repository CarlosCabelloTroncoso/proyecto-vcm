import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, Rol } from '../../../../../../interfaces/usuario.interface';

@Component({
  selector: 'app-modal-usuario-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-usuario-form.html',
  styleUrl: './modal-usuario-form.css',
})
export class ModalUsuarioForm implements OnChanges {
  @Input() visible      = false;
  @Input() modoEdicion  = false;
  @Input() usuario: Partial<Usuario> = {};
  @Input() roles: Rol[] = [];

  @Output() guardar = new EventEmitter<Partial<Usuario>>();
  @Output() cerrar  = new EventEmitter<void>();

  /** Copia local para no mutar el objeto del padre */
  usuarioLocal: Partial<Usuario> = {};
  mostrarPassword = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true || changes['usuario']) {
      // Clona el objeto recibido para trabajar localmente
      this.usuarioLocal   = { ...this.usuario };
      // En modo Crear la contraseña se muestra por defecto
      this.mostrarPassword = !this.modoEdicion;
    }
  }

  onGuardar(): void {
    this.guardar.emit({ ...this.usuarioLocal });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
