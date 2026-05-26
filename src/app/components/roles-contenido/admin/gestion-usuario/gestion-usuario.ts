import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, Rol } from '../../../../interfaces/usuario.interface';
import { ModalUsuarioForm } from './modales/modal-usuario-form/modal-usuario-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';

@Component({
  selector: 'app-gestion-usuario',
  imports: [CommonModule, FormsModule, ModalUsuarioForm, ModalConfirmar],
  templateUrl: './gestion-usuario.html',
  styleUrl: './gestion-usuario.css',
})
export class GestionUsuario {

  /* ─── Roles ────────────────────────────────────────────────── */
  roles: Rol[] = [
    { id_rol: 1, nombre_rol: 'Admin',     descripcion_rol: 'Administrador del sistema' },
    { id_rol: 2, nombre_rol: 'Autoridad', descripcion_rol: 'Autoridad universitaria'   },
    { id_rol: 3, nombre_rol: 'Cliente',   descripcion_rol: 'Usuario cliente'            },
    { id_rol: 4, nombre_rol: 'Encargado', descripcion_rol: 'Encargado de carrera'       },
    { id_rol: 5, nombre_rol: 'Gestor',    descripcion_rol: 'Gestor de vinculación'      },
    { id_rol: 6, nombre_rol: 'Profesor',  descripcion_rol: 'Docente'                    },
  ];

  /* ─── Datos mock ───────────────────────────────────────────── */
  usuarios: Usuario[] = [
    { id_usuario: 1, rut_usuario: '12.345.678-9', nombres_usuario: 'María',    apellidos_usuario: 'González López', telefono_usuario: '+56 9 1234 5678', password_usuario: 'maria2026!',  is_active: true,  fecha_creacion: '2026-01-15', id_rol: 3 },
    { id_usuario: 2, rut_usuario: '9.876.543-2',  nombres_usuario: 'Juan',     apellidos_usuario: 'Pérez Soto',     telefono_usuario: '+56 9 8765 4321', password_usuario: 'jpSoto#99',   is_active: false, fecha_creacion: '2026-02-20', id_rol: 6 },
    { id_usuario: 3, rut_usuario: '15.112.233-K', nombres_usuario: 'Ana',      apellidos_usuario: 'Fuentes Rojas',  telefono_usuario: '+56 9 3322 1100', password_usuario: 'anaF@ucm1',   is_active: true,  fecha_creacion: '2026-03-05', id_rol: 4 },
    { id_usuario: 4, rut_usuario: '8.001.002-3',  nombres_usuario: 'Carlos',   apellidos_usuario: 'Soto Muñoz',     telefono_usuario: '+56 9 5544 3322', password_usuario: 'carloS$2026', is_active: true,  fecha_creacion: '2026-01-28', id_rol: 1 },
    { id_usuario: 5, rut_usuario: '17.445.667-8', nombres_usuario: 'Patricia', apellidos_usuario: 'Morales Díaz',   telefono_usuario: '+56 9 7711 2233', password_usuario: 'Paty.mor!',   is_active: false, fecha_creacion: '2026-04-10', id_rol: 2 },
    { id_usuario: 6, rut_usuario: '14.223.445-6', nombres_usuario: 'Rodrigo',  apellidos_usuario: 'Vega Castillo',  telefono_usuario: '+56 9 6699 8877', password_usuario: 'rvega2026',   is_active: true,  fecha_creacion: '2026-02-14', id_rol: 5 },
    { id_usuario: 7, rut_usuario: '11.998.001-7', nombres_usuario: 'Camila',   apellidos_usuario: 'Herrera Núñez',  telefono_usuario: '+56 9 4433 6655', password_usuario: 'cami#her7',   is_active: true,  fecha_creacion: '2026-03-22', id_rol: 3 },
    { id_usuario: 8, rut_usuario: '16.334.556-2', nombres_usuario: 'Felipe',   apellidos_usuario: 'Torres Alarcón', telefono_usuario: '+56 9 2211 9900', password_usuario: 'felipT@2',    is_active: false, fecha_creacion: '2026-05-01', id_rol: 6 },
  ];

