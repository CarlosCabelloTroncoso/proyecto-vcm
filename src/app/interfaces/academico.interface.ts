export interface Facultad {
  id_facultad: number;
  nombre_facultad: string;
  etiqueta_facultad: string;
}

export interface Carrera {
  id_carrera: number;
  nombre_carrera: string;
  etiqueta_carrera: string;
  id_facultad: number;
}

export interface AlumnoVoluntario {
  id_alumno: number;
  rut_alumno: string;
  nombres_alumno: string;
  apellidos_alumno: string;
  correo_alumno: string;
  telefono_alumno: string;
  id_carrera: number;
}