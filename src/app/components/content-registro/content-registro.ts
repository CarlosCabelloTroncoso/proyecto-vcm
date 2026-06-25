import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-content-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './content-registro.html',
  styleUrl: './content-registro.css',
})
export class ContentRegistro {
  rut = '';
  telefono = '';
  nombres = '';
  apellidos = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private auth: AuthService,
    private data: DataService,
    private router: Router
  ) {}

  async onRegistro(): Promise<void> {
    this.errorMsg.set(null);
    this.successMsg.set(null);

    // Validaciones básicas
    if (!this.rut || !this.nombres || !this.apellidos || !this.email || !this.password) {
      this.errorMsg.set('Completa todos los campos obligatorios');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMsg.set('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 6) {
      this.errorMsg.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Limpiar RUT: quitar puntos y guion
    const rutLimpio = this.rut.replace(/\./g, '').replace(/-/g, '');

    this.isLoading.set(true);

    // 1. Registrar en Supabase Auth
    const { error: authError } = await this.auth.register(
      this.email,
      this.password,
      {
        rut: rutLimpio,
        nombres: this.nombres,
        apellidos: this.apellidos,
        telefono: this.telefono
      }
    );

    if (authError) {
      this.errorMsg.set(authError);
      this.isLoading.set(false);
      return;
    }

    this.successMsg.set('Cuenta creada. Te enviamos un correo de confirmación: ábrelo y haz clic en el enlace para activar tu cuenta. Después inicia sesión. Puedes cerrar esta pestaña.');
    this.isLoading.set(false);
  }
}
