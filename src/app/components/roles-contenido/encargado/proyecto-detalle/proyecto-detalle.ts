import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface AlumnoVista {
  id: number;
  rut: string;
  nombre: string;
}

interface ObservacionVista {
  id: number;
  fecha: string;
  detalle: string;
}

interface ProyectoDetalleData {
  id: number;
  titulo: string;
  planteamiento_origen: string;
  solicitud_origen: string;
  tiempo_estimado: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  estado: string;
  alumnos: AlumnoVista[];
  observaciones: ObservacionVista[];
}

@Component({
  selector: 'app-proyecto-detalle-encargado',
  imports: [CommonModule],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.css',
})
export class ProyectoDetalleEncargado implements OnInit {

  proyecto: ProyectoDetalleData | null = null;

  private readonly proyectosMock: ProyectoDetalleData[] = [
    {
      id: 1,
      titulo: 'Sistema de gestión de voluntarios',
      planteamiento_origen: 'Sistema de gestión de voluntarios',
      solicitud_origen: 'App móvil para servicios comunitarios',
      tiempo_estimado: '4 meses',
      estado: 'disponible',
      alumnos: [],
      observaciones: [],
    },
    {
      id: 2,
      titulo: 'Dashboard de transparencia ciudadana',
      planteamiento_origen: 'Dashboard de transparencia',
      solicitud_origen: 'Portal de transparencia ciudadana',
      tiempo_estimado: '3 meses',
      estado: 'disponible',
      alumnos: [],
      observaciones: [],
    },
    {
      id: 3,
      titulo: 'Portal de trámites digitales Talca',
      planteamiento_origen: 'Portal de trámites online',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '6 meses',
      fecha_inicio: '2025-03-01',
      estado: 'en_proceso',
      alumnos: [
        { id: 1, rut: '20.123.456-7', nombre: 'Martina González López' },
        { id: 2, rut: '20.234.567-8', nombre: 'Diego Muñoz Carrasco'   },
      ],
      observaciones: [
        { id: 1, fecha: '2025-03-15', detalle: 'Se completó el módulo de autenticación.' },
        { id: 2, fecha: '2025-04-02', detalle: 'Integración con la API municipal en proceso.' },
      ],
    },
    {
      id: 4,
      titulo: 'Sistema de agenda comunitaria',
      planteamiento_origen: 'Agenda digital comunitaria',
      solicitud_origen: 'App móvil para servicios comunitarios',
      tiempo_estimado: '4 meses',
      fecha_inicio: '2025-01-10',
      estado: 'pausado',
      alumnos: [
        { id: 3, rut: '19.876.543-2', nombre: 'Sofía Reyes Bustamante' },
      ],
      observaciones: [
        { id: 1, fecha: '2025-01-20', detalle: 'Inicio del proyecto. Reunión de kick-off realizada.' },
        { id: 2, fecha: '2025-02-14', detalle: 'Proyecto pausado por disponibilidad del cliente.' },
      ],
    },
    {
      id: 5,
      titulo: 'Plataforma de reportes municipales',
      planteamiento_origen: 'Sistema de reportes automáticos',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '5 meses',
      fecha_inicio: '2024-09-15',
      fecha_termino: '2025-01-10',
      estado: 'cancelado',
      alumnos: [],
      observaciones: [
        { id: 1, fecha: '2024-09-20', detalle: 'Proyecto iniciado. Análisis de requerimientos.' },
        { id: 2, fecha: '2024-11-30', detalle: 'Proyecto cancelado por decisión del cliente.' },
      ],
    },
    {
      id: 6,
      titulo: 'Módulo de pagos en línea UCM',
      planteamiento_origen: 'Pasarela de pagos institucional',
      solicitud_origen: 'Portal de transparencia ciudadana',
      tiempo_estimado: '3 meses',
      fecha_inicio: '2024-06-01',
      fecha_termino: '2024-09-05',
      estado: 'finalizado',
      alumnos: [
        { id: 6, rut: '19.234.567-1', nombre: 'Matías Herrera Ojeda' },
      ],
      observaciones: [
        { id: 1, fecha: '2024-06-15', detalle: 'Configuración del entorno de desarrollo completada.' },
        { id: 2, fecha: '2024-07-10', detalle: 'Módulo de pago integrado con Webpay.' },
        { id: 3, fecha: '2024-09-05', detalle: 'Proyecto finalizado y entregado al cliente.' },
      ],
    },
    {
      id: 7,
      titulo: 'App de seguimiento de solicitudes',
      planteamiento_origen: 'Seguimiento en tiempo real',
      solicitud_origen: 'Digitalización de trámites municipales Talca',
      tiempo_estimado: '2 meses',
      fecha_inicio: '2025-02-01',
      estado: 'atrasado',
      alumnos: [
        { id: 4, rut: '21.345.678-9', nombre: 'Tomás Vargas Mora'     },
        { id: 5, rut: '20.456.789-K', nombre: 'Valentina Castro Pino' },
      ],
      observaciones: [
        { id: 1, fecha: '2025-02-10', detalle: 'Primera entrega parcial realizada.' },
        { id: 2, fecha: '2025-03-05', detalle: 'Retraso por cambios en requerimientos del cliente.' },
        { id: 3, fecha: '2025-03-20', detalle: 'Se retomaron las tareas pendientes del sprint 2.' },
      ],
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.proyecto = this.proyectosMock.find(p => p.id === id) ?? null;
  }

  volver(): void {
    this.router.navigate(['/encargado/gestion-proyecto']);
  }

  getBadgeEstado(estado: string): string {
    const mapa: Record<string, string> = {
      disponible: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      en_proceso: 'bg-blue-100 text-blue-700 border-blue-200',
      pausado:    'bg-amber-100 text-amber-700 border-amber-200',
      atrasado:   'bg-orange-100 text-orange-600 border-orange-200',
      finalizado: 'bg-teal-100 text-teal-700 border-teal-200',
      cancelado:  'bg-red-100 text-red-500 border-red-200',
    };
    return mapa[estado] ?? 'bg-gray-100 text-gray-500 border-gray-200';
  }

  getNombreEstado(estado: string): string {
    const mapa: Record<string, string> = {
      disponible: 'Disponible',
      en_proceso: 'En proceso',
      pausado:    'Pausado',
      atrasado:   'Atrasado',
      finalizado: 'Finalizado',
      cancelado:  'Cancelado',
    };
    return mapa[estado] ?? '—';
  }
}
