import { Component, OnInit, signal, inject, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario, Rol } from '../../../../interfaces/usuario.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { ModalUsuarioForm } from './modales/modal-usuario-form/modal-usuario-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';

type UsuarioForm = Partial<Usuario> & { email?: string; password?: string; id_carrera?: number; cargo?: string };

@Component({
  selector: 'app-gestion-usuario',
  imports: [CommonModule, FormsModule, ModalUsuarioForm, ModalConfirmar],
  templateUrl: './gestion-usuario.html',
  styleUrl: './gestion-usuario.css',
})
export class GestionUsuario implements OnInit {

  private auth = inject(AuthService);

  roles: Rol[] = [];         // para el modal (sin admin)
  todosLosRoles: Rol[] = []; // para la tabla y filtros (con admin)

  private readonly rolLabels: Record<string, string> = {
    admin:      'Administrador',
    cliente:    'Cliente',
    profesor:   'Profesor',
    encargado:  'Encargado',
    autoridad:  'Autoridad',
  };

  /* ─── Datos ────────────────────────────────────────────────── */
  usuarios = signal<Usuario[]>([]);
  usuariosInactivos = signal<Usuario[]>([]);

  /* ─── Vista activos / inactivos ────────────────────────────── */
  verInactivos = false;

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  get carreras(): Carrera[] {
    return this.catalog.carreras();
  }

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    const select = '*, rol(nombre_rol), gestor_vinculacion_carrera(id_carrera, carrera(nombre_carrera, etiqueta_carrera)), profesor(id_carrera, carrera(nombre_carrera, etiqueta_carrera)), autoridad(cargo)';
    const [usuRes, inactivosRes, rolRes] = await Promise.all([
      this.dataService.getAll<any>('usuario', { select, filters: { is_active: true } }),
      this.dataService.getAll<any>('usuario', { select, filters: { is_active: false } }),
      this.dataService.getAll<Rol>('rol', { filters: { is_active: true } }),
    ]);
    if (usuRes.data)       this.usuarios.set(usuRes.data);
    if (inactivosRes.data) this.usuariosInactivos.set(inactivosRes.data);
    if (rolRes.data) {
      this.todosLosRoles = rolRes.data;
      this.roles = rolRes.data.filter(r => r.nombre_rol !== 'admin');
    }
    this.cdr.detectChanges();
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
  usuarioEnEdicion: Partial<Usuario> & { id_carrera?: number } = {};
  usuarioAEliminar: Usuario | null   = null;

  esPropioUsuario(u: Usuario): boolean {
    return u.id_usuario === this.auth.usuario()?.id_usuario;
  }

  /* ─── Helpers de presentación ──────────────────────────────── */
  getNombreRol(id_rol: number): string {
    const rol = this.todosLosRoles.find(r => r.id_rol === id_rol);
    if (!rol) return '—';
    return this.rolLabels[rol.nombre_rol] ?? rol.nombre_rol;
  }

