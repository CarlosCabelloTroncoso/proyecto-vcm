import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { EstadoSolicitud, Ciudad } from '../../interfaces/solicitud.interface';
import { Carrera, Facultad } from '../../interfaces/academico.interface';
import { EstadoPlanteamiento, EstadoProyecto } from '../../interfaces/proyecto.interface';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private supabase: SupabaseClient;
  private _loaded = false;

  estados: EstadoSolicitud[] = [];
  estadosPlanteamiento: EstadoPlanteamiento[] = [];
  estadosProyecto: EstadoProyecto[] = [];
  carreras: Carrera[] = [];
  ciudades: Ciudad[] = [];
  facultades: Facultad[] = [];

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.client;
  }

  async load(): Promise<void> {
    if (this._loaded) return;

    const [est, estP, estPr, car, ciu, fac] = await Promise.all([
      this.supabase.from('estado_solicitud').select('*').eq('is_active', true),
      this.supabase.from('estado_planteamiento').select('*').eq('is_active', true),
      this.supabase.from('estado_proyecto').select('*').eq('is_active', true),
      this.supabase.from('carrera').select('*, facultad(nombre_facultad, etiqueta_facultad)').eq('is_active', true),
      this.supabase.from('ciudad').select('*').eq('is_active', true),
      this.supabase.from('facultad').select('*').eq('is_active', true),
    ]);

    this.estados = (est.data || []) as EstadoSolicitud[];
    this.estadosPlanteamiento = (estP.data || []) as EstadoPlanteamiento[];
    this.estadosProyecto = (estPr.data || []) as EstadoProyecto[];
    this.carreras = (car.data || []) as Carrera[];
    this.ciudades = (ciu.data || []) as Ciudad[];
    this.facultades = (fac.data || []) as Facultad[];

    this._loaded = true;
  }

  // Helpers usados por muchos componentes
  getNombreEstado(id: number): string {
    return this.estados.find(e => e.id_estado === id)?.nombre_estado || '—';
  }

  getNombreEstadoPlanteamiento(id: number): string {
    return this.estadosPlanteamiento.find(e => e.id_estado === id)?.nombre_estado || '—';
  }

  getNombreEstadoProyecto(id: number): string {
    return this.estadosProyecto.find(e => e.id_estado === id)?.nombre_estado || '—';
  }

  getNombreCarrera(id: number): string {
    return this.carreras.find(c => c.id_carrera === id)?.nombre_carrera || '—';
  }

  getEtiquetaCarrera(id: number): string {
    return this.carreras.find(c => c.id_carrera === id)?.etiqueta_carrera || '—';
  }

  getNombreCiudad(id: number): string {
    return this.ciudades.find(c => c.id_ciudad === id)?.nombre_ciudad || '—';
  }

  getNombreFacultad(id: number): string {
    return this.facultades.find(f => f.id_facultad === id)?.nombre_facultad || '—';
  }

  getIdEstado(nombre: string): number {
    return this.estados.find(e => e.nombre_estado === nombre)?.id_estado || 0;
  }

  getIdEstadoPlanteamiento(nombre: string): number {
    return this.estadosPlanteamiento.find(e => e.nombre_estado === nombre)?.id_estado || 0;
  }

  getIdEstadoProyecto(nombre: string): number {
    return this.estadosProyecto.find(e => e.nombre_estado === nombre)?.id_estado || 0;
  }
}
