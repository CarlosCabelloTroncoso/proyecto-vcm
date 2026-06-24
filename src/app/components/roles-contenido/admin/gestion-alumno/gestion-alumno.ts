import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoVoluntario, Carrera } from '../../../../interfaces/academico.interface';
import { ModalAlumnoForm } from './modales/modal-alumno-form/modal-alumno-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-gestion-alumno',
  imports: [CommonModule, FormsModule, ModalAlumnoForm, ModalConfirmar],
  templateUrl: './gestion-alumno.html',
  styleUrl: './gestion-alumno.css',
})
export class GestionAlumno implements OnInit {

  constructor(private dataService: DataService, private catalog: CatalogService) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.carreras = this.catalog.carreras();
    const alumnosRes = await this.dataService.getAll<any>('alumno_voluntario', { select: `*, carrera(nombre_carrera, etiqueta_carrera)`, filters: { is_active: true } });
    if (alumnosRes.data) this.alumnos.set(alumnosRes.data);
  }


  /* ─── Carreras de referencia ───────────────────────────────── */
  carreras: Carrera[] = [];

  /* ─── Datos mock ───────────────────────────────────────────── */
  alumnos = signal<AlumnoVoluntario[]>([]);

  /* ─── Búsqueda y filtros ───────────────────────────────────── */
  searchTerm    = '';
  filtroCarrera = '';

  /* ─── Estado de modales ────────────────────────────────────── */
  mostrarModalForm     = false;
  mostrarModalEliminar = false;
  modoEdicion          = false;
  alumnoEnEdicion: Partial<AlumnoVoluntario> = {};
  alumnoAEliminar: AlumnoVoluntario | null   = null;

  /* ─── Helpers de presentación ──────────────────────────────── */
  getNombreCarrera(id_carrera: number): string {
    return this.carreras.find(c => c.id_carrera === id_carrera)?.nombre_carrera ?? '—';
  }

  getEtiquetaCarrera(id_carrera: number): string {
    return this.carreras.find(c => c.id_carrera === id_carrera)?.etiqueta_carrera ?? '—';
  }

  getBadgeClasesCarrera(id_carrera: number): string {
    const colores: Record<number, string> = {
      1:  'bg-blue-100    text-blue-700    border-blue-200',
      2:  'bg-violet-100  text-violet-700  border-violet-200',
      3:  'bg-pink-100    text-pink-700    border-pink-200',
      4:  'bg-emerald-100 text-emerald-700 border-emerald-200',
      5:  'bg-teal-100    text-teal-700    border-teal-200',
      6:  'bg-purple-100  text-purple-700  border-purple-200',
      7:  'bg-amber-100   text-amber-700   border-amber-200',
      8:  'bg-green-100   text-green-700   border-green-200',
      9:  'bg-sky-100     text-sky-700     border-sky-200',
      10: 'bg-cyan-100    text-cyan-700    border-cyan-200',
    };
    return colores[id_carrera] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  /* ─── Lista filtrada ───────────────────────────────────────── */
  get alumnosFiltrados(): AlumnoVoluntario[] {
    let lista = [...this.alumnos()];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(a =>
        a.nombres_alumno.toLowerCase().includes(t)    ||
        a.apellidos_alumno.toLowerCase().includes(t)  ||
        a.rut_alumno.toLowerCase().includes(t)        ||
        a.correo_alumno.toLowerCase().includes(t)     ||
        a.telefono_alumno.includes(t)
      );
    }
    if (this.filtroCarrera) {
      lista = lista.filter(a => a.id_carrera === +this.filtroCarrera);
    }

    return lista;
  }

  limpiarFiltros(): void {
    this.searchTerm = this.filtroCarrera = '';
  }

  /* ─── Acciones CRUD ────────────────────────────────────────── */
  abrirCrear(): void {
    this.modoEdicion     = false;
    this.alumnoEnEdicion = { id_carrera: 1 };
    this.mostrarModalForm = true;
  }

  abrirEditar(alumno: AlumnoVoluntario): void {
    this.modoEdicion     = true;
    this.alumnoEnEdicion = { ...alumno };
    this.mostrarModalForm = true;
  }

  abrirEliminar(alumno: AlumnoVoluntario): void {
    this.alumnoAEliminar     = alumno;
    this.mostrarModalEliminar = true;
  }

  async onGuardarAlumno(datos: Partial<AlumnoVoluntario>): Promise<void> {
    if (this.modoEdicion && datos.id_alumno) {
      await this.dataService.update('alumno_voluntario', datos.id_alumno, datos, 'id_alumno');
    } else {
      await this.dataService.create('alumno_voluntario', datos);
    }
    this.mostrarModalForm = false;
    await this.ngOnInit();
  }

  async onEliminarAlumno(): Promise<void> {
    if (this.alumnoAEliminar) {
      const id = this.alumnoAEliminar.id_alumno;
      const { error } = await this.dataService.softDelete('alumno_voluntario', id, 'id_alumno');
      if (!error) {
        this.alumnos.update(lista => lista.filter(a => a.id_alumno !== id));
      }
      this.alumnoAEliminar     = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
