import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, Rol } from '../../../../../../interfaces/usuario.interface';
import { Carrera } from '../../../../../../interfaces/academico.interface';

type UsuarioForm = Partial<Usuario> & { email?: string; id_carrera?: number };

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
  @Input() carreras: Carrera[] = [];

  @Output() guardar = new EventEmitter<UsuarioForm>();
  @Output() cerrar  = new EventEmitter<void>();

  usuarioLocal: UsuarioForm = {};

  private readonly rolLabels: Record<string, string> = {
    cliente:   'Cliente',
    profesor:  'Profesor',
    encargado: 'Gestor de Vinculación',
    autoridad: 'Autoridad',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true || changes['usuario']) {
      this.usuarioLocal = { ...this.usuario };
    }
  }

  get rolRequiereCarrera(): boolean {
    const rol = this.roles.find(r => r.id_rol === +this.usuarioLocal.id_rol!);
    return rol?.nombre_rol === 'encargado' || rol?.nombre_rol === 'profesor';
  }

  getRolLabel(nombre: string): string {
    return this.rolLabels[nombre] ?? nombre;
  }

  onRolChange(): void {
    if (!this.rolRequiereCarrera) {
      this.usuarioLocal.id_carrera = undefined;
    }
  }

  onGuardar(): void {
    this.guardar.emit({ ...this.usuarioLocal });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
