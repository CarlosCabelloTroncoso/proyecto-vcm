import { Component, inject, computed, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { Solicitud } from '../../../../interfaces/solicitud.interface';

interface EntradaActividad {
  titulo: string;
  mensaje: string;
  estado: number;
  fecha: string;
}

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css',
})
export class HomeCliente implements OnInit {
  private auth    = inject(AuthService);
  private data    = inject(DataService);
  private catalog = inject(CatalogService);
  private cdr     = inject(ChangeDetectorRef);

  nombre = computed(() => this.auth.usuario()?.nombres_usuario ?? 'Usuario');

  private solicitudes = signal<Solicitud[]>([]);

  // IDs resueltos desde el catálogo (defaults seguros mientras carga)
  private idPendiente  = signal(1);
  private idEnProceso  = signal(0);
  private idAprobada   = signal(2);
  private idRechazada  = signal(3);

  // Expuestos al template para los iconos de actividad
  get aprobadaId()  { return this.idAprobada();  }
  get rechazadaId() { return this.idRechazada(); }
  get enProcesoId() { return this.idEnProceso(); }

  pendientes = computed(() => this.solicitudes().filter(s => s.id_estado === this.idPendiente()).length);
  enProceso  = computed(() => this.solicitudes().filter(s => s.id_estado === this.idEnProceso()).length);
  aprobadas  = computed(() => this.solicitudes().filter(s => s.id_estado === this.idAprobada()).length);
  rechazadas = computed(() => this.solicitudes().filter(s => s.id_estado === this.idRechazada()).length);

  actividad = computed<EntradaActividad[]>(() =>
    [...this.solicitudes()]
      .sort((a, b) => new Date(b.fecha_creacion_solicitud).getTime() - new Date(a.fecha_creacion_solicitud).getTime())
      .map(s => ({
        titulo: s.titulo_solicitud,
        mensaje: this.mensajePorEstado(s.id_estado, s.titulo_solicitud),
        estado: s.id_estado,
        fecha: this.formatFecha(s.fecha_creacion_solicitud),
      }))
  );

  private mensajePorEstado(estado: number, titulo: string): string {
    if (estado === this.idAprobada())   return `Tu solicitud "${titulo}" fue aprobada`;
    if (estado === this.idRechazada())  return `Tu solicitud "${titulo}" fue rechazada`;
    if (estado === this.idEnProceso())  return `Tu solicitud "${titulo}" está en proceso`;
    return `Tu solicitud "${titulo}" está pendiente de revisión`;
  }

  private formatFecha(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  async ngOnInit(): Promise<void> {
    const idUsuario = this.auth.usuario()?.id_usuario;
    if (!idUsuario) return;

    await this.catalog.load();

    const estados = this.catalog.estados();
    const find = (regex: RegExp) => estados.find(e => regex.test(e.nombre_estado))?.id_estado ?? 0;

    this.idPendiente.set(find(/pendiente/i)  || 1);
    this.idEnProceso.set(find(/proceso/i)    || 0);
    this.idAprobada.set(find(/aprobad/i)     || 2);
    this.idRechazada.set(find(/rechazad/i)   || 3);

    const res = await this.data.getAll<Solicitud>('solicitud', {
      select: 'id_solicitud, id_estado, titulo_solicitud, fecha_creacion_solicitud',
      filters: { id_usuario: idUsuario, is_active: true },
    });

    if (res.data) {
      this.solicitudes.set(res.data);
      this.cdr.detectChanges();
    }
  }
}
