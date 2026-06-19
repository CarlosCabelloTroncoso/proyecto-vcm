import { Component, computed, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar-encargado',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-encargado.html',
  styleUrl: './navbar-encargado.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarEncargado {
  mobileMenuOpen = false;
  profileMenuOpen = false;

  iniciales = computed(() => {
    const u = this.auth.usuario();
    if (!u) return '';
    return ((u.nombres_usuario?.charAt(0) ?? '') + (u.apellidos_usuario?.charAt(0) ?? '')).toUpperCase();
  });

  nombreCompleto = computed(() => {
    const u = this.auth.usuario();
    if (!u) return '';
    return `${u.nombres_usuario} ${u.apellidos_usuario}`;
  });

  cargo = computed(() => {
    const map: Record<string, string> = {
      admin: 'Administrador',
      encargado: 'Gestor de Vinculación',
      autoridad: 'Autoridad',
      profesor: 'Profesor',
    };
    const role = this.auth.userRole();
    return role ? (map[role] ?? role) : '';
  });

  constructor(private auth: AuthService, private el: ElementRef, private cdr: ChangeDetectorRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.profileMenuOpen && !this.el.nativeElement.contains(event.target)) {
      this.profileMenuOpen = false;
      this.cdr.markForCheck();
    }
  }

  cerrarSesion(): void {
    this.profileMenuOpen = false;
    this.auth.logout();
  }
}
