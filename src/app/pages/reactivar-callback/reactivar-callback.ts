import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Session, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-reactivar-callback',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reactivar-callback.html',
  styleUrl: './reactivar-callback.css',
})
export class ReactivarCallback implements OnInit {
  private auth = inject(AuthService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  estado  = signal<'cargando' | 'error'>('cargando');
  mensaje = signal('Reactivando tu cuenta…');

  async ngOnInit(): Promise<void> {
    const supabase = this.supabaseService.client;

    // Si el enlace usa flujo PKCE (?code=...), intercambiar el código por sesión.
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      try { await supabase.auth.exchangeCodeForSession(code); } catch { /* flujo implícito */ }
    }

    // El enlace de un solo uso autentica al usuario; esperar a que exista la sesión.
    const session = await this.esperarSesion(supabase, 6000);
    if (!session) {
      return this.fallar('No pudimos validar el enlace. Puede haber expirado o ya fue usado. Solicítalo de nuevo desde el login.');
    }

    // Reactivar la cuenta (RPC con SECURITY DEFINER).
    const { error } = await this.auth.reactivarCuenta();
    if (error) {
      return this.fallar('No pudimos reactivar tu cuenta. Intenta de nuevo o contáctanos.');
    }

    // Cerramos la sesión del enlace para que ingrese con sus credenciales normales.
    await this.auth.signOutSilent();
    this.router.navigate(['/login'], { queryParams: { reactivado: '1' } });
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
