import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Facultad } from '../../../../interfaces/academico.interface';
import { ModalFacultadForm } from './modales/modal-facultad-form/modal-facultad-form';
import { ModalConfirmar } from '../../../shared/modal-confirmar/modal-confirmar';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-gestion-facultad',
  imports: [CommonModule, FormsModule, ModalFacultadForm, ModalConfirmar],
  templateUrl: './gestion-facultad.html',
  styleUrl: './gestion-facultad.css',
})
export class GestionFacultad implements OnInit {

  constructor(private dataService: DataService, private catalog: CatalogService) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    const [activasRes, inactivasRes] = await Promise.all([
      this.dataService.getAll<any>('facultad', { select: `*`, filters: { is_active: true } }),
      this.dataService.getAll<any>('facultad', { select: `*`, filters: { is_active: false } }),
    ]);
    if (activasRes.data)   this.facultades.set(activasRes.data);
    if (inactivasRes.data) this.facultadesInactivas.set(inactivasRes.data);
  }


  /* ─── Datos ────────────────────────────────────────────────── */
  facultades = signal<Facultad[]>([]);
  facultadesInactivas = signal<Facultad[]>([]);

  /* ─── Vista activas / inactivas + mensajes ─────────────────── */
  verInactivos = false;
  mensaje = '';

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

  /* ─── Fuente según vista (activas / inactivas) ─────────────── */
  private get fuente(): Facultad[] {
    return this.verInactivos ? this.facultadesInactivas() : this.facultades();
  }

  /* ─── Etiquetas únicas para el selector de filtro ─────────── */
  get etiquetasUnicas(): string[] {
    return [...new Set(this.fuente.map(f => f.etiqueta_facultad))].sort();
  }

  /* ─── Lista filtrada ───────────────────────────────────────── */
  get facultadesFiltradas(): Facultad[] {
    let lista = [...this.fuente];

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

  /* ─── Vista activas / inactivas ────────────────────────────── */
  cambiarVista(verInactivos: boolean): void {
    this.verInactivos = verInactivos;
    this.mensaje = '';
    this.limpiarFiltros();
  }

  async reactivar(facultad: Facultad): Promise<void> {
    const { error } = await this.dataService.update('facultad', facultad.id_facultad, { is_active: true }, 'id_facultad');
    if (!error) {
      this.facultadesInactivas.update(lista => lista.filter(f => f.id_facultad !== facultad.id_facultad));
      this.facultades.update(lista => [...lista, { ...facultad, is_active: true }]);
      this.catalog.invalidate();
    }
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

  async onGuardarFacultad(datos: Partial<Facultad>): Promise<void> {
    this.mensaje = '';

    if (this.modoEdicion && datos.id_facultad) {
      await this.dataService.update('facultad', datos.id_facultad, datos, 'id_facultad');
      this.mostrarModalForm = false;
      this.catalog.invalidate();
      await this.ngOnInit();
      return;
    }

    // Crear: si ya existe una facultad con el mismo nombre, reactivar en vez de duplicar/fallar
    const nombre = (datos.nombre_facultad ?? '').trim().toLowerCase();

    const activa = this.facultades().find(f => (f.nombre_facultad ?? '').trim().toLowerCase() === nombre);
    if (activa) {
      this.mostrarModalForm = false;
      this.mensaje = `Ya existe una facultad activa llamada "${activa.nombre_facultad}".`;
      return;
    }

    const inactiva = this.facultadesInactivas().find(f => (f.nombre_facultad ?? '').trim().toLowerCase() === nombre);
    if (inactiva) {
      await this.dataService.update('facultad', inactiva.id_facultad, { ...datos, is_active: true }, 'id_facultad');
      this.mensaje = `Se reactivó la facultad "${inactiva.nombre_facultad}" que estaba inactiva.`;
    } else {
      await this.dataService.create('facultad', datos);
    }

    this.mostrarModalForm = false;
    this.catalog.invalidate();
    await this.ngOnInit();
  }

  async onEliminarFacultad(): Promise<void> {
    if (this.facultadAEliminar) {
      const id = this.facultadAEliminar.id_facultad;
      const { error } = await this.dataService.softDelete('facultad', id, 'id_facultad');
      if (!error) {
        this.facultades.update(lista => lista.filter(f => f.id_facultad !== id));
        this.catalog.invalidate();
      }
      this.facultadAEliminar    = null;
      this.mostrarModalEliminar = false;
    }
  }

  cerrarModales(): void {
    this.mostrarModalForm     = false;
    this.mostrarModalEliminar = false;
  }
}
