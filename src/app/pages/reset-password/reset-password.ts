import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Session, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private auth = inject(AuthService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  estado = signal<'verificando' | 'listo' | 'error'>('verificando');
  errorMsg = signal<string | null>(null);
  isLoading = signal(false);

  password = '';
  confirmPassword = '';

  async ngOnInit(): Promise<void> {
    const supabase = this.supabaseService.client;

    // Enlace PKCE (?code=...): intercambiar por sesión.
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      try { await supabase.auth.exchangeCodeForSession(code); } catch { /* flujo implícito */ }
    }

    // La sesión de recuperación se detecta desde la URL de forma asíncrona.
    const session = await this.esperarSesion(supabase, 6000);
    if (!session) {
      this.estado.set('error');
      return;
    }
    this.estado.set('listo');
  }

  async onGuardar(): Promise<void> {
    this.errorMsg.set(null);

    if (!this.password || !this.confirmPassword) {
      this.errorMsg.set('Completa ambos campos');
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMsg.set('Las contraseñas no coinciden');
      return;
    }

    this.isLoading.set(true);
    const { error } = await this.auth.updatePassword(this.password);
    this.isLoading.set(false);

    if (error) {
      this.errorMsg.set('No pudimos actualizar la contraseña. El enlace pudo expirar; solicita uno nuevo.');
      return;
    }

    // Cerramos la sesión de recuperación y mandamos al login para entrar con la nueva clave.
    await this.auth.signOutSilent();
    this.router.navigate(['/login'], { queryParams: { reset: '1' } });
  }

  private esperarSesion(supabase: SupabaseClient, timeoutMs: number): Promise<Session | null> {
    return new Promise(async resolve => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return resolve(session);

      const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
        if (s) { sub.subscription.unsubscribe(); resolve(s); }
      });
      setTimeout(() => { sub.subscription.unsubscribe(); resolve(null); }, timeoutMs);
    });
  }
}
