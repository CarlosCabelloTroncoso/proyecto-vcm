import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SupabaseService } from '../../../core/services/supabase.service';

const ROLE_LABELS: Record<string, string> = {
  admin:     'Administrador',
  encargado: 'Encargado de Vinculación',
  profesor:  'Profesor',
  autoridad: 'Autoridad',
  cliente:   'Cliente'
};

const ROLES_INTERNOS = ['admin', 'encargado', 'profesor', 'autoridad'];

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Perfil {
  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);

  usuario    = computed(() => this.auth.usuario());
  email      = computed(() => this.auth.session()?.user?.email ?? '');
  iniciales  = computed(() => {
    const u = this.auth.usuario();
    if (!u) return '??';
    return `${u.nombres_usuario.charAt(0)}${u.apellidos_usuario.charAt(0)}`.toUpperCase();
  });
  esRolInterno = computed(() => {
    const rol = this.auth.userRole();
    return rol ? ROLES_INTERNOS.includes(rol) : false;
  });
  rolLabel = computed(() => {
    const rol = this.auth.userRole();
    return rol ? (ROLE_LABELS[rol] ?? rol) : '';
  });

  editando     = signal(false);
  guardando    = signal(false);
  mensajeExito = signal('');
  mensajeError = signal('');

  formNombres   = '';
  formApellidos = '';
  formTelefono  = '';

  iniciarEdicion(): void {
    const u = this.usuario();
    if (!u) return;
    this.formNombres   = u.nombres_usuario;
    this.formApellidos = u.apellidos_usuario;
    this.formTelefono  = u.telefono_usuario ?? '';
    this.mensajeExito.set('');
    this.mensajeError.set('');
    this.editando.set(true);
  }

  cancelarEdicion(): void {
    this.editando.set(false);
  }

  async guardar(): Promise<void> {
    const u = this.usuario();
    if (!u || !this.formNombres.trim() || !this.formApellidos.trim()) return;

    this.guardando.set(true);
    this.mensajeError.set('');

    const { error } = await this.supabase.client
      .from('usuario')
      .update({
        nombres_usuario:   this.formNombres.trim(),
        apellidos_usuario: this.formApellidos.trim(),
        telefono_usuario:  this.formTelefono.trim()
      })
      .eq('id_usuario', u.id_usuario);

    this.guardando.set(false);

    if (error) {
      this.mensajeError.set('Error al guardar los cambios. Inténtalo de nuevo.');
    } else {
      await this.auth.reloadPerfil();
      this.mensajeExito.set('Perfil actualizado correctamente.');
      this.editando.set(false);
    }
  }
}
