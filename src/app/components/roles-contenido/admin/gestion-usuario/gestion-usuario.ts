import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { Usuario, Rol } from '../../../../interfaces/usuario.interface';
import { ModalUsuarioForm } from './modales/modal-usuario-form/modal-usuario-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';

@Component({
  selector: 'app-gestion-usuario',
  imports: [CommonModule, FormsModule, ModalUsuarioForm, ModalConfirmar],
  templateUrl: './gestion-usuario.html',
  styleUrl: './gestion-usuario.css',
})
export class GestionUsuario implements OnInit {

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
  usuarios: Usuario[] = [];

  constructor(private dataService: DataService, private catalog: CatalogService) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    const res = await this.dataService.getAll<any>('usuario', { select: '*, rol(nombre_rol)', filters: { is_active: true } });
    if (res.data) this.usuarios = res.data;
  }

  /* ─── Meses del año ───────────────────────────────────────── */
  readonly meses = [
    { valor: '01', nombre: 'Enero'      },
    { valor: '02', nombre: 'Febrero'    },
    { valor: '03', nombre: 'Marzo'      },
    { valor: '04', nombre: 'Abril'      },
    { valor: '05', nombre: 'Mayo'       },
    { valor: '06', nombre: 'Junio'      },
    { valor: '07', nombre: 'Julio'      },
    { valor: '08', nombre: 'Agosto'     },
    { valor: '09', nombre: 'Septiembre' },
    { valor: '10', nombre: 'Octubre'    },
    { valor: '11', nombre: 'Noviembre'  },
    { valor: '12', nombre: 'Diciembre'  },
  ];

  /* ─── Búsqueda y filtros ───────────────────────────────────── */
  searchTerm   = '';
  filtroTipo   = '';   // '' | 'rol' | 'estado' | 'fecha'
  filtroRol    = '';
  filtroEstado = '';
  filtroAnio   = '';
  filtroMes    = '';

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

  /** Años únicos presentes en los datos, ordenados de más reciente a más antiguo */
  get aniosDisponibles(): string[] {
    return [...new Set(this.usuarios.map(u => u.fecha_creacion.slice(0, 4)))]
      .sort()
      .reverse();
  }

  /**
   * Prefijo de fecha efectivo para el filtro:
   *   solo año  → "2026"
   *   año + mes → "2026-05"
   */
  private get filtroFechaEfectiva(): string {
    if (!this.filtroAnio) return '';
    return this.filtroMes ? `${this.filtroAnio}-${this.filtroMes}` : this.filtroAnio;
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
    if (this.filtroTipo === 'rol'    && this.filtroRol)
      lista = lista.filter(u => u.id_rol === +this.filtroRol);
    if (this.filtroTipo === 'estado' && this.filtroEstado !== '')
      lista = lista.filter(u => u.is_active === (this.filtroEstado === 'true'));
    if (this.filtroTipo === 'fecha'  && this.filtroFechaEfectiva)
      lista = lista.filter(u => u.fecha_creacion.startsWith(this.filtroFechaEfectiva));

    return lista;
  }

  onCambiarFiltroTipo(): void {
    this.filtroRol = this.filtroEstado = this.filtroAnio = this.filtroMes = '';
  }

  limpiarFiltros(): void {
    this.searchTerm = this.filtroTipo = this.filtroRol = this.filtroEstado = this.filtroAnio = this.filtroMes = '';
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
  async onGuardarUsuario(datos: Partial<Usuario>): Promise<void> {
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
