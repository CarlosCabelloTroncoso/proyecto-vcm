import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDetalleSolicitud } from '../../../shared/modal-detalle-solicitud/modal-detalle-solicitud';
import { ModalConfirmarAccion } from '../../../shared/modal-confirmar-accion/modal-confirmar-accion';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Usuario, EncargadoCarrera } from '../../../../interfaces/usuario.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

@Component({
  selector: 'app-ver-solicitudes',
  imports: [CommonModule, FormsModule, ModalDetalleSolicitud, ModalConfirmarAccion],
  templateUrl: './ver-solicitudes.html',
  styleUrl: './ver-solicitudes.css',
})
export class VerSolicitudes implements OnInit {

  constructor(private dataService: DataService, private catalog: CatalogService) {}

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estados = this.catalog.estados;
    this.carreras = this.catalog.carreras;
    this.ciudades = this.catalog.ciudades;
    const solicitudesRes = await this.dataService.getAll<any>('solicitud', { select: `*, estado_solicitud(nombre_estado), usuario(nombres_usuario, apellidos_usuario, rut_usuario), carrera(nombre_carrera, etiqueta_carrera), ciudad(nombre_ciudad)`, filters: { is_active: true } });
    if (solicitudesRes.data) this.solicitudes = solicitudesRes.data;
  }


  /* ─── Sesión mock: encargado de ICI ────────────────────────── */
  // Carrera del gestor se obtiene via RLS (Supabase filtra automáticamente)

  /* ─── Catálogos ────────────────────────────────────────────── */
  estados: EstadoSolicitud[] = [];

  carreras: Carrera[] = [];

  ciudades: Ciudad[] = [];

    /* Los datos de clientes vienen en el join de solicitud.usuario */

  /* ─── Solicitudes de la carrera del encargado ───────────────── */
  solicitudes: Solicitud[] = [];

    archivos: any[] = [];

  /* ─── Filtro activo y búsqueda ──────────────────────────────── */
  filtroActivo: 'pendiente' | 'aprobada' | 'rechazada' = 'pendiente';
  searchTerm = '';

  /* ─── Estado modales ────────────────────────────────────────── */
  mostrarModalDetalle   = false;
  mostrarModalAprobar   = false;
  mostrarModalRechazar  = false;
  solicitudSeleccionada: Solicitud | null = null;
  solicitudAccion:       Solicitud | null = null;

  /* ─── Lista filtrada ────────────────────────────────────────── */
  get solicitudesFiltradas(): Solicitud[] {
    const estadoId = { pendiente: 1, aprobada: 3, rechazada: 4 }[this.filtroActivo];

    let lista = this.solicitudes.filter(
      s => s.id_estado === estadoId
    );

    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(s =>
        s.titulo_solicitud.toLowerCase().includes(t) ||
        this.getNombreCliente(s.id_usuario).toLowerCase().includes(t)
      );
    }

    return lista;
  }

  get contadorPorEstado(): Record<string, number> {
    const base = [...this.solicitudes];
    return {
      pendiente: base.filter(s => s.id_estado === 1).length,
      aprobada:  base.filter(s => s.id_estado === 3).length,
      rechazada: base.filter(s => s.id_estado === 4).length,
    };
  }

  /* ─── Helpers ───────────────────────────────────────────────── */
  getNombreCliente(id: number): string {
    // Nombre viene del join solicitud.usuario
    const sol = this.solicitudes.find((s: any) => s.id_usuario === id);
    return sol?.usuario ? `${sol.usuario.nombres_usuario} ${sol.usuario.apellidos_usuario}` : `Usuario ${id}`;
  }

  getNombreEstado(id: number): string {
    return this.estados.find(e => e.id_estado === id)?.nombre_estado ?? '—';
  }

  getNombreCarrera(id: number): string {
    return this.carreras.find(c => c.id_carrera === id)?.nombre_carrera ?? '—';
  }

  getEtiquetaCarrera(id: number): string {
    return this.carreras.find(c => c.id_carrera === id)?.etiqueta_carrera ?? '—';
  }

  getNombreCiudad(id: number | null | undefined): string {
    if (!id) return "—";
    return this.ciudades.find(c => c.id_ciudad === id)?.nombre_ciudad ?? '—';
  }

  getArchivosDeSolicitud(id: number): Archivo[] {
    return this.archivos.filter(a => a.id_solicitud === id);
  }

  getBadgeEstado(id: number): string {
    const mapa: Record<number, string> = {
      1: 'bg-amber-100   text-amber-700   border-amber-200',
      2: 'bg-sky-100     text-sky-700     border-sky-200',
      3: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      4: 'bg-red-100     text-red-700     border-red-200',
      5: 'bg-gray-100    text-gray-600    border-gray-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Acciones modal detalle ────────────────────────────────── */
  abrirDetalle(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalDetalle   = true;
  }

  cerrarDetalle(): void {
    this.mostrarModalDetalle   = false;
    this.solicitudSeleccionada = null;
  }

  /* ─── Acciones aprobar / rechazar ───────────────────────────── */
  abrirAprobar(solicitud: Solicitud): void {
    this.solicitudAccion     = solicitud;
    this.mostrarModalAprobar = true;
  }

  abrirRechazar(solicitud: Solicitud): void {
    this.solicitudAccion      = solicitud;
    this.mostrarModalRechazar = true;
  }

  confirmarAprobar(): void {
    if (this.solicitudAccion) {
      const idx = this.solicitudes.findIndex(s => s.id_solicitud === this.solicitudAccion!.id_solicitud);
      if (idx !== -1) this.solicitudes[idx] = { ...this.solicitudes[idx], id_estado: 3 };
    }
    this.mostrarModalAprobar = false;
    this.solicitudAccion     = null;
  }

  confirmarRechazar(): void {
    if (this.solicitudAccion) {
      const idx = this.solicitudes.findIndex(s => s.id_solicitud === this.solicitudAccion!.id_solicitud);
      if (idx !== -1) this.solicitudes[idx] = { ...this.solicitudes[idx], id_estado: 4 };
    }
    this.mostrarModalRechazar = false;
    this.solicitudAccion      = null;
  }

  cancelarAccion(): void {
    this.mostrarModalAprobar  = false;
    this.mostrarModalRechazar = false;
    this.solicitudAccion      = null;
  }
}
