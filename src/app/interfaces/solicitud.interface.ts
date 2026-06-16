export interface Ciudad {
  id_ciudad: number;
  nombre_ciudad: string;
  is_active?: boolean;
}

export interface EstadoSolicitud {
  id_estado: number;
  nombre_estado: string;
  descripcion_estado: string;
  is_active?: boolean;
}

export interface Solicitud {
  id_solicitud: number;
  titulo_solicitud: string;
  descripcion_solicitud: string;
  fecha_creacion_solicitud: string;
  id_estado: number;
  id_usuario: number;
  id_carrera: number;
  id_ciudad?: number | null;
  is_active?: boolean;
  // Relaciones (cuando se usa select con joins)
  estado_solicitud?: { nombre_estado: string };
  usuario?: { nombres_usuario: string; apellidos_usuario: string; rut_usuario: string };
  carrera?: { nombre_carrera: string; etiqueta_carrera: string };
  ciudad?: { nombre_ciudad: string };
}
