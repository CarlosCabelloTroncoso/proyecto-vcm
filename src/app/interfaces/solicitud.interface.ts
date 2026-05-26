export interface Ciudad {
  id_ciudad: number;
  nombre_ciudad: string;
}

export interface EstadoSolicitud {
  id_estado: number;
  nombre_estado: string;
  descripcion_estado: string;
}

export interface Solicitud {
  id_solicitud: number;
  titulo_solicitud: string;
  descripcion_solicitud: string;
  fecha_creacion_solicitud: string;
  id_estado: number;
  id_usuario: number;
  id_carrera: number;
  id_ciudad: number;
}