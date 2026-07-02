import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoVoluntario, Carrera } from '../../../../interfaces/academico.interface';
import { ModalAlumnoForm } from '../../admin/gestion-alumno/modales/modal-alumno-form/modal-alumno-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-alumno',
  imports: [CommonModule, FormsModule, ModalAlumnoForm, ModalConfirmar],
  templateUrl: './alumno.html',
  styleUrl: './alumno.css',
})
export class Alumno implements OnInit {

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,
    private auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();

    const idCarrera = this.auth.usuario()?.gestor_vinculacion_carrera?.id_carrera;
    // El encargado solo gestiona su carrera: la lista (dropdown al crear alumno,
    // filtros y etiquetas) debe limitarse a esa carrera, no a todas.
    this.carreras = idCarrera
      ? this.catalog.carreras().filter(c => c.id_carrera === idCarrera)
      : this.catalog.carreras();

    const base: Record<string, any> = {};
    if (idCarrera) base['id_carrera'] = idCarrera;

    const [activosRes, inactivosRes] = await Promise.all([
      this.dataService.getAll<any>('alumno_voluntario', {
        select: `*, carrera(nombre_carrera, etiqueta_carrera)`,
        filters: { ...base, is_active: true },
      }),
      this.dataService.getAll<any>('alumno_voluntario', {
        select: `*, carrera(nombre_carrera, etiqueta_carrera)`,
        filters: { ...base, is_active: false },
      }),
    ]);
    if (activosRes.data)   this.alumnos.set(activosRes.data);
    if (inactivosRes.data) this.alumnosInactivos.set(inactivosRes.data);
  }


  /* ─── Carreras de referencia ───────────────────────────────── */
  carreras: Carrera[] = [];

  /* ─── Datos ────────────────────────────────────────────────── */
  alumnos = signal<AlumnoVoluntario[]>([]);
  alumnosInactivos = signal<AlumnoVoluntario[]>([]);

  /* ─── Vista activos / inactivos + mensajes ─────────────────── */
  verInactivos = false;
  mensaje = '';

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

  /* ─── Fuente según vista (activos / inactivos) ─────────────── */
  private get fuente(): AlumnoVoluntario[] {
    return this.verInactivos ? this.alumnosInactivos() : this.alumnos();
  }

  /* ─── Lista filtrada ───────────────────────────────────────── */
  get alumnosFiltrados(): AlumnoVoluntario[] {
    let lista = [...this.fuente];

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(a =>
        a.nombres_alumno.toLowerCase().includes(t)   ||
        a.apellidos_alumno.toLowerCase().includes(t) ||
        a.rut_alumno.toLowerCase().includes(t)       ||
        a.correo_alumno.toLowerCase().includes(t)    ||
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

  /* ─── Vista activos / inactivos ────────────────────────────── */
  cambiarVista(verInactivos: boolean): void {
    this.verInactivos = verInactivos;
    this.mensaje = '';
    this.limpiarFiltros();
  }

  async reactivar(alumno: AlumnoVoluntario): Promise<void> {
    const { error } = await this.dataService.update('alumno_voluntario', alumno.id_alumno, { is_active: true }, 'id_alumno');
    if (!error) {
      this.alumnosInactivos.update(lista => lista.filter(a => a.id_alumno !== alumno.id_alumno));
      this.alumnos.update(lista => [...lista, { ...alumno, is_active: true }]);
    }
  }

  /* ─── Acciones CRUD ────────────────────────────────────────── */
  abrirCrear(): void {
    const idCarrera = this.auth.usuario()?.gestor_vinculacion_carrera?.id_carrera ?? 1;
    this.modoEdicion     = false;
    this.alumnoEnEdicion = { id_carrera: idCarrera };
    this.mostrarModalForm = true;
  }

  abrirEditar(alumno: AlumnoVoluntario): void {
    this.modoEdicion      = true;
    this.alumnoEnEdicion  = { ...alumno };
    this.mostrarModalForm = true;
  }

  abrirEliminar(alumno: AlumnoVoluntario): void {
    this.alumnoAEliminar      = alumno;
    this.mostrarModalEliminar = true;
  }

  async onGuardarAlumno(datos: Partial<AlumnoVoluntario>): Promise<void> {
    this.mensaje = '';

    if (this.modoEdicion && datos.id_alumno) {
      // Quitar el join `carrera` y la PK: no son columnas de la tabla y hacen
      // que Supabase rechace el UPDATE (por eso no se guardaban los cambios).
      const { id_alumno, carrera, ...cambios } = datos as any;
      const { error } = await this.dataService.update('alumno_voluntario', id_alumno, cambios, 'id_alumno');
      if (error) {
        console.error('[alumno] error al editar:', error);
        this.mensaje = 'No se pudieron guardar los cambios del alumno.';
        return;
      }
      this.mostrarModalForm = false;
      await this.ngOnInit();
      return;
    }

    // Crear: si ya existe un alumno con el mismo RUT, reactivar en vez de fallar por RUT duplicado
    const rut = (datos.rut_alumno ?? '').trim().toLowerCase();

    const activo = this.alumnos().find(a => (a.rut_alumno ?? '').trim().toLowerCase() === rut);
    if (activo) {
      this.mostrarModalForm = false;
      this.mensaje = `Ya existe un alumno activo con el RUT ${activo.rut_alumno}.`;
      return;
    }

    const inactivo = this.alumnosInactivos().find(a => (a.rut_alumno ?? '').trim().toLowerCase() === rut);
    if (inactivo) {
      await this.dataService.update('alumno_voluntario', inactivo.id_alumno, { ...datos, is_active: true }, 'id_alumno');
      this.mensaje = `Se reactivó el alumno con RUT ${inactivo.rut_alumno} que estaba inactivo.`;
    } else {
      await this.dataService.create('alumno_voluntario', datos);
    }

    this.mostrarModalForm = false;
    await this.ngOnInit();
  }

  async onEliminarAlumno(): Promise<void> {
    if (this.alumnoAEliminar) {
      const id = this.alumnoAEliminar.id_alumno;
      await this.dataService.softDelete('alumno_voluntario', id, 'id_alumno');
      this.alumnos.update(lista => lista.filter(a => a.id_alumno !== id));
      this.alumnoAEliminar      = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
