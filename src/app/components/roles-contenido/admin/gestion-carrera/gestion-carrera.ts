import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Carrera, Facultad } from '../../../../interfaces/academico.interface';
import { ModalCarreraForm } from './modales/modal-carrera-form/modal-carrera-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';

@Component({
  selector: 'app-gestion-carrera',
  imports: [CommonModule, FormsModule, ModalCarreraForm, ModalConfirmar],
  templateUrl: './gestion-carrera.html',
  styleUrl: './gestion-carrera.css',
})
export class GestionCarrera {

  /* ─── Facultades de referencia ─────────────────────────────── */
  facultades: Facultad[] = [
    { id_facultad: 1, nombre_facultad: 'Facultad de Ingeniería',           etiqueta_facultad: 'ING'   },
    { id_facultad: 2, nombre_facultad: 'Facultad de Ciencias de la Salud', etiqueta_facultad: 'SALUD' },
    { id_facultad: 3, nombre_facultad: 'Facultad de Ciencias Jurídicas',   etiqueta_facultad: 'DER'   },
    { id_facultad: 4, nombre_facultad: 'Facultad de Ciencias Económicas',  etiqueta_facultad: 'ECON'  },
    { id_facultad: 5, nombre_facultad: 'Facultad de Educación',            etiqueta_facultad: 'EDU'   },
    { id_facultad: 6, nombre_facultad: 'Facultad de Ciencias Básicas',     etiqueta_facultad: 'CIEN'  },
  ];

  /* ─── Datos mock ───────────────────────────────────────────── */
  carreras: Carrera[] = [
    { id_carrera: 1,  nombre_carrera: 'Ingeniería Civil Informática', etiqueta_carrera: 'ICI',  id_facultad: 1 },
    { id_carrera: 2,  nombre_carrera: 'Ingeniería Civil Industrial',  etiqueta_carrera: 'ICIV', id_facultad: 1 },
    { id_carrera: 3,  nombre_carrera: 'Ingeniería Civil Biomédica',   etiqueta_carrera: 'ICBM', id_facultad: 1 },
    { id_carrera: 4,  nombre_carrera: 'Enfermería',                   etiqueta_carrera: 'ENF',  id_facultad: 2 },
    { id_carrera: 5,  nombre_carrera: 'Kinesiología',                 etiqueta_carrera: 'KIN',  id_facultad: 2 },
    { id_carrera: 6,  nombre_carrera: 'Derecho',                      etiqueta_carrera: 'DER',  id_facultad: 3 },
    { id_carrera: 7,  nombre_carrera: 'Administración de Empresas',   etiqueta_carrera: 'ADM',  id_facultad: 4 },
    { id_carrera: 8,  nombre_carrera: 'Contador Auditor',             etiqueta_carrera: 'CA',   id_facultad: 4 },
    { id_carrera: 9,  nombre_carrera: 'Pedagogía en Matemáticas',     etiqueta_carrera: 'PEM',  id_facultad: 5 },
    { id_carrera: 10, nombre_carrera: 'Bioquímica',                   etiqueta_carrera: 'BQM',  id_facultad: 6 },
  ];

  /* ─── Búsqueda y filtros ───────────────────────────────────── */
  searchTerm     = '';
  filtroEtiqueta = '';
  filtroFacultad = '';

  /* ─── Estado de modales ────────────────────────────────────── */
  mostrarModalForm     = false;
  mostrarModalEliminar = false;
  modoEdicion          = false;
  carreraEnEdicion: Partial<Carrera> = {};
  carreraAEliminar: Carrera | null   = null;

  /* ─── Helpers de presentación ──────────────────────────────── */
  getNombreFacultad(id_facultad: number): string {
    return this.facultades.find(f => f.id_facultad === id_facultad)?.nombre_facultad ?? '—';
  }

  getBadgeClasesEtiqueta(etiqueta: string): string {
    const colores = [
      'bg-teal-100    text-teal-700    border-teal-200',
      'bg-violet-100  text-violet-700  border-violet-200',
      'bg-sky-100     text-sky-700     border-sky-200',
      'bg-amber-100   text-amber-700   border-amber-200',
      'bg-rose-100    text-rose-700    border-rose-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-orange-100  text-orange-700  border-orange-200',
      'bg-indigo-100  text-indigo-700  border-indigo-200',
    ];
    const hash = etiqueta.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colores[hash % colores.length];
  }

  getBadgeClasesFacultad(id_facultad: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-blue-100   text-blue-700   border-blue-200',
      2: 'bg-pink-100   text-pink-700   border-pink-200',
      3: 'bg-purple-100 text-purple-700 border-purple-200',
      4: 'bg-green-100  text-green-700  border-green-200',
      5: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      6: 'bg-cyan-100   text-cyan-700   border-cyan-200',
    };
    return mapa[id_facultad] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  /* ─── Etiquetas únicas para el selector de filtro ─────────── */
  get etiquetasUnicas(): string[] {
    return [...new Set(this.carreras.map(c => c.etiqueta_carrera))].sort();
  }

  /* ─── Lista filtrada ───────────────────────────────────────── */
  get carrerasFiltradas(): Carrera[] {
    let lista = [...this.carreras];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(c =>
        c.nombre_carrera.toLowerCase().includes(t)          ||
        c.etiqueta_carrera.toLowerCase().includes(t)        ||
        this.getNombreFacultad(c.id_facultad).toLowerCase().includes(t)
      );
    }
    if (this.filtroEtiqueta) lista = lista.filter(c => c.etiqueta_carrera === this.filtroEtiqueta);
    if (this.filtroFacultad) lista = lista.filter(c => c.id_facultad === +this.filtroFacultad);

    return lista;
  }

  limpiarFiltros(): void {
    this.searchTerm = this.filtroEtiqueta = this.filtroFacultad = '';
  }

  /* ─── Acciones CRUD ────────────────────────────────────────── */
  abrirCrear(): void {
    this.modoEdicion      = false;
    this.carreraEnEdicion = { id_facultad: 1 };
    this.mostrarModalForm = true;
  }

  abrirEditar(carrera: Carrera): void {
    this.modoEdicion      = true;
    this.carreraEnEdicion = { ...carrera };
    this.mostrarModalForm = true;
  }

  abrirEliminar(carrera: Carrera): void {
    this.carreraAEliminar    = carrera;
    this.mostrarModalEliminar = true;
  }

  onGuardarCarrera(datos: Partial<Carrera>): void {
    if (this.modoEdicion) {
      const idx = this.carreras.findIndex(c => c.id_carrera === datos.id_carrera);
      if (idx !== -1) this.carreras[idx] = datos as Carrera;
    } else {
      const nuevoId = this.carreras.length
        ? Math.max(...this.carreras.map(c => c.id_carrera)) + 1
        : 1;
      this.carreras.push({ ...datos, id_carrera: nuevoId } as Carrera);
    }
    this.mostrarModalForm = false;
  }

  onEliminarCarrera(): void {
    if (this.carreraAEliminar) {
      this.carreras = this.carreras.filter(
        c => c.id_carrera !== this.carreraAEliminar!.id_carrera
      );
      this.carreraAEliminar     = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
