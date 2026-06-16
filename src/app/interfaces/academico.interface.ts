export interface Facultad {
  id_facultad: number;
  nombre_facultad: string;
  etiqueta_facultad: string;
  is_active?: boolean;
}

export interface Carrera {
  id_carrera: number;
  nombre_carrera: string;
  etiqueta_carrera: string;
  id_facultad: number;
  is_active?: boolean;
  // Relaciones
  facultad?: { nombre_facultad: string; etiqueta_facultad: string };
}

export interface AlumnoVoluntario {
  id_alumno: number;
  rut_alumno: string;
  nombres_alumno: string;
  apellidos_alumno: string;
  correo_alumno: string;
  telefono_alumno: string;
  id_carrera: number;
  is_active?: boolean;
  // Relaciones
  carrera?: { nombre_carrera: string; etiqueta_carrera: string };
}
