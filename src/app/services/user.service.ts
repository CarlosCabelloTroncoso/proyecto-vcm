import { Injectable } from '@angular/core';
import { AuthService, UsuarioVCM } from '../core/services/auth.service';
import { Usuario as UsuarioInterface } from '../interfaces/usuario.interface';

// Re-export for backward compatibility
export type Usuario = UsuarioInterface;
export type { UsuarioVCM };

export const ROLES_INTERNOS = ['admin', 'encargado', 'profesor', 'autoridad'];

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private auth: AuthService) {}

  getUsuario(): UsuarioVCM | null {
    return this.auth.usuario();
  }

  getRol(): string | null {
    return this.auth.userRole();
  }

  esRolInterno(): boolean {
    const rol = this.auth.userRole();
    return rol ? ROLES_INTERNOS.includes(rol) : false;
  }

  getNombreCompleto(): string {
    const u = this.auth.usuario();
    return u ? `${u.nombres_usuario} ${u.apellidos_usuario}` : '';
  }
}
