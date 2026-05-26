export interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion_rol: string;
}

export interface Usuario {
  id_usuario: number;
  rut_usuario: string;
  nombres_usuario: string;
  apellidos_usuario: string;
  telefono_usuario: string;
  password_usuario: string;
  is_active: boolean;
  fecha_creacion: string;
  id_rol: number;
}

export interface Profesor {
  id_usuario: number;
  titulo_academico: string;
}

export interface GestorVinculacion {
  id_usuario: number;
  id_carrera: number;
}

export interface EncargadoCarrera {
  id_usuario: number;
  id_carrera: number;
}