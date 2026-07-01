import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, Rol } from '../../../../../../interfaces/usuario.interface';
import { Carrera } from '../../../../../../interfaces/academico.interface';
import { validarRut, limpiarRut } from '../../../../../../core/utils/rut.util';

type UsuarioForm = Partial<Usuario> & { email?: string; password?: string; id_carrera?: number; cargo?: string };

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

  tipoDocumento: 'rut' | 'pasaporte' = 'rut';
  errorRut = '';

  private readonly rolLabels: Record<string, string> = {
    cliente:   'Cliente',
    profesor:  'Profesor',
    encargado: 'Encargado',
    autoridad: 'Autoridad',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true || changes['usuario']) {
      this.usuarioLocal = { ...this.usuario };
      this.errorRut = '';
      // Al editar, si el documento existente no pasa como RUT, asumimos pasaporte
      this.tipoDocumento =
        this.usuarioLocal.rut_usuario && !validarRut(this.usuarioLocal.rut_usuario)
          ? 'pasaporte'
          : 'rut';
    }
  }

  get rolNombre(): string {
    return this.roles.find(r => r.id_rol === +this.usuarioLocal.id_rol!)?.nombre_rol ?? '';
  }

  get rolRequiereCarrera(): boolean {
    return this.rolNombre === 'encargado' || this.rolNombre === 'profesor';
  }

  get rolRequiereCargo(): boolean {
    return this.rolNombre === 'autoridad';
  }

  getRolLabel(nombre: string): string {
    return this.rolLabels[nombre] ?? nombre;
  }

  onRolChange(): void {
    if (!this.rolRequiereCarrera) this.usuarioLocal.id_carrera = undefined;
    if (!this.rolRequiereCargo)   this.usuarioLocal.cargo      = undefined;
  }

  onGuardar(): void {
    const doc = (this.usuarioLocal.rut_usuario ?? '').trim();
    if (this.tipoDocumento === 'rut') {
      const rut = limpiarRut(doc);
      if (!validarRut(rut)) {
        this.errorRut = 'El RUT no es válido. Revísalo (ej: 12345678-5).';
        return;
      }
      this.usuarioLocal.rut_usuario = rut;
    } else {
      if (doc.length < 5) {
        this.errorRut = 'Ingresa un número de pasaporte válido.';
        return;
      }
      this.usuarioLocal.rut_usuario = doc.toUpperCase();
    }
    this.errorRut = '';
    this.guardar.emit({ ...this.usuarioLocal });
  }

  onCerrar(): void {
    this.errorRut = '';
    this.cerrar.emit();
  }
}
