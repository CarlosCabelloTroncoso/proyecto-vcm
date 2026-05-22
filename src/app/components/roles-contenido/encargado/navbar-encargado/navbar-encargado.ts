import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-encargado',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-encargado.html',
  styleUrl: './navbar-encargado.css',
})
export class NavbarEncargado {
  mobileMenuOpen = false;
  profileMenuOpen = false;
}
