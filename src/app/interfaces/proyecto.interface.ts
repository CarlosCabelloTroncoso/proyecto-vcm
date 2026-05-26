export interface EstadoPlanteamiento {
  id_estado: number;
  nombre_estado: string;
  descripcion_estado: string;
}

export interface EstadoProyecto {
  id_estado: number;
  nombre_estado: string;
  descripcion_estado: string;
}

export interface PlanteamientoProyecto {
  id_planteamiento: number;
  titulo_planteamiento: string;
  descripcion_planteamiento: string;
  tiempo_estimado_planteamiento: string;
  id_carrera: number;
  id_solicitud: number;
  id_usuario: number;
  id_estado: number;
}

export interface Proyecto {
  id_proyecto: number;
  id_planteamiento: number;
  id_estado: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface DetallePlanteamientoAlumno {
  id_planteamiento: number;
  id_alumno: number;
}

export interface Archivo {
  id_archivo: number;
  nombre_archivo: string;
  ruta_archivo: string;
  tipo_archivo: string;
  id_solicitud: number | null;
  id_planteamiento: number | null;
  id_proyecto: number | null;
}

export interface Observacion {
  id_observacion: number;
  id_proyecto: number;
  detalle_observacion: string;
  fecha_observacion: string;
}