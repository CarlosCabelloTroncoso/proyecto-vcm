import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  gestor_vinculacion: 'Encargado de Vinculación',
  profesor: 'Profesor',
  autoridad: 'Autoridad',
  cliente: 'Cliente'
};

const ROLES_INTERNOS = ['admin', 'gestor_vinculacion', 'profesor', 'autoridad'];

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  auth = inject(AuthService);

  get usuario() {
    return this.auth.usuario();
  }

  get esRolInterno(): boolean {
    const rol = this.auth.userRole();
    return rol ? ROLES_INTERNOS.includes(rol) : false;
  }

  get rolLabel(): string {
    const rol = this.auth.userRole();
    return rol ? (ROLE_LABELS[rol] ?? rol) : '';
  }

  get iniciales(): string {
    const u = this.usuario;
    if (!u) return '??';
    return `${u.nombres_usuario.charAt(0)}${u.apellidos_usuario.charAt(0)}`.toUpperCase();
  }
}
