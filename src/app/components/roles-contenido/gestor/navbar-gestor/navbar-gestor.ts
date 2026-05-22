import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-gestor',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-gestor.html',
  styleUrl: './navbar-gestor.css',
})
export class NavbarGestor {
  mobileMenuOpen = false;
  profileMenuOpen = false;
}
