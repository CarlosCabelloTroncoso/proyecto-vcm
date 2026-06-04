import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, Usuario, ROLES_INTERNOS } from '../../../services/user.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  private userService = inject(UserService);

  usuario: Usuario = this.userService.getUsuario();

  get esRolInterno(): boolean {
    return ROLES_INTERNOS.includes(this.usuario.rol);
  }

  get rolLabel(): string {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      encargado: 'Encargado de Carrera',
      profesor: 'Profesor',
      autoridad: 'Autoridad',
      gestor: 'Gestor'
    };
    return labels[this.usuario.rol] ?? this.usuario.rol;
  }

  get iniciales(): string {
    return `${this.usuario.nombre.charAt(0)}${this.usuario.apellido.charAt(0)}`.toUpperCase();
  }
}
