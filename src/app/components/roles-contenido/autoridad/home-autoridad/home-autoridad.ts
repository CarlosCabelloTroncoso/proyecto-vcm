import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { CatalogService } from '../../../../core/services/catalog.service';

interface EntradaActividad {
  mensaje: string;
  colorIcono: 'verde' | 'rojo' | 'ambar';
  fechaDisplay: string;
  esNuevo: boolean;
  fechaOrden: string;
}

@Component({
  selector: 'app-home-autoridad',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-autoridad.html',
  styleUrl: './home-autoridad.css',
})
export class HomeAutoridad implements OnInit {
  private auth    = inject(AuthService);
  private data    = inject(DataService);
  private catalog = inject(CatalogService);
  private cdr     = inject(ChangeDetectorRef);

  nombre = computed(() => this.auth.usuario()?.nombres_usuario ?? 'Autoridad');

  private solicitudes = signal<any[]>([]);

  // Ids de estado_solicitud (verificados en BD): 1 Pendiente, 2 Aprobada,
  // 3 Rechazada, 4 En Proceso, 5 Cerrada. Se usan directos para que cada
  // computed siempre lea this.solicitudes() y se actualice al cargar los datos.
  solicitudesPendientes = computed(() => this.solicitudes().filter(s => s.id_estado === 1).length);
  solicitudesAprobadas  = computed(() => this.solicitudes().filter(s => s.id_estado === 2).length);
  solicitudesRechazadas = computed(() => this.solicitudes().filter(s => s.id_estado === 3).length);
  solicitudesEnProceso  = computed(() => this.solicitudes().filter(s => s.id_estado === 4).length);
  solicitudesCerradas   = computed(() => this.solicitudes().filter(s => s.id_estado === 5).length);

  actividad = computed<EntradaActividad[]>(() =>
    this.solicitudes().map(s => {
      const nombreEstado = s.estado_solicitud?.nombre_estado ?? '';
      return {
        mensaje:      this.mensajeSolicitud(s.id_estado, s.titulo_solicitud, nombreEstado),
        colorIcono:   nombreEstado === 'Cerrada' || s.id_estado === 2
          ? 'verde' as const
          : s.id_estado === 3
          ? 'rojo'  as const
          : 'ambar' as const,
        fechaDisplay: s.fecha_actualizacion
          ? `Actualizado el ${this.formatFechaISO(s.fecha_actualizacion)}`
          : this.formatFechaDate(s.fecha_creacion_solicitud),
        esNuevo:      this.esReciente(s.fecha_actualizacion ?? s.fecha_creacion_solicitud),
        fechaOrden:   s.fecha_actualizacion ?? s.fecha_creacion_solicitud ?? '',
      };
    }).sort((a, b) =>
      a.fechaOrden && b.fechaOrden
        ? new Date(b.fechaOrden).getTime() - new Date(a.fechaOrden).getTime()
        : b.fechaOrden ? 1 : -1
    )
  );

  private mensajeSolicitud(estado: number, titulo: string, nombreEstado = ''): string {
    if (nombreEstado === 'Cerrada')    return `Solicitud "${titulo}" fue cerrada`;
    if (nombreEstado === 'En proceso') return `Solicitud "${titulo}" está en proceso`;
    switch (estado) {
      case 2:  return `Solicitud "${titulo}" fue aprobada`;
      case 3:  return `Solicitud "${titulo}" fue rechazada`;
      default: return `Nueva solicitud "${titulo}" pendiente de revisión`;
    }
  }

  private formatFechaISO(iso: string): string {
    return new Date(iso).toLocaleString('es-CL', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  private formatFechaDate(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${d} ${meses[+m - 1]} ${y}`;
  }

  private esReciente(fecha?: string | null): boolean {
    if (!fecha) return false;
    return Date.now() - new Date(fecha).getTime() < 24 * 60 * 60 * 1000;
  }

  async ngOnInit(): Promise<void> {
    await this.catalog.load();

    const solRes = await this.data.getAll<any>('solicitud', {
      select:  'id_solicitud, titulo_solicitud, id_estado, fecha_creacion_solicitud, fecha_actualizacion, estado_solicitud(nombre_estado)',
      filters: { is_active: true },
    });
    if (solRes.data) this.solicitudes.set(solRes.data);
    this.cdr.detectChanges();
  }
}
