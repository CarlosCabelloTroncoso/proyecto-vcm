import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recuperar-contrasena.html',
  styleUrl: './recuperar-contrasena.css',
})
export class RecuperarContrasena {
  email = '';
  errorMsg   = signal<string | null>(null);
  successMsg = signal<string | null>(null);
  isLoading  = signal(false);

  constructor(private auth: AuthService) {}

  async onEnviar(): Promise<void> {
    this.errorMsg.set(null);
    this.successMsg.set(null);

    if (!this.email.trim()) {
      this.errorMsg.set('Ingresa tu correo electrónico');
      return;
    }

    this.isLoading.set(true);
    const { error } = await this.auth.resetPassword(this.email.trim());
    this.isLoading.set(false);

    // No revelamos si el correo existe o no (buena práctica de seguridad).
    if (error) {
      this.errorMsg.set('No pudimos enviar el correo. Intenta nuevamente.');
      return;
    }

    this.successMsg.set('Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.');
  }
}