  getBadgeClases(id_rol: number): string {
    const nombre = this.todosLosRoles.find(r => r.id_rol === id_rol)?.nombre_rol ?? '';
    const mapa: Record<string, string> = {
      admin:              'bg-rose-100    text-rose-700    border-rose-200',
      autoridad:          'bg-violet-100  text-violet-700  border-violet-200',
      cliente:            'bg-sky-100     text-sky-700     border-sky-200',
      encargado:          'bg-emerald-100 text-emerald-700 border-emerald-200',
      profesor:           'bg-amber-100   text-amber-700   border-amber-200',
    };
    return mapa[nombre] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  getCarreraUsuario(u: any): { nombre: string; etiqueta: string } {
    const resolve = (raw: any) =>
      Array.isArray(raw) ? raw[0]?.carrera : raw?.carrera;
    const c = resolve(u.gestor_vinculacion_carrera) ?? resolve(u.profesor);
    if (c) return { nombre: c.nombre_carrera ?? '', etiqueta: c.etiqueta_carrera ?? '' };
    const cargo = Array.isArray(u.autoridad) ? u.autoridad[0]?.cargo : u.autoridad?.cargo;
    if (cargo) return { nombre: cargo, etiqueta: '' };
    return { nombre: '', etiqueta: '' };
  }

  getBadgeCarreraEtiqueta(etiqueta: string): string {
    if (!etiqueta) return '';
    const colores = [
      'bg-blue-100    text-blue-700    border-blue-200',
      'bg-violet-100  text-violet-700  border-violet-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-amber-100   text-amber-700   border-amber-200',
      'bg-sky-100     text-sky-700     border-sky-200',
      'bg-rose-100    text-rose-700    border-rose-200',
      'bg-teal-100    text-teal-700    border-teal-200',
      'bg-pink-100    text-pink-700    border-pink-200',
    ];
    const hash = etiqueta.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colores[hash % colores.length];
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /** Años únicos presentes en los datos, ordenados de más reciente a más antiguo */
  get aniosDisponibles(): string[] {
    return [...new Set(this.usuarios().map(u => u.fecha_creacion.slice(0, 4)))]
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

  /* ─── Fuente según vista (activos / inactivos) ─────────────── */
  private get fuente(): Usuario[] {
    return this.verInactivos ? this.usuariosInactivos() : this.usuarios();
  }

  /* ─── Lista filtrada ───────────────────────────────────────── */
  get usuariosFiltrados(): Usuario[] {
    let lista = [...this.fuente];

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

  /* ─── Vista activos / inactivos ────────────────────────────── */
  cambiarVista(verInactivos: boolean): void {
    this.verInactivos = verInactivos;
    this.limpiarFiltros();
  }

  async reactivar(usuario: Usuario): Promise<void> {
    const { error } = await this.dataService.update('usuario', usuario.id_usuario, { is_active: true }, 'id_usuario');
    if (!error) {
      this.usuariosInactivos.update(lista => lista.filter(u => u.id_usuario !== usuario.id_usuario));
      this.usuarios.update(lista => [...lista, { ...usuario, is_active: true }]);
    }
  }

  /* ─── Acciones CRUD ────────────────────────────────────────── */
  abrirCrear(): void {
    this.modoEdicion      = false;
    this.usuarioEnEdicion = { is_active: true, id_rol: 3 };
    this.mostrarModalForm = true;
  }

  async abrirEditar(usuario: Usuario): Promise<void> {
    this.modoEdicion      = true;
    this.usuarioEnEdicion = { ...usuario };

    const rolNombre = this.todosLosRoles.find(r => r.id_rol === usuario.id_rol)?.nombre_rol;
    if (rolNombre === 'encargado') {
      const res = await this.dataService.getAll<{ id_carrera: number }>(
        'gestor_vinculacion_carrera',
        { filters: { id_usuario: usuario.id_usuario } }
      );
      if (res.data?.[0]) this.usuarioEnEdicion = { ...this.usuarioEnEdicion, id_carrera: res.data[0].id_carrera };
    } else if (rolNombre === 'profesor') {
      const res = await this.dataService.getAll<{ id_carrera: number }>(
        'profesor',
        { filters: { id_usuario: usuario.id_usuario } }
      );
      if (res.data?.[0]) this.usuarioEnEdicion = { ...this.usuarioEnEdicion, id_carrera: res.data[0].id_carrera };
    }

    this.mostrarModalForm = true;
  }

  abrirEliminar(usuario: Usuario): void {
    this.usuarioAEliminar    = usuario;
    this.mostrarModalEliminar = true;
  }

  /** Recibe los datos emitidos por ModalUsuarioForm */
  async onGuardarUsuario(datos: UsuarioForm): Promise<void> {
    const sb = this.supabaseService.client;

    if (this.modoEdicion && datos.id_usuario) {
      const idUsuario  = datos.id_usuario;
      const nuevoRolId = datos.id_rol!;
      const nuevoRol   = this.todosLosRoles.find(r => r.id_rol === nuevoRolId)?.nombre_rol;
      const viejoRol   = this.todosLosRoles.find(r => r.id_rol === this.usuarioEnEdicion.id_rol)?.nombre_rol;

      // 1. Actualizar datos base del usuario
      await this.dataService.update('usuario', idUsuario, {
        nombres_usuario:   datos.nombres_usuario,
        apellidos_usuario: datos.apellidos_usuario,
        telefono_usuario:  datos.telefono_usuario,
        id_rol:            nuevoRolId,
      }, 'id_usuario');

      // 2. Desactivar tabla de rol anterior si cambió
      if (viejoRol !== nuevoRol) {
        if (viejoRol === 'profesor')
          await sb.from('profesor').update({ is_active: false }).eq('id_usuario', idUsuario);
        if (viejoRol === 'encargado')
          await sb.from('gestor_vinculacion_carrera').update({ is_active: false }).eq('id_usuario', idUsuario);
      }

      // 3. Activar / actualizar tabla del nuevo rol
      if (nuevoRol === 'profesor' && datos.id_carrera) {
        await sb.from('profesor').upsert(
          { id_usuario: idUsuario, id_carrera: datos.id_carrera, is_active: true },
          { onConflict: 'id_usuario' }
        );
      } else if (nuevoRol === 'encargado' && datos.id_carrera) {
        await sb.from('gestor_vinculacion_carrera').upsert(
          { id_usuario: idUsuario, id_carrera: datos.id_carrera, is_active: true },
          { onConflict: 'id_usuario' }
        );
      }

      // 4. Cerrar modal y recargar
      this.mostrarModalForm = false;
      await this.ngOnInit();

    } else if (!this.modoEdicion) {
      const sb = this.supabaseService.client;

      if (!datos.email || !datos.password) {
        console.error('Correo y contraseña son requeridos para crear un usuario.');
        return;
      }

      // Guardar sesión del admin antes de que signUp la reemplace
      const { data: { session: adminSession } } = await sb.auth.getSession();

      const { data: authData, error: signUpError } = await sb.auth.signUp({
        email:    datos.email,
        password: datos.password,
      });

      // Restaurar sesión del admin inmediatamente
      if (adminSession) {
        await sb.auth.setSession({
          access_token:  adminSession.access_token,
          refresh_token: adminSession.refresh_token,
        });
      }

      if (signUpError || !authData.user) {
        console.error('Error al crear usuario en auth:', signUpError);
        return;
      }

      const authUid = authData.user.id;

      // Confirmar email automáticamente para que RLS permita leer el usuario
      await sb.rpc('confirm_user_email', { user_auth_uid: authUid });

      // Crear fila en public.usuario
      const { data: nuevoUsuario, error: dbError } = await sb.from('usuario').insert({
        auth_uid:          authUid,
        rut_usuario:       datos.rut_usuario       ?? '',
        nombres_usuario:   datos.nombres_usuario   ?? '',
        apellidos_usuario: datos.apellidos_usuario ?? '',
        telefono_usuario:  datos.telefono_usuario  ?? '',
        id_rol:            datos.id_rol,
        is_active:         true,
        fecha_creacion:    new Date().toISOString(),
      }).select().single();

      if (dbError || !nuevoUsuario) {
        console.error('Error al crear usuario en BD:', dbError);
        return;
      }

      const idUsuario = nuevoUsuario.id_usuario;
      const rolNombre = this.todosLosRoles.find(r => r.id_rol === datos.id_rol)?.nombre_rol;

      if (rolNombre === 'encargado' && datos.id_carrera) {
        await sb.from('gestor_vinculacion_carrera').insert({
          id_usuario: idUsuario, id_carrera: datos.id_carrera, is_active: true,
        });
      } else if (rolNombre === 'profesor' && datos.id_carrera) {
        await sb.from('profesor').insert({
          id_usuario: idUsuario, id_carrera: datos.id_carrera, is_active: true,
        });
      } else if (rolNombre === 'autoridad') {
        await sb.from('autoridad').insert({
          id_usuario: idUsuario, cargo: datos.cargo ?? '', is_active: true,
        });
      }

      // Cerrar modal y recargar
      this.mostrarModalForm = false;
      await this.ngOnInit();
    }
  }

  /** Confirmación del ModalConfirmar */
  async onEliminarUsuario(): Promise<void> {
    if (this.usuarioAEliminar) {
      const id = this.usuarioAEliminar.id_usuario;
      await this.dataService.softDelete('usuario', id, 'id_usuario');
      this.usuarios.update(lista => lista.filter(u => u.id_usuario !== id));
      this.usuarioAEliminar    = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
