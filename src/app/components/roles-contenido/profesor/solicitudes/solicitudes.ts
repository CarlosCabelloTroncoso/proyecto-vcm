import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDetalleSolicitud } from '../../../shared/modal-detalle-solicitud/modal-detalle-solicitud';
import { Solicitud, EstadoSolicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';
import { Usuario, ProfesorCarrera } from '../../../../interfaces/usuario.interface';
import { Archivo } from '../../../../interfaces/proyecto.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';
@Component({
  selector: 'app-solicitudes',
  imports: [CommonModule, FormsModule, ModalDetalleSolicitud],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes implements OnInit {

  constructor(
    private dataService: DataService,
    private catalog: CatalogService,private router: Router) {}

  /* ─── Sesión mock: profesor asignado a ICI ─────────────────── */
  // Carrera del profesor filtrada via RLS

  /* ─── Catálogos ────────────────────────────────────────────── */
  estados: EstadoSolicitud[] = [];

  carreras: Carrera[] = [];

  ciudades: Ciudad[] = [];

  /* ─── Clientes mock ─────────────────────────────────────────── */
  clientes: Pick<Usuario, 'id_usuario' | 'nombres_usuario' | 'apellidos_usuario'>[] = [
    { id_usuario: 1, nombres_usuario: 'María',   apellidos_usuario: 'González López'  },
    { id_usuario: 2, nombres_usuario: 'Carlos',  apellidos_usuario: 'Ramírez Fuentes' },
    { id_usuario: 3, nombres_usuario: 'Ana',     apellidos_usuario: 'Muñoz Vera'      },
    { id_usuario: 4, nombres_usuario: 'Jorge',   apellidos_usuario: 'Soto Parra'      },
    { id_usuario: 5, nombres_usuario: 'Roberto', apellidos_usuario: 'Figueroa Díaz'   },
    { id_usuario: 6, nombres_usuario: 'Daniela', apellidos_usuario: 'Tapia Rojas'     },
  ];

  /* ─── Solicitudes aprobadas de la carrera del profesor ──────── */
  solicitudes = signal<Solicitud[]>([]);

  /* ─── Archivos adjuntos mock ────────────────────────────────── */
  archivos: Archivo[] = [];

  /* ─── Búsqueda ──────────────────────────────────────────────── */
  searchTerm = '';

  /* ─── Modal ─────────────────────────────────────────────────── */
  mostrarModalDetalle   = false;
  solicitudSeleccionada: Solicitud | null = null;

  /* ─── Lista filtrada (solo aprobadas de su carrera) ─────────── */
  get solicitudesFiltradas(): Solicitud[] {
    let lista = this.solicitudes().filter(
      s => s.id_estado === 2
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

  async ngOnInit(): Promise<void> {
    await this.catalog.load();
    this.estados = this.catalog.estados();
    this.carreras = this.catalog.carreras();
    this.ciudades = this.catalog.ciudades();
    const solicitudesRes = await this.dataService.getAll<any>('solicitud', { select: `*, estado_solicitud(nombre_estado), usuario(nombres_usuario, apellidos_usuario, rut_usuario), carrera(nombre_carrera, etiqueta_carrera), ciudad(nombre_ciudad)`, filters: { is_active: true } });
    if (solicitudesRes.data) this.solicitudes.set(solicitudesRes.data);
  }

  /* ─── Helpers ───────────────────────────────────────────────── */
  getNombreCliente(id: number): string {
    const u = this.clientes.find(c => c.id_usuario === id);
    return u ? `${u.nombres_usuario} ${u.apellidos_usuario}` : '—';
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
      2: 'bg-green-100 text-green-700 border-green-200',
      3: 'bg-red-100   text-red-700   border-red-200',
      4: 'bg-sky-100   text-sky-700   border-sky-200',
    };
    return mapa[id] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ─── Acciones ──────────────────────────────────────────────── */
  abrirDetalle(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalDetalle   = true;
  }

  cerrarModal(): void {
    this.mostrarModalDetalle  = false;
    this.solicitudSeleccionada = null;
  }

  realizarPlanteamiento(solicitud: Solicitud): void {
    this.router.navigate(['/profesor/planteamientos'], {
      queryParams: { solicitudId: solicitud.id_solicitud },
    });
  }
}
