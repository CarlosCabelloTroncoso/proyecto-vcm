import { Injectable } from '@angular/core';

export interface Usuario {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  foto: string;
  rol: string;
}

export const ROLES_INTERNOS = ['admin', 'encargado', 'profesor', 'autoridad', 'gestor'];

@Injectable({ providedIn: 'root' })
export class UserService {
  private usuario: Usuario = {
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@ucm.cl',
    telefono: '+56 9 1234 5678',
    foto: '',
    rol: 'encargado'
  };

  getUsuario(): Usuario {
    return this.usuario;
  }

  esRolInterno(): boolean {
    return ROLES_INTERNOS.includes(this.usuario.rol);
  }
}
