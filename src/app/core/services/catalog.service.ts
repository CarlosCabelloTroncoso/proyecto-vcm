import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { EstadoSolicitud, Ciudad } from '../../interfaces/solicitud.interface';
import { Carrera, Facultad } from '../../interfaces/academico.interface';
import { EstadoPlanteamiento, EstadoProyecto } from '../../interfaces/proyecto.interface';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private supabase: SupabaseClient;
  private _loaded = false;

  private _estados = signal<EstadoSolicitud[]>([]);
  private _estadosPlanteamiento = signal<EstadoPlanteamiento[]>([]);
  private _estadosProyecto = signal<EstadoProyecto[]>([]);
  private _carreras = signal<Carrera[]>([]);
  private _ciudades = signal<Ciudad[]>([]);
  private _facultades = signal<Facultad[]>([]);

  estados = this._estados.asReadonly();
  estadosPlanteamiento = this._estadosPlanteamiento.asReadonly();
  estadosProyecto = this._estadosProyecto.asReadonly();
  carreras = this._carreras.asReadonly();
  ciudades = this._ciudades.asReadonly();
  facultades = this._facultades.asReadonly();

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.client;
  }

  invalidate(): void {
    this._loaded = false;
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

    this._estados.set((est.data || []) as EstadoSolicitud[]);
    this._estadosPlanteamiento.set((estP.data || []) as EstadoPlanteamiento[]);
    this._estadosProyecto.set((estPr.data || []) as EstadoProyecto[]);
    this._carreras.set((car.data || []) as Carrera[]);
    this._ciudades.set((ciu.data || []) as Ciudad[]);
    this._facultades.set((fac.data || []) as Facultad[]);

    this._loaded = true;
  }

  // Helpers usados por muchos componentes
  getNombreEstado(id: number): string {
    return this._estados().find(e => e.id_estado === id)?.nombre_estado || '—';
  }

  getNombreEstadoPlanteamiento(id: number): string {
    return this._estadosPlanteamiento().find(e => e.id_estado === id)?.nombre_estado || '—';
  }

  getNombreEstadoProyecto(id: number): string {
    return this._estadosProyecto().find(e => e.id_estado === id)?.nombre_estado || '—';
  }

  getNombreCarrera(id: number): string {
    return this._carreras().find(c => c.id_carrera === id)?.nombre_carrera || '—';
  }

  getEtiquetaCarrera(id: number): string {
    return this._carreras().find(c => c.id_carrera === id)?.etiqueta_carrera || '—';
  }

  getNombreCiudad(id: number): string {
    return this._ciudades().find(c => c.id_ciudad === id)?.nombre_ciudad || '—';
  }

  getNombreFacultad(id: number): string {
    return this._facultades().find(f => f.id_facultad === id)?.nombre_facultad || '—';
  }

  // Compara nombres de estado ignorando mayúsculas/minúsculas y espacios,
  // porque en BD algunos vienen con distinta capitalización (ej: "En Proceso").
  private mismoNombre(a: string, b: string): boolean {
    return (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase();
  }

  getIdEstado(nombre: string): number {
    return this._estados().find(e => this.mismoNombre(e.nombre_estado, nombre))?.id_estado || 0;
  }

  getIdEstadoPlanteamiento(nombre: string): number {
    return this._estadosPlanteamiento().find(e => this.mismoNombre(e.nombre_estado, nombre))?.id_estado || 0;
  }

  getIdEstadoProyecto(nombre: string): number {
    return this._estadosProyecto().find(e => this.mismoNombre(e.nombre_estado, nombre))?.id_estado || 0;
  }
}