  /* ─── Búsqueda y filtros ───────────────────────────────────── */
  searchTerm   = '';
  filtroTipo   = '';   // '' | 'rol' | 'estado' | 'fecha'
  filtroRol    = '';
  filtroEstado = '';
  filtroFecha  = '';

  /* ─── Estado de modales ────────────────────────────────────── */
  mostrarModalForm     = false;
  mostrarModalEliminar = false;
  modoEdicion          = false;
  usuarioEnEdicion: Partial<Usuario> = {};
  usuarioAEliminar: Usuario | null   = null;

  /* ─── Helpers de presentación ──────────────────────────────── */
  getNombreRol(id_rol: number): string {
    return this.roles.find(r => r.id_rol === id_rol)?.nombre_rol ?? '—';
  }

  getBadgeClases(id_rol: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-rose-100    text-rose-700    border-rose-200',
      2: 'bg-violet-100  text-violet-700  border-violet-200',
      3: 'bg-sky-100     text-sky-700     border-sky-200',
      4: 'bg-cyan-100    text-cyan-700    border-cyan-200',
      5: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      6: 'bg-amber-100   text-amber-700   border-amber-200',
    };
    return mapa[id_rol] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Lista filtrada ───────────────────────────────────────── */
  get usuariosFiltrados(): Usuario[] {
    let lista = [...this.usuarios];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(u =>
        u.nombres_usuario.toLowerCase().includes(t)   ||
        u.apellidos_usuario.toLowerCase().includes(t) ||
        u.rut_usuario.toLowerCase().includes(t)       ||
        u.telefono_usuario.includes(t)
      );
    }
    if (this.filtroTipo === 'rol'    && this.filtroRol)    lista = lista.filter(u => u.id_rol === +this.filtroRol);
    if (this.filtroTipo === 'estado' && this.filtroEstado !== '') lista = lista.filter(u => u.is_active === (this.filtroEstado === 'true'));
    if (this.filtroTipo === 'fecha'  && this.filtroFecha)  lista = lista.filter(u => u.fecha_creacion.startsWith(this.filtroFecha));

    return lista;
  }

  onCambiarFiltroTipo(): void {
    this.filtroRol = this.filtroEstado = this.filtroFecha = '';
  }

  limpiarFiltros(): void {
    this.searchTerm = this.filtroTipo = this.filtroRol = this.filtroEstado = this.filtroFecha = '';
  }

  /* ─── Acciones CRUD ────────────────────────────────────────── */
  abrirCrear(): void {
    this.modoEdicion      = false;
    this.usuarioEnEdicion = { is_active: true, id_rol: 3 };
    this.mostrarModalForm = true;
  }

  abrirEditar(usuario: Usuario): void {
    this.modoEdicion      = true;
    this.usuarioEnEdicion = { ...usuario };
    this.mostrarModalForm = true;
  }

  abrirEliminar(usuario: Usuario): void {
    this.usuarioAEliminar    = usuario;
    this.mostrarModalEliminar = true;
  }

  /** Recibe los datos emitidos por ModalUsuarioForm */
  onGuardarUsuario(datos: Partial<Usuario>): void {
    if (this.modoEdicion) {
      const idx = this.usuarios.findIndex(u => u.id_usuario === datos.id_usuario);
      if (idx !== -1) this.usuarios[idx] = datos as Usuario;
    } else {
      const nuevoId = this.usuarios.length
        ? Math.max(...this.usuarios.map(u => u.id_usuario)) + 1
        : 1;
      this.usuarios.push({
        ...datos,
        id_usuario:     nuevoId,
        fecha_creacion: new Date().toISOString().split('T')[0],
      } as Usuario);
    }
    this.mostrarModalForm = false;
  }

  /** Confirmación del ModalConfirmar */
  onEliminarUsuario(): void {
    if (this.usuarioAEliminar) {
      this.usuarios = this.usuarios.filter(u => u.id_usuario !== this.usuarioAEliminar!.id_usuario);
      this.usuarioAEliminar    = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
