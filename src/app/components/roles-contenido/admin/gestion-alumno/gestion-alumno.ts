import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoVoluntario, Carrera } from '../../../../interfaces/academico.interface';
import { ModalAlumnoForm } from './modales/modal-alumno-form/modal-alumno-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';

@Component({
  selector: 'app-gestion-alumno',
  imports: [CommonModule, FormsModule, ModalAlumnoForm, ModalConfirmar],
  templateUrl: './gestion-alumno.html',
  styleUrl: './gestion-alumno.css',
})
export class GestionAlumno {

  /* ─── Carreras de referencia ───────────────────────────────── */
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

  /* ─── Datos mock ───────────────────────────────────────────── */
  alumnos: AlumnoVoluntario[] = [
    { id_alumno: 1,  rut_alumno: '20.111.222-3', nombres_alumno: 'Sofía',    apellidos_alumno: 'Ramírez Torres',   correo_alumno: 'sofia.ramirez@ucm.cl',    telefono_alumno: '+56 9 1111 2222', id_carrera: 1  },
    { id_alumno: 2,  rut_alumno: '20.333.444-5', nombres_alumno: 'Matías',   apellidos_alumno: 'Navarro Pinto',    correo_alumno: 'matias.navarro@ucm.cl',   telefono_alumno: '+56 9 3333 4444', id_carrera: 1  },
    { id_alumno: 3,  rut_alumno: '20.555.666-7', nombres_alumno: 'Valentina',apellidos_alumno: 'Soto Campos',      correo_alumno: 'valentina.soto@ucm.cl',   telefono_alumno: '+56 9 5555 6666', id_carrera: 2  },
    { id_alumno: 4,  rut_alumno: '20.777.888-9', nombres_alumno: 'Benjamín', apellidos_alumno: 'Fuentes Araya',    correo_alumno: 'benjamin.fuentes@ucm.cl', telefono_alumno: '+56 9 7777 8888', id_carrera: 3  },
    { id_alumno: 5,  rut_alumno: '20.999.000-1', nombres_alumno: 'Isidora',  apellidos_alumno: 'Muñoz Cerda',      correo_alumno: 'isidora.munoz@ucm.cl',    telefono_alumno: '+56 9 9999 0000', id_carrera: 4  },
    { id_alumno: 6,  rut_alumno: '21.222.333-4', nombres_alumno: 'Diego',    apellidos_alumno: 'Vásquez Molina',   correo_alumno: 'diego.vasquez@ucm.cl',    telefono_alumno: '+56 9 2222 3333', id_carrera: 5  },
    { id_alumno: 7,  rut_alumno: '21.444.555-6', nombres_alumno: 'Catalina', apellidos_alumno: 'Rojas Espinoza',   correo_alumno: 'catalina.rojas@ucm.cl',   telefono_alumno: '+56 9 4444 5555', id_carrera: 6  },
    { id_alumno: 8,  rut_alumno: '21.666.777-8', nombres_alumno: 'Sebastián',apellidos_alumno: 'Castro Medina',    correo_alumno: 'sebastian.castro@ucm.cl', telefono_alumno: '+56 9 6666 7777', id_carrera: 7  },
    { id_alumno: 9,  rut_alumno: '21.888.999-0', nombres_alumno: 'Antonia',  apellidos_alumno: 'Herrera Salinas',  correo_alumno: 'antonia.herrera@ucm.cl',  telefono_alumno: '+56 9 8888 9999', id_carrera: 8  },
    { id_alumno: 10, rut_alumno: '22.000.111-2', nombres_alumno: 'Felipe',   apellidos_alumno: 'Bravo Contreras',  correo_alumno: 'felipe.bravo@ucm.cl',     telefono_alumno: '+56 9 0000 1111', id_carrera: 9  },
    { id_alumno: 11, rut_alumno: '22.333.444-5', nombres_alumno: 'Javiera',  apellidos_alumno: 'Pizarro Leiva',    correo_alumno: 'javiera.pizarro@ucm.cl',  telefono_alumno: '+56 9 3333 4445', id_carrera: 10 },
    { id_alumno: 12, rut_alumno: '22.555.666-7', nombres_alumno: 'Ignacio',  apellidos_alumno: 'Alarcón Vera',     correo_alumno: 'ignacio.alarcon@ucm.cl',  telefono_alumno: '+56 9 5555 6667', id_carrera: 1  },
  ];

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
    let lista = [...this.alumnos];

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

  onGuardarAlumno(datos: Partial<AlumnoVoluntario>): void {
    if (this.modoEdicion) {
      const idx = this.alumnos.findIndex(a => a.id_alumno === datos.id_alumno);
      if (idx !== -1) this.alumnos[idx] = datos as AlumnoVoluntario;
    } else {
      const nuevoId = this.alumnos.length
        ? Math.max(...this.alumnos.map(a => a.id_alumno)) + 1
        : 1;
      this.alumnos.push({ ...datos, id_alumno: nuevoId } as AlumnoVoluntario);
    }
    this.mostrarModalForm = false;
  }

  onEliminarAlumno(): void {
    if (this.alumnoAEliminar) {
      this.alumnos = this.alumnos.filter(
        a => a.id_alumno !== this.alumnoAEliminar!.id_alumno
      );
      this.alumnoAEliminar     = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
