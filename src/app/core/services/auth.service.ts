import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { SupabaseClient, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface UsuarioVCM {
  id_usuario: number;
  auth_uid: string;
  rut_usuario: string;
  nombres_usuario: string;
  apellidos_usuario: string;
  telefono_usuario: string;
  is_active: boolean;
  fecha_creacion: string;
  id_rol: number;
  rol?: { nombre_rol: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _session = signal<Session | null>(null);
  private _usuario = signal<UsuarioVCM | null>(null);
  private _loading = signal<boolean>(true);
  private supabase: SupabaseClient;

  session = computed(() => this._session());
  usuario = computed(() => this._usuario());
  loading = computed(() => this._loading());
  isAuthenticated = computed(() => !!this._session());
  userRole = computed(() => this._usuario()?.rol?.nombre_rol ?? null);

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.supabase = this.supabaseService.client;
    this.initAuth();
  }

  private async initAuth(): Promise<void> {
    const { data: { session } } = await this.supabase.auth.getSession();
    this._session.set(session);

    if (session) {
      await this.loadUsuario(session.user.id);
    }
    this._loading.set(false);

    this.supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        this._session.set(session);

        if (event === 'SIGNED_IN' && session) {
          await this.loadUsuario(session.user.id);
        }

        if (event === 'SIGNED_OUT') {
          this._usuario.set(null);
        }
      }
    );
  }

  private async loadUsuario(authUid: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('usuario')
      .select('*, rol(nombre_rol)')
      .eq('auth_uid', authUid)
      .neq('is_active', false)  // permite NULL (no configurado) y true
      .single();

    if (!error && data) {
      this._usuario.set(data as UsuarioVCM);
    }
  }

  async login(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  }

  async register(
    email: string,
    password: string,
    metadata?: { rut: string; nombres: string; apellidos: string; telefono: string }
  ): Promise<{ error: string | null }> {
    const { error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    return { error: error?.message || null };
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this._session.set(null);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  async reloadPerfil(): Promise<void> {
    const session = this._session();
    if (session) await this.loadUsuario(session.user.id);
  }

  hasRole(role: string): boolean {
    return this.userRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const current = this.userRole();
    return current ? roles.includes(current) : false;
  }

  getHomePath(): string {
    const role = this.userRole();
    switch (role) {
      case 'admin': return '/admin/inicio';
      case 'cliente': return '/cliente/inicio';
      case 'profesor': return '/profesor/inicio';
      case 'encargado': return '/encargado/inicio';
      case 'autoridad': return '/autoridad/inicio';
      default: return '/login';
    }
  }
}
