export interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion_rol: string;
  is_active?: boolean;
}

export interface Usuario {
  id_usuario: number;
  auth_uid: string;
  rut_usuario: string;
  nombres_usuario: string;
  apellidos_usuario: string;
  telefono_usuario: string;
  is_active?: boolean;
  fecha_creacion: string;
  id_rol: number;
  // Relaciones
  rol?: Rol;
  gestor_vinculacion_carrera?: { id_carrera: number; carrera?: { nombre_carrera: string; etiqueta_carrera: string } } | null;
  profesor?: { id_carrera: number; carrera?: { nombre_carrera: string; etiqueta_carrera: string } } | null;
}

export interface GestorVinculacionCarrera {
  id_usuario: number;
  id_carrera: number;
  is_active?: boolean;
}

export interface ProfesorCarrera {
  id_usuario: number;
  id_carrera: number;
  is_active?: boolean;
}

export interface Autoridad {
  id_usuario: number;
  cargo: string;
  is_active?: boolean;
}

// Alias para compatibilidad con componentes existentes
export type EncargadoCarrera = GestorVinculacionCarrera;
