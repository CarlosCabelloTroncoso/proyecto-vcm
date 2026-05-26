import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Facultad } from '../../../../interfaces/academico.interface';
import { ModalFacultadForm } from './modales/modal-facultad-form/modal-facultad-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';

@Component({
  selector: 'app-gestion-facultad',
  imports: [CommonModule, FormsModule, ModalFacultadForm, ModalConfirmar],
  templateUrl: './gestion-facultad.html',
  styleUrl: './gestion-facultad.css',
})
export class GestionFacultad {

  /* ─── Datos mock ───────────────────────────────────────────── */
  facultades: Facultad[] = [
    { id_facultad: 1, nombre_facultad: 'Facultad de Ingeniería',           etiqueta_facultad: 'ING'   },
    { id_facultad: 2, nombre_facultad: 'Facultad de Ciencias de la Salud', etiqueta_facultad: 'SALUD' },
    { id_facultad: 3, nombre_facultad: 'Facultad de Ciencias Jurídicas',   etiqueta_facultad: 'DER'   },
    { id_facultad: 4, nombre_facultad: 'Facultad de Ciencias Económicas',  etiqueta_facultad: 'ECON'  },
    { id_facultad: 5, nombre_facultad: 'Facultad de Educación',            etiqueta_facultad: 'EDU'   },
    { id_facultad: 6, nombre_facultad: 'Facultad de Ciencias Básicas',     etiqueta_facultad: 'CIEN'  },
  ];

  /* ─── Búsqueda y filtros ───────────────────────────────────── */
  searchTerm     = '';
  filtroEtiqueta = '';

  /* ─── Estado de modales ────────────────────────────────────── */
  mostrarModalForm     = false;
  mostrarModalEliminar = false;
  modoEdicion          = false;
  facultadEnEdicion: Partial<Facultad> = {};
  facultadAEliminar: Facultad | null   = null;

  /* ─── Helper badge por etiqueta (hash de color) ────────────── */
  getBadgeClases(etiqueta: string): string {
    const colores = [
      'bg-teal-100     text-teal-700     border-teal-200',
      'bg-violet-100   text-violet-700   border-violet-200',
      'bg-sky-100      text-sky-700      border-sky-200',
      'bg-amber-100    text-amber-700    border-amber-200',
      'bg-rose-100     text-rose-700     border-rose-200',
      'bg-emerald-100  text-emerald-700  border-emerald-200',
      'bg-orange-100   text-orange-700   border-orange-200',
      'bg-indigo-100   text-indigo-700   border-indigo-200',
    ];
    const hash = etiqueta.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colores[hash % colores.length];
  }

  /* ─── Etiquetas únicas para el selector de filtro ─────────── */
  get etiquetasUnicas(): string[] {
    return [...new Set(this.facultades.map(f => f.etiqueta_facultad))].sort();
  }

  /* ─── Lista filtrada ───────────────────────────────────────── */
  get facultadesFiltradas(): Facultad[] {
    let lista = [...this.facultades];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(f =>
        f.nombre_facultad.toLowerCase().includes(t) ||
        f.etiqueta_facultad.toLowerCase().includes(t)
      );
    }
    if (this.filtroEtiqueta) {
      lista = lista.filter(f => f.etiqueta_facultad === this.filtroEtiqueta);
    }
    return lista;
  }

  limpiarFiltros(): void {
    this.searchTerm = this.filtroEtiqueta = '';
  }

  /* ─── Acciones CRUD ────────────────────────────────────────── */
  abrirCrear(): void {
    this.modoEdicion      = false;
    this.facultadEnEdicion = {};
    this.mostrarModalForm = true;
  }

  abrirEditar(facultad: Facultad): void {
    this.modoEdicion       = true;
    this.facultadEnEdicion = { ...facultad };
    this.mostrarModalForm  = true;
  }

  abrirEliminar(facultad: Facultad): void {
    this.facultadAEliminar    = facultad;
    this.mostrarModalEliminar = true;
  }

  onGuardarFacultad(datos: Partial<Facultad>): void {
    if (this.modoEdicion) {
      const idx = this.facultades.findIndex(f => f.id_facultad === datos.id_facultad);
      if (idx !== -1) this.facultades[idx] = datos as Facultad;
    } else {
      const nuevoId = this.facultades.length
        ? Math.max(...this.facultades.map(f => f.id_facultad)) + 1
        : 1;
      this.facultades.push({ ...datos, id_facultad: nuevoId } as Facultad);
    }
    this.mostrarModalForm = false;
  }

  onEliminarFacultad(): void {
    if (this.facultadAEliminar) {
      this.facultades = this.facultades.filter(
        f => f.id_facultad !== this.facultadAEliminar!.id_facultad
      );
      this.facultadAEliminar    = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
