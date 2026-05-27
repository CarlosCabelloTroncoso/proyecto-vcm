import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Solicitud, Ciudad } from '../../../../interfaces/solicitud.interface';
import { Carrera } from '../../../../interfaces/academico.interface';

@Component({
  selector: 'app-crear-solicitud',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-solicitud.html',
  styleUrl: './crear-solicitud.css',
})
export class CrearSolicitud implements OnInit {

  /* ─── Modo del formulario ──────────────────────────────────── */
  modo: 'crear' | 'editar' = 'crear';
  solicitudOriginal: Solicitud | null = null;

  /* ─── Datos de referencia ──────────────────────────────────── */
  carreras: Carrera[] = [
    { id_carrera: 1,  nombre_carrera: 'Ingeniería Civil Informática', etiqueta_carrera: 'ICI',  id_facultad: 1 },
    { id_carrera: 2,  nombre_carrera: 'Ingeniería Civil Industrial',  etiqueta_carrera: 'ICIV', id_facultad: 1 },
    { id_carrera: 3,  nombre_carrera: 'Ingeniería Civil Biomédica',   etiqueta_carrera: 'ICBM', id_facultad: 1 },
    { id_carrera: 4,  nombre_carrera: 'Enfermería',                   etiqueta_carrera: 'ENF',  id_facultad: 2 },
    { id_carrera: 5,  nombre_carrera: 'Kinesiología',                 etiqueta_carrera: 'KIN',  id_facultad: 2 },
    { id_carrera: 6,  nombre_carrera: 'Derecho',                      etiqueta_carrera: 'DER',  id_facultad: 3 },
    { id_carrera: 7,  nombre_carrera: 'Administración de Empresas',   etiqueta_carrera: 'ADM',  id_facultad: 4 },
    { id_carrera: 8,  nombre_carrera: 'Contador Auditor',             etiqueta_carrera: 'CA',   id_facultad: 4 },
    { id_carrera: 9,  nombre_carrera: 'Pedagogía en Matemáticas',     etiqueta_carrera: 'PEM',  id_facultad: 5 },
    { id_carrera: 10, nombre_carrera: 'Bioquímica',                   etiqueta_carrera: 'BQM',  id_facultad: 6 },
  ];

  ciudades: Ciudad[] = [
    { id_ciudad: 1, nombre_ciudad: 'Talca'      },
    { id_ciudad: 2, nombre_ciudad: 'Santiago'   },
    { id_ciudad: 3, nombre_ciudad: 'Concepción' },
    { id_ciudad: 4, nombre_ciudad: 'Rancagua'   },
    { id_ciudad: 5, nombre_ciudad: 'Curicó'     },
  ];

  /* ─── Formulario ───────────────────────────────────────────── */
  form: Partial<Solicitud> = {
    titulo_solicitud:       '',
    descripcion_solicitud:  '',
    id_carrera:             undefined,
    id_ciudad:              undefined,
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;
    if (state?.modo === 'editar' && state?.solicitud) {
      this.modo             = 'editar';
      this.solicitudOriginal = state.solicitud;
      this.form = {
        titulo_solicitud:      state.solicitud.titulo_solicitud,
        descripcion_solicitud: state.solicitud.descripcion_solicitud,
        id_carrera:            state.solicitud.id_carrera,
        id_ciudad:             state.solicitud.id_ciudad,
      };
    }
  }

  /* ─── Submit ───────────────────────────────────────────────── */
  onSubmit(): void {
    if (!this.form.titulo_solicitud?.trim()
      || !this.form.descripcion_solicitud?.trim()
      || !this.form.id_carrera
      || !this.form.id_ciudad) {
      return;
    }

    if (this.modo === 'crear') {
      const nueva: Solicitud = {
        id_solicitud:           Date.now(),
        titulo_solicitud:       this.form.titulo_solicitud!.trim(),
        descripcion_solicitud:  this.form.descripcion_solicitud!.trim(),
        fecha_creacion_solicitud: new Date().toISOString().split('T')[0],
        id_estado:              1,   // Pendiente
        id_usuario:             1,   // Mock: usuario activo
        id_carrera:             +this.form.id_carrera!,
        id_ciudad:              +this.form.id_ciudad!,
      };

      this.router.navigate(['/cliente/mis-solicitudes'], {
        state: { nuevaSolicitud: nueva }
      });

    } else {
      const actualizada: Solicitud = {
        ...this.solicitudOriginal!,
        titulo_solicitud:      this.form.titulo_solicitud!.trim(),
        descripcion_solicitud: this.form.descripcion_solicitud!.trim(),
        id_carrera:            +this.form.id_carrera!,
        id_ciudad:             +this.form.id_ciudad!,
      };

      this.router.navigate(['/cliente/mis-solicitudes'], {
        state: { solicitudEditada: actualizada }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/cliente/mis-solicitudes']);
  }

  /* ─── Helpers ──────────────────────────────────────────────── */
  get formularioValido(): boolean {
    return !!(
      this.form.titulo_solicitud?.trim() &&
      this.form.descripcion_solicitud?.trim() &&
      this.form.id_carrera &&
      this.form.id_ciudad
    );
  }
}
