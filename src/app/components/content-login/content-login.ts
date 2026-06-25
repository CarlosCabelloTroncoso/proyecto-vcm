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

    // Redirigir según el rol
    this.router.navigate([this.auth.getHomePath()]);
  }
}
