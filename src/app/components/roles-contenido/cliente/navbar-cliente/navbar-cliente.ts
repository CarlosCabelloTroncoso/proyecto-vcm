import { Component, computed, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar-cliente',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-cliente.html',
  styleUrl: './navbar-cliente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarCliente {
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
