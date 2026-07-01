import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-content-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './content-login.html',
  styleUrl: './content-login.css',
})
export class ContentLogin implements OnInit {
  email = '';
  password = '';
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);
  isLoading = signal(false);

  // Reactivación de cuenta desactivada
  mostrarReactivar = signal(false);
  reactivarEmail   = '';
  reactivarMsg     = signal<string | null>(null);
  reactivando      = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('confirmado') === '1') {
      this.successMsg.set('¡Correo confirmado! Ya puedes iniciar sesión con tus credenciales.');
    } else if (params.get('reset') === '1') {
      this.successMsg.set('¡Contraseña actualizada! Inicia sesión con tu nueva contraseña.');
    } else if (params.get('reactivado') === '1') {
      this.successMsg.set('¡Cuenta reactivada! Ya puedes iniciar sesión con tus credenciales.');
    } else if (params.get('desactivada') === '1') {
      this.successMsg.set('Tu cuenta fue desactivada. Cuando quieras volver, reactívala desde aquí.');
    }
  }

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMsg.set('Ingresa tu correo y contraseña');
      return;
    }

    this.errorMsg.set(null);
    this.isLoading.set(true);

    const { error } = await this.auth.login(this.email, this.password);

    if (error) {
      this.errorMsg.set('Credenciales incorrectas. Intenta de nuevo.');
      this.isLoading.set(false);
      return;
    }

    // Esperar a que se cargue el perfil del usuario (máx 3s)
    const deadline = Date.now() + 3000;
    while (!this.auth.usuario() && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Si el login fue correcto pero no hay perfil visible, la cuenta está
    // desactivada (RLS oculta las filas inactivas). Cerramos y ofrecemos reactivar.
    if (!this.auth.usuario()) {
      await this.auth.signOutSilent();
      this.isLoading.set(false);
      this.mostrarReactivar.set(true);
      this.reactivarEmail = this.email;
      this.errorMsg.set('Tu cuenta está desactivada. Reactívala con tu correo para volver a ingresar.');
      return;
    }

    // Redirigir según el rol
    this.router.navigate([this.auth.getHomePath()]);
  }

  /** Envía el enlace de reactivación al correo. No revela si el correo existe. */
  async onEnviarReactivacion(): Promise<void> {
    if (!this.reactivarEmail.trim()) {
      this.reactivarMsg.set('Ingresa tu correo.');
      return;
    }
    this.reactivando.set(true);
    this.reactivarMsg.set(null);

    await this.auth.enviarEnlaceReactivacion(this.reactivarEmail.trim());

    this.reactivando.set(false);
    this.reactivarMsg.set('Si existe una cuenta con ese correo, te enviamos un enlace para reactivarla. Revisa tu bandeja de entrada.');
  }
}
