import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Session, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback implements OnInit {
  private auth = inject(AuthService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  estado  = signal<'cargando' | 'error'>('cargando');
  mensaje = signal('Confirmando tu cuenta…');

  async ngOnInit(): Promise<void> {
    const supabase = this.supabaseService.client;

    // Si el enlace usa flujo PKCE (?code=...), intercambiar el código por sesión.
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      try { await supabase.auth.exchangeCodeForSession(code); } catch { /* flujo implícito */ }
    }

    // El cliente detecta el token del hash de la URL de forma asíncrona; esperar la sesión.
    // Si llega, significa que el correo se confirmó correctamente.
    const session = await this.esperarSesion(supabase, 6000);
    if (!session) {
      return this.fallar('No pudimos confirmar tu cuenta. El enlace puede haber expirado o ya fue usado.');
    }

    // Correo confirmado. Cerramos la sesión automática para que el usuario
    // ingrese sus credenciales manualmente en el login.
    await this.auth.signOutSilent();
    this.router.navigate(['/login'], { queryParams: { confirmado: '1' } });
  }

  /** Resuelve con la sesión apenas exista, o null si se agota el tiempo. */
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

  private fallar(msg: string): void {
    this.estado.set('error');
    this.mensaje.set(msg);
  }
}
