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
  fechaDisplay: string;
  esNuevo: boolean;
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

  private idPendiente = signal(1);
  private idEnProceso = signal(0);
  private idAprobada  = signal(2);
  private idRechazada = signal(3);
  private idCerrada   = signal(0);

  get aprobadaId()  { return this.idAprobada();  }
  get rechazadaId() { return this.idRechazada(); }
  get enProcesoId() { return this.idEnProceso(); }
  get cerradaId()   { return this.idCerrada();   }

  pendientes = computed(() => this.solicitudes().filter(s => s.id_estado === this.idPendiente()).length);
  enProceso  = computed(() => this.solicitudes().filter(s => s.id_estado === this.idEnProceso()).length);
  aprobadas  = computed(() => this.solicitudes().filter(s => s.id_estado === this.idAprobada()).length);
  rechazadas = computed(() => this.solicitudes().filter(s => s.id_estado === this.idRechazada()).length);
  cerradas   = computed(() => this.solicitudes().filter(s => s.id_estado === this.idCerrada()).length);

  actividad = computed<EntradaActividad[]>(() =>
    [...this.solicitudes()]
      .sort((a, b) => {
        const fechaA = a.fecha_actualizacion ?? a.fecha_creacion_solicitud;
        const fechaB = b.fecha_actualizacion ?? b.fecha_creacion_solicitud;
        const diff = new Date(fechaB).getTime() - new Date(fechaA).getTime();
        return diff !== 0 ? diff : b.id_solicitud - a.id_solicitud;
      })
      .map(s => ({
        titulo:       s.titulo_solicitud,
        mensaje:      this.mensajePorEstado(s.id_estado, s.titulo_solicitud),
        estado:       s.id_estado,
        fechaDisplay: this.buildFechaDisplay(s),
        esNuevo:      this.esReciente(s.fecha_actualizacion),
      }))
  );

  private mensajePorEstado(estado: number, titulo: string): string {
    if (estado === this.idAprobada())  return `Tu solicitud "${titulo}" fue aprobada`;
    if (estado === this.idRechazada()) return `Tu solicitud "${titulo}" fue rechazada`;
    if (estado === this.idEnProceso()) return `Tu solicitud "${titulo}" está en proceso`;
    if (estado === this.idCerrada())   return `Tu solicitud "${titulo}" fue cerrada`;
    return `Tu solicitud "${titulo}" está pendiente de revisión`;
  }

  private buildFechaDisplay(s: Solicitud): string {
    if (s.fecha_actualizacion) {
      return `Actualizado el ${this.formatFecha(s.fecha_actualizacion)}`;
    }
    return this.formatFecha(s.fecha_creacion_solicitud);
  }

  private formatFecha(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('es-CL', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  private esReciente(fecha?: string | null): boolean {
    if (!fecha) return false;
    const diff = Date.now() - new Date(fecha).getTime();
    return diff < 24 * 60 * 60 * 1000; // últimas 24 horas
  }

  async ngOnInit(): Promise<void> {
    const idUsuario = this.auth.usuario()?.id_usuario;
    if (!idUsuario) return;

    await this.catalog.load();

    const estados = this.catalog.estados();
    const find = (regex: RegExp) => estados.find(e => regex.test(e.nombre_estado))?.id_estado ?? 0;

    this.idPendiente.set(find(/pendiente/i) || 1);
    this.idEnProceso.set(find(/proceso/i)   || 0);
    this.idAprobada.set(find(/aprobad/i)    || 2);
    this.idRechazada.set(find(/rechazad/i)  || 3);
    this.idCerrada.set(find(/cerrad/i)      || 4);

    const res = await this.data.getAll<Solicitud>('solicitud', {
      select:  'id_solicitud, id_estado, titulo_solicitud, fecha_creacion_solicitud, fecha_actualizacion',
      filters: { id_usuario: idUsuario, is_active: true },
    });

    if (res.data) {
      this.solicitudes.set(res.data);
      this.cdr.detectChanges();
    }
  }
}
